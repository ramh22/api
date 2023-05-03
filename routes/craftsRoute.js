const craftController =require( './../controllers/craftController');
const authController =require( './../controllers/authController');
const upload=require('../config/multer');
const isLogIn=require('./../utils/isLogIn');
const express = require('express');
//const Router =express();
const router=express.Router();

router.route('/:id')
.get(craftController.getCraft)
.delete(
    authController.protect,
    authController.restrictTo('admin'),
    craftController.deleteCraft)
    .patch(
    authController.protect,
    authController.restrictTo('admin'),
    upload.single("image"),
    craftController.updateCraft
    );

router.route('/')
.get(
    authController.protect,
    authController.restrictTo('admin','client'),
    craftController.getAllCrafts);

router.post('/',
authController.protect,
authController.restrictTo('admin'),
upload.single('image'),
craftController.createCraft);

module.exports=router;