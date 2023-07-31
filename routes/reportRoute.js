const authController =require( './../controllers/authController');
const reportController =require( './../controllers/reportController');
const express = require('express');
const router=express.Router();

router
.post('/:reportedId',authController.protect,
    authController.restrictTo('worker','client'),
    reportController.addReport);
module.exports=router;