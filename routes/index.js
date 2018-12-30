const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth')
// welcome page
router.get('/', (req,res,next) =>{
    res.render('welcome'); //this renders the welcome view
    
})

// dashboard
router.get('/dashboard',ensureAuthenticated,(req,res,next) =>{
    res.render('dashboard',{
        user: req.user.name
    })
})

module.exports = router;