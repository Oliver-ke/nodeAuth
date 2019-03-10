const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const upload =  require('../config/multer');

//models
const Category = require('../model/categoryModel');
const Step = require('../model/stepModel');
const Group = require('../model/groupModel');

// welcome page
router.get('/', (req,res,next) =>{
    res.render('login'); 
})

// dashboard
router.get('/dashboard',ensureAuthenticated,(req,res,next) =>{
    res.render('dashboard',{
        layout: 'layouts/mainLayout',
        user: req.user.name
    })
})

//Category routes
router.get('/category',ensureAuthenticated,(req, res,next) =>{
    Category.find()
        .then(categories =>{
            res.render('category',{
                layout: 'layouts/mainLayout',
                user: req.user.name,
                categories
            })
        })
        .catch(err => console.log(err));
    
})

router.post('/category',ensureAuthenticated,(req, res,next) =>{
    const {name,description} = req.body;
    console.log(req.body)
    const newCategory = new Category({
        name,
        description,
        createdBy: req.user.name
    })
    newCategory.save()
        .then((cat) =>{
            // handle add request
            req.flash('success_msg','Category added')
            res.redirect('/category')
        })
        .catch(err =>{
            console.log(err)
        })
})

router.post('/category/:id',ensureAuthenticated,(req, res,next) =>{
    const {id} =req.params;
    Category.findOneAndDelete({_id:id})
        .then(item =>{
            let msg = 'Category named ' + '[ ' + item.name + ' ]' +' was successfully deleted'
            req.flash('success_msg',msg)
            res.redirect('/category');
        }) 
        .catch(err => console.log(err));
})

//Guid route
router.get('/group',ensureAuthenticated,(req, res,next) =>{
    let categories = [];
    Category.find()
        .then((items) =>{
           categories = items;
        })
        .catch(err => console.log(err))

    Group.find()
        .then(groups =>{
            res.render('group',{
                layout: 'layouts/mainLayout',
                user: req.user.name ,
                groups,
                categories 
            })
        })
        .catch(err => console.log(err))

    
})

router.post('/group',ensureAuthenticated,(req, res,next) =>{
   const  {name, category} = req.body;
   let newGroup = new Group({
       name,
       categoryName: category,
       createdBy: req.user.name
   })
   newGroup.save()
    .then(item =>{
        req.flash('success_msg','Group added')
        res.redirect('/group')
    })
    .catch(err => console.log(err))
})


//steps route
router.get('/step',ensureAuthenticated,(req, res,next) =>{
    Step.find()
        .then((steps) =>{
            Group.find()
            .then((groups) =>{
                res.render('step',{
                    layout: 'layouts/mainLayout',
                    user: req.user.name,
                    steps,
                    groups
                })
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

router.post('/step',ensureAuthenticated,upload.single('imgUrl'),(req, res,next) =>{
    const {name,description,stepNo, groupName} = req.body;
    const errors = [];
   if(!name || !description || !stepNo || !groupName){
    Step.find()
    .then((steps) =>{
        errors.push({msg: 'please fill out all input'});
        Group.find()
        .then((groups) =>{
            res.render('step',{
                layout: 'layouts/mainLayout',
                user: req.user.name,
                steps,
                errors,
                groups,
                stepNo,
                name,
                description,
                groupName
            })
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
   }
   else{   
    const newStep = new Step({
        name,
        description,
        stepNo,
        groupName
    })
    if( typeof req.file != 'undefined' || null ){
        newStep.imgUrl = req.file.path;
    }
    newStep.save()
    .then((step) =>{
        let stepRes = 'Step named ' + '[ ' + step.name + ' ]' +' was successfully deleted'
        req.flash('success_msg',stepRes)
        res.redirect('/step');
    })
    .catch(err =>{
        console.log(err)
    });
   }
})
module.exports = router;

