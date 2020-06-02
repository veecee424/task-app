const request = require('supertest');
const app = require('../app')
require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const userOne = {
    name: 'Veecee',
    password: '123test',
    email: 'veecee@example.com'
}

beforeEach(async ()=> {
    /**delete already existing users in the DB */
    await User.deleteMany() 
    /**Create another one for other routes that require authentication */
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
