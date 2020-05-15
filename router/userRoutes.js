const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const generateToken = require('../helpers/generate_token')
const isAuthenticated = require('../Middlewares/auth')
const hideDetails = require('../helpers/hideDetails')
const removeTasks = require('../helpers/removeTask')
const multer = require('multer')

let validType = ['JPG', 'JPEG', 'PNG']

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
      
        let isValid = validType.filter((type) => {
            return file.originalname.toUpperCase().endsWith(type); 
        })
        isValid[0] !== undefined ? cb(null, true) : cb(new Error('upload a valid image file'))
        
    }
})


router.post('/user', async (req, res) => {

    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
         ...req.body,
         password: hashedPassword,
         
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


router.get('/user/me', isAuthenticated, (req, res) => {
    
        hideDetails(req.user)
        return res.send(req.user)
   
})


router.patch('/user/me', isAuthenticated, async (req, res) => {
    const updateFields = Object.keys(req.body);
    const validFields = ['name', 'password', 'age', 'email']
    const isValidField = updateFields.every((field) => {
        return validFields.includes(field)
    })
    
    if(!isValidField) {
        return res.status(400).send('Bad update field')
    }


    try {
        let user = await User.findByIdAndUpdate({_id: req.user._id}, req.body, {new: true, runValidators: true})
        hideDetails(user)
        return res.send({user, 'status': 'Updated successfully'})
    }
    catch (e) {
        return res.status(500).send()
    }
})

router.delete('/user/me', isAuthenticated, async (req, res) => {
    try {
        let deletedUser = await req.user.remove()
        if(!deletedUser) {
            throw new Error ('Something went wrong')
        }
        await removeTasks(req.user)
        return res.send('Successfully deleted')
    }
    catch (e) {
        res.status(500).send()
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


 router.post('/user/dp/me', isAuthenticated, upload.single('avatar'), async (req, res) => {
     req.user.displayPicture = req.file.buffer
    await req.user.save();
    res.send('done')
 }, (error, req, res, next) => {
     return res.status(400).send({error: error.message})
 })

 router.delete('/user/avatar/me', isAuthenticated, async (req, res) => {
    req.user.displayPicture = undefined;
    await req.user.save()
    res.send('done');
 })

 router.get('/user/dp/me', isAuthenticated, async (req, res) => {
     try {
         let user = await User.findById(req.user._id);
        
         if(user && user.displayPicture) {
             res.set('Content-Type', 'image/jpeg')
             return res.send(user.displayPicture)
         }
         
         throw new Error('Unable to find user display picture')
     } catch (e) {
        res.status(400).send({error: e})
     }
 })


module.exports = router;