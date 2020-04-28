const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        trim: true,
        default: false
    }
})

const Task = mongoose.model('task', taskSchema);

module.exports = Task;