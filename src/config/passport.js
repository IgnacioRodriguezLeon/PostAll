const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//Autenticacion
passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) =>{
    const user = await User.findOne({username: username});
    if(!user){
        return done(null, false, {message: 'Username not found'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password'});
        }
    }
}));


//Serializacion del usuario

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) =>{
        done(err, user);
    })
})
