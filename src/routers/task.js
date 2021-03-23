const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req,res)=>{
    const task = new Task({...req.body,owner:req.user._id});
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc
router.get('/tasks',auth,async (req,res)=>{
    const match = {};
    const sort = {};

    const completed = req.query.completed;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const sortBy = req.query.sortBy;
    
    let skip = limit * (page-1);
    skip = skip < 1 && 0;

    if(completed) match.completed = completed === 'true';
    if(sortBy){
        const val = sortBy.split('_');
        sort[val[0]] = val[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit,
                skip,
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    try {
       const task = await Task.findOne({_id, owner: req.user._id});
       if(!task) return res.status(404).send('No Tasks');
       res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed','description'];
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation) return res.status(400).send({'error':'Invalid updates'});
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});
        if(!task) return res.status(404).send('Task not found');
        updates.forEach((update)=>task[update]=req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task) return res.status(404).send();
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;
