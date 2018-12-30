const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load userModel
const User = require('../model/userModel');

module.exports = passport =>{
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password,done)=>{
            //match user
            User.findOne({email:email})
                .then( user =>{
                    if(!user){
                        return done(null,false,{message: 'Incorrect Password or Email'})
                    }
                    //match the password
                    bcrypt.compare(password,user.password, (err,ismatch) =>{
                        if(err) throw err;
                        if(ismatch){
                            return done(null, user);
                        }else{
                            return done(null,false,{message: 'Incorrect Password or Email'})
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    )
    // serializing the deserializing session stored in the users browser
    passport.serializeUser((user,done) =>{
        done(null,user.id)
    });
    
    passport.deserializeUser((id,done) =>{
        User.findById(id, (err,user) =>{
            done(err,user);
        })
    })

}