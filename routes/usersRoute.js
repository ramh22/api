const userController =require( './../controllers/userController');
//const craftController =require( './../controllers/craftController');
const authController =require( './../controllers/authController');

const upload=require('../config/multer');
const express = require('express');
const isLogIn = require('../utils/isLoggedIn');

//const router=express.Router({mergeParams:true});
//const Router=express();
const router=express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updatePassword',
authController.protect,
authController.updatePassword);

router.put('/:id',
authController.protect,
authController.restrictTo('worker'),
userController.myCraft);

router.get('/:id',
    userController.getMyCraftID,
    userController.getUser);  

    router.get('/profile/:id',
    authController.protect,
    userController.getProfile,
    userController.getUser);  
        
    router.patch('/profile/:id',
        authController.protect,
        authController.restrictTo('worker','client'),
        //upload.single("image"),
        userController.updateProfile
        );
module.exports=router;
