const userController =require( './../controllers/userController');
const authController =require( './../controllers/authController');
const upload=require('../config/cloudinary');
const express = require('express');
//const Router=express();
const router=express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updatePassword',authController.protect,authController.updatePassword);

router.post('/:id/myCraft',
authController.protect,
authController.restrictTo('worker'),
userController.myCraft);

module.exports=router;
