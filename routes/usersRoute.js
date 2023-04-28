const userController =require( './../controllers/userController');
const authController =require( './../controllers/authController');
const express = require('express');
const router= express.Router();

router.post('/api/v1/users/register',authController.register);
router.post('/api/v1/users/login',authController.login);
router.post('/api/v1/users/forgotPassword',authController.forgotPassword);
router.patch('/api/v1/users/resetPassword/:token',authController.resetPassword);
router.patch('/api/v1/users/updatePassword',authController.protect,authController.updatePassword);

router.post('/api/v1/users/:id/myCraft',
authController.protect,
authController.restrictTo('worker'),
userController.myCraft);

module.exports=router;
/*
eyJhbGciOiJIUzUxMiJ9.eyJkYXRhIjp7InRva2VuIjoiZTYwZjQ1ZDc4ZWQyOWIzYWM3NDI0ODEwN2E5YTA3ZDEifX0.VLFZmK8MjYTMpHa26BTyTiAikzz4MVR_pCHu0QVDgWk0LdXIq59QnNwencS4fxJRk8OHhc84sN3SeoSlC66GJw*/