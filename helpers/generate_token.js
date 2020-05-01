const jwt = require('jsonwebtoken')

const generateToken = async (user) => {
    try {
        let token = await jwt.sign({'_id': user._id}, 'jwtsecret', {expiresIn: '30 minutes'})

        if(token) {
            user.tokens.push({ token })
            user.save()
            return token;
        }
        return false;
    }
    catch(e) {  
        return 'Something went wrong'
    }
}


module.exports = generateToken