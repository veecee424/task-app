/** 
 * Express setup
*/
const express = require('express')
const app = express();
app.use(express.json());

/** 
 * Require database connection
*/
require('./db/mongoose')

/** 
 * Body-parser setup
*/
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

/**
 * Service maintenance middleware
 */
// app.use((req, res, next) => {
//     res.status(503).send('Maintenance ongoing, check back later')
//  })


/** 
 * Use routes
*/
const userRoutes = require('./router/userRoutes')
app.use(userRoutes)
const taskRoutes = require('./router/taskRoutes');
app.use(taskRoutes)


    


/**
 * Server listening
*/
app.listen(process.env.PORT || 3000, ()=> {
    console.log('app running on 3000')
})


