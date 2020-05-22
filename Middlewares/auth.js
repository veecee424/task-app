const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()

const isAuthenticated = async (req, res, next) => {
    
    try {
        let token = await req.header('authToken');
        let verified = await jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findOne({'_id': verified._id, 'tokens.token': token})

        if(user) {
            req.user = user;
            req.token = token; 
            return next()
        }

        throw new Error()

    } catch (error) {
        return res.status(401).send('You are not logged in')
    }
    }


module.exports = isAuthenticated;