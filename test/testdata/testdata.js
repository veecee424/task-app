const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')


const userId = new mongoose.Types.ObjectId;
const userOne = {
    _id: userId,
    name: 'Veecee',
    password: '123test',
    email: 'veecee@example.com',
    tokens: [{
        token: jwt.sign({'_id': userId}, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany() 
    await new User(userOne).save()
}

module.exports = {
    userId, userOne, setupDatabase
}