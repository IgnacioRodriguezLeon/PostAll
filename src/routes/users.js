const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');


//Registro
router.get('/signup', (req,res) =>{
    res.render('users/signup');
});

router.post('/signup', async(req, res) =>{
    const {username, name, email, password, matchpassword} = req.body;
    const errors = [];
    if(username.length == 0 || name.length == 0 || email.length == 0 || password.length == 0 ||matchpassword.length == 0 ){
        errors.push({text: 'Fields can not be null'});
    }
    if(password != matchpassword){
        errors.push({text: 'Password dont match'});
    }
    if(password.length < 5){
        errors.push({text: 'Password need to have 4 characters min'});
    }
    if(errors.length > 0 ){
        res.render('users/signup', {
            errors, 
            username,
            name,
            email,
            password,
            matchpassword
        })
    }else{
        const usernameField = await User.findOne({username: username});
        if(usernameField){
            req.flash('error_msg', 'Username alredy used');
            res.redirect('/users/signup');
        }
        const newUser = new User({username, name, email, password})
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'User registred');
        res.redirect('/users/login')
    }
});



//Logueo
router.get('/login', (req, res) =>{
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true
}));

//Logout

router.get('/logout', (req, res) =>{
    req.logOut();
    res.redirect('/users/login');
})

module.exports = router;