const request = require('supertest');
const app = require('../app')
require('dotenv').config()
const User = require('../models/user')
const {userId, userOne, setupDatabase} = require('./testdata/testdata')



const userUpdate = {
    name: 'Veecee',
    password: '123testUpdate',
    email: 'veecee@example.com',
    age: 120
}

beforeEach(async ()=> {
    await setupDatabase()
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

test('Should update valid user fields', async (done)=> {
    const response = await request(app)
    .patch('/user/me')
    .set('authToken', userOne.tokens[0].token)
    .send(userUpdate)
    .expect(200)
    expect(response.body.user.age).toBe(120)
    done()
})

test('Should not update invalid fields', async (done) => {
    await request(app)
    .patch('/user/me')
    .set('authToken', userOne.tokens[0].token)
    .send({
        location: 'Owerri'
    })
    .expect(400)
    done()
})

test('Should upload a user profile picture', async (done) => {
    await request(app)
    .post('/user/dp/me')
    .set('authToken', userOne.tokens[0].token)
    .attach('avatar', './test/fixtures/dptest.JPG')
    .expect(200)
    done()
})

