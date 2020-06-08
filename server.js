const app = require('./app')
require('dotenv').config()
const port = process.env.PORT  ;

app.listen(process.env.PORT, ()=> {
    console.log(`app running on ${port}`)
})
