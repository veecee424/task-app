const app = require('./app')
require('dotenv').config()

app.listen(process.env.PORT, ()=> {
    console.log(`app running on ${port}`)
})
