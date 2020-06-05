const request = require('supertest');
const app = require('../app')
require('dotenv').config()
const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


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

beforeEach(async ()=> {
    await User.deleteMany() 
    await new User(userOne).save()
})


test('Should create a new user', async (done) => {
    await request(app)
    .post('/user')
    .send({
        name: 'Valentine',
        email: 'val@example.com',
        password: 'veecee424'
    }).expect(201)
    done()
})

test('Should log in existing user', async (done) => {
   await request(app)
    .post('/user/login')
    .send({
        password: '123test',
        email: 'veecee@example.com'
    }).expect(200)
    done()
})

test('Should not log in non-existent user', async (done)=> {
    await request(app)
    .post('/user/login')
    .send({
        email: userOne.email,
        password: 'wrong password'
    })
    .expect(400)
    done()
})

test('Should get profile of an authenticated user', async (done) => {
    await request(app)
    .get('/user/me')
    .set('authToken', `${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    done()
})

test('Should not get profile of an unauthenticated', async (done)=> {
    await request(app)
    .get('/user/me')
    .send()
    .expect(401)
    done()
})

test('Should delete user account', async (done) => {
    await request(app)
    .del('/user/me')
    .set('authToken', `${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
    done()
})

test('Should not delete account for unauthenticated user', async (done) => {
    await request(app)
    .del('/user/me')
    .send()
    .expect(401)
    done()
})


