const jwt = require('jsonwebtoken')
const User = require('../models/user')

const isAuthenticated = async (req, res, next) => {
    
    try {
        let token = await req.header('authToken');
        let verified = await jwt.verify(token, 'jwtsecret');
        let user = await User.findOne({'_id': verified._id, 'tokens.token': token})

        if(user) {
            req.user = user;
            req.token = token; // This is to ensure the token is made available to the route making a request with the isAuthenticated middleware
            return next()
        }

        throw new Error()

    } catch (error) {
        return res.status(401).send('You are not logged in')
    }
    }


module.exports = isAuthenticated;