const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const Task = require('../../models/task')


const userOneId = new mongoose.Types.ObjectId;
const userOne = {
    _id: userOneId,
    name: 'Veecee',
    password: '123test',
    email: 'veecee@example.com',
    tokens: [{
        token: jwt.sign({'_id': userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId;
const userTwo = {
    _id: userTwoId,
    name: 'Vee',
    password: 'testingStill',
    email: 'vee@example.com',
    tokens: [{
        token: jwt.sign({'_id': userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: 'Task one',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: 'Task two',
    completed: true,
    owner: userOneId
}

const setupDatabase = async () => {
    await User.deleteMany() 
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
}

module.exports = {
     userOne, userTwo, taskOne, taskTwo,setupDatabase
}