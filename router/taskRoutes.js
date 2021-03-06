const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const isAuthenticated = require('../Middlewares/auth')


router.post('/task', isAuthenticated, async (req, res) => {
    let task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        const newTask = await task.save();
        return res.status(201).send(newTask)
    }

    catch (e) {
        return res.status(400).send(e)
    }
})

router.get('/tasks', isAuthenticated, async (req, res) => {

    let completeStatus;
    req.query.completed === 'true' ? completeStatus = true 
    : (req.query.completed === 'false'  ? completeStatus = false : req.query.completed === undefined)

    let sort = {};
        if (req.query.sort) {
            let key =  req.query.sort.indexOf(':');
            let sortBy =  req.query.sort.slice(0, key);
            let sortType =  req.query.sort.slice(key+1);
            let sorting;
            sortType === 'des' ? sorting = -1 : (sortType === 'asc' ? sorting = 1 : sortType === undefined)
            sort[sortBy] = sorting;
        }

    try {
    
        if(req.query.completed === undefined) {
            let tasks = await Task.find({owner: req.user._id})
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
            return res.send(tasks)
        } 

        let tasks = await Task.find({owner: req.user._id, completed: completeStatus})
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip));
        return res.send(tasks)
    }
    catch (e) {
        console.log(e, 'error')
        return res.status(500).send(e)
    }
})

router.get('/task/:id', isAuthenticated, async (req, res) => {
    
    try {
        let task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if(!task) {
            return res.status(404).send('Task not found!')
        }

        return res.send(task)
    }

    catch (e) {
        return res.status(500).send(e)
    }
})

router.patch('/task/:id', isAuthenticated, async (req, res) => {

    const updateField = Object.keys(req.body);
    const validFields = ['completed', 'description']
    let isValidField = updateField.every((field) => {
        return validFields.includes(field)
    })

    if(!isValidField) {
        return res.status(400).send('Bad update parameter')
    }

    try { 
        let task = await Task.findOneAndUpdate({_id: req.params.id, owner: req.user._id}, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }
        return res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
})

router.delete('/task/:id', isAuthenticated, async (req, res) => {
    try {
        let task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send('Unable to perform operation')
        }

        return res.send('Successfully deleted')
    }
    catch(e) {
        console.log(e)
        res.status(500).send()
    }
})


module.exports = router;