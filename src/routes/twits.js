const express = require('express');
const Note = require('../models/Note');
const router = express.Router();
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes', isAuthenticated,  async(req, res) =>{
    const notes = await Note.find().sort({date: 'desc'}).lean();
    res.render('notes/list', {notes});
});

router.get('/notes/mylist',isAuthenticated,  async(req, res) =>{
    const mylist = await Note.find({username: req.user.username}).sort({date: 'desc'}).lean();
    res.render('notes/mylist', {mylist});
});

router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/add');
});

router.post('/notes/add', async(req, res) =>{
    const {message} = req.body;
    const errors = [];
    if(!message){
        errors.push({text: 'You cannot send a void post'});
    }
    if(errors.length > 0){
        res.render('notes/add',{
            errors,
            message
        });
    }else{
        const NewTwit = new Note({message});
        NewTwit.user = req.user.name;
        NewTwit.username = req.user.username;
        await NewTwit.save();
        req.flash('success_msg', 'Post added successfully');
        res.redirect('/notes');
    }
});


//Editar

router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit', {note});
})


router.put('/notes/edit/:id', isAuthenticated, async(req, res) =>{
    const {message} = req.body;
    if(!message){
        req.flash('error_msg', 'The post could not be edited succesfully');
    }else{
        await Note.findByIdAndUpdate(req.params.id, {message}).lean();
        req.flash('success_msg', 'Post edited successfully');
    }
    res.redirect('/notes/mylist');
});


//Eliminar

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Post deleted');
    res.redirect('/notes/mylist');
})

module.exports = router;