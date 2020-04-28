const express = require('express')
const router = express.Router()
const Task = require('../models/task')


router.post('/task', async (req, res) => {
    let task = new Task(req.body);
    try {
        const newTask = await task.save();
        return res.status(201).send(newTask)
    }

    catch (e) {
        return res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        let tasks = await Task.find({});
        return res.send(tasks)
       
    }
    catch (e) {
        return res.status(500).send(e)
    }
})

router.get('/task/:id', async (req, res) => {
    let _id = req.params.id
    try {
        let task = await Task.findById(_id);
        if(!task) {
            return res.status(404).send('Unable to find user')
        }

        return res.send(task)
    }

    catch (e) {
        return res.status(500).send(e)
    }
})

router.patch('/task/:id', async (req, res) => {

    const updateField = Object.keys(req.body);
    const validFields = ['completed', 'description']
    let isValidField = updateField.every((field) => {
        return validFields.includes(field)
    })

    if(!isValidField) {
        return res.status(400).send('Bad update parameter')
    }

    try { 
        let task = await Task.findByIdAndUpdate({_id: req.params.id}, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }
        return res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
})

router.delete('/task/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send('Task not found')
        }

        return res.send('Successfully deleted')
    }
    catch(e) {
        res.status(500).send()
    }
})


module.exports = router;