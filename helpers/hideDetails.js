
const hideDetails = (user) => {
    user.toJSON = function () {
  
        const userObject = user.toObject()
        delete userObject.password
        delete userObject.tokens
        return userObject
    }
}


module.exports = hideDetails