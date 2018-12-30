
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
const User = require('../model/userModel')
//login route
router.get('/login', (req,res,next) =>{
    res.render('login')
})

//register
router.get('/register', (req,res,next) =>{
    res.render('register')
})

//register handle
router.post('/register', (req,res,next) =>{
    const {name, password, email, password2} = req.body;
    let errors = []
    //check required filed
    if (!name || !email || !password || !password2){
        errors.push({msg: "please fill in all fields"});
    }

    //check password match 
    if(password !== password2){
        errors.push({msg: "passwords do not match"})
    }

    //check password lengt
    if(password.length < 6){
        errors.push({msg: "password should atleast 6 characters"})
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        //validation passes
        User.findOne({email:email})
            .then((user) =>{
                if(user){
                    //user exist
                    errors.push({msg: "Email already exist"})
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash password
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err
                            //set password to hashed
                            newUser.password = hash;

                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg','You are now registered and can login')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }

            })
        
    }
})

//login handle
router.post('/login', (req,res,next) =>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//logout handle
router.get('/logout', (req,res,next) =>{
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})
module.exports = router;