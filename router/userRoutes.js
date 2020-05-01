const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const generateToken = require('../helpers/generate_token')
const isAuthenticated = require('../Middlewares/auth')
const hideDetails = require('../helpers/hideDetails')




router.post('/user', async (req, res) => {

    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
         name: req.body.name,
         password: hashedPassword,
         age: req.body.age,
         email: req.body.email
        });
   
    try {

        const newUser = await user.save();

        await generateToken(newUser)

        return res.status(201).send({newUser})
        
    }
    catch (e) {
        return res.status(400).send(e)
    }
    
})

router.post('/user/login', async (req, res) => {

    const { email, password } = req.body;

    try {   
        let user = await User.findOne({email})
        
        if(!user) {
            return res.status(404).send('User does not exist')
        }
   
        let correctPassword = await bcrypt.compare(password, user.password)
 
        if(correctPassword) {
            let token = await generateToken(user)
           hideDetails(user)
            return res.send({user, token});
        }
  
        return res.status(400).send('Password does not match')
    }
    catch (e) {
        res.status(500).send('something went wrong')
    }
})


router.post('/user/logout', isAuthenticated, async (req, res) => {
   try {
       req.user.tokens = await req.user.tokens.filter((tokens) => {
           return tokens.token !==  req.token;
       })
       await req.user.save()
       return res.send('Logout successful')
   } catch (error) {
       res.status(500).send()
   }
})


router.get('/user/me', isAuthenticated, (req, res) => {
        return res.send(req.user)
   
})

router.get('/user/:id', async (req, res)=> {
    let _id = await req.params.id;

    try {
        let user = await User.findById(_id);

        if(!user) {
            return res.status(404).send('Unable to find user');
        } 

        return res.send(user)

    } 
    catch(e) {
        return res.status(500).send(e);
    }

})

router.patch('/user/:id', async (req, res) => {
    const updateFields = Object.keys(req.body);
    const validFields = ['name', 'password', 'age', 'email']
    const isValidField = updateFields.every((field) => {
        return validFields.includes(field)
    })
    
    if(!isValidField) {
        return res.status(400).send('Bad update field')
    }


    try {
        let user = await User.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})

        if(!user) {
            return res.status(404).send()
        }

        return res.send(user)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send()
    }
})

router.delete('/user/:id', async (req, res) => {
    try {
        let task = await User.findByIdAndDelete(req.params.id)

        if(!task) {
            return res.status(404).send('user not found')
        }
        return res.send('Successfully deleted')
    }
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router;