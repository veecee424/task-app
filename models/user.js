const mongoose = require("mongoose")
const validator = require('validator')

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    age: {
        type: Number,
        default: 0,
        trim: true,
        validate (value) {
            if (value < 0) {
                throw new Error ('Age must not be less than zero')
            }
        }
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Please enter a valid email')
            }
        }
    }, 

    password: {
        type: String,
        validate (value) {
            if (value.includes('password')) {
                throw new Error ("password must not contain 'password'")
            }

            if (value.length < 6) {
                throw new Error ('Password length must be greater than 6')
            }
        }
    },

    tokens: [{
        token: {
            type: String
        }
    }]
})


/**
 * Hide sensitive details
 */
// userSchema.methods.toJSON = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }

const User = mongoose.model('user', userSchema)

module.exports = User;