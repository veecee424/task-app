const request = require('supertest')
const app = require('../app')
const Task = require('../models/task')
const { userOne, userTwo, taskOne, taskTwo, setupDatabase } = require('./testdata/testdata')



beforeEach(async () => {
    await setupDatabase()
})

test('Should create task for a user', async (done) => {
    await request(app)
    .post('/task')
    .set('authToken', userOne.tokens[0].token)
    .send({
        description: 'Finish this course'
    })
    .expect(201)
    done()
})

test('Should fetch all tasks for userOne', async (done) => {
    const response = await request(app)
    .get('/tasks')
    .set('authToken', userOne.tokens[0].token)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
    done()
})

test('Should not delete another user\'s task', async (done) => {
    const response = await request(app)
    .del(`/task/${taskTwo._id}`)
    .set('authToken', userTwo.tokens[0].token)
    .send()
    .expect(404)
    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
    done()
})