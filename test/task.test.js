const request = require('supertest')
const app = require('../app')
const { userOne, userId, setupDatabase } = require('./testdata/testdata')



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
