const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const methodOverdrive = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Initialization
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers/timeago')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverdrive('_method'));
app.use(session({
    secret: 'twitter',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables

app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/twits'));
app.use('/users', require('./routes/users'));
//Static Files

app.use('/public', express.static(__dirname + '/public'));

//Server Listen
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});