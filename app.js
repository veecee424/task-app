//Express setup
const express = require('express')
const app = express();
app.use(express.json());
const cors = require('cors')

//Require database connection
require('./db/mongoose')

//Setup body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Use cors
app.use(cors())

app.get('/', (req, res) => {
    return res.send('Welcome to my task manager API!')
});

//Use routes
const userRoutes = require('./router/userRoutes')
app.use(userRoutes)
const taskRoutes = require('./router/taskRoutes');
app.use(taskRoutes)

app.use((e, req, res, next)=> {
    return res.status(400).send(e.errors.password.message)
})

module.exports = app

