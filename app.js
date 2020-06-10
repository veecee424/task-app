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

module.exports = app

<<<<<<< HEAD
    


/**
 * Server listening
*/
app.listen(process.env.PORT || 3000, ()=> {
    console.log('app running on 3000')
})
=======
>>>>>>> d99f52340c2684aa4200641d2ce8ebacc1a23049
