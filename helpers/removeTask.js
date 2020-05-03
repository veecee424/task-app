const Task = require('../models/task')

const removeTask = async (user) => {

    try {

       let success = await Task.deleteMany({owner: user._id})

        if(!success) {
            throw 'Something went wrong'
        }

    } 
    
    catch (e) {
        return e
    }
    
}

module.exports = removeTask;