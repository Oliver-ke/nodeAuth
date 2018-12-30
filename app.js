const express = require('express')
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const app = express()

//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser:true})
    .then(() => console.log('MongoDb connected..'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

//bodyparser-> this is now built into express
app.use(express.urlencoded({extended: false}));

//express session middleware
app.use(session({
    secret: 'wolfsLover',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());

//global var
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server started started on port ${PORT}`)
})