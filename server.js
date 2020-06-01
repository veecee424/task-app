const app = require('./app')
require('dotenv').config()

app.listen(process.env.PORT || 3000, ()=> {
    console.log('app running on 3000')
})
