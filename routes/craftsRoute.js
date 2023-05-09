const craftController =require( './../controllers/craftController');
const authController =require( './../controllers/authController');
const upload=require('../config/multer');
const isLogIn=require('../utils/isLoggedIn');
const express = require('express');
//const Router =express();
const router=express.Router();

router.route('/:id')
.get(authController.protect,
    authController.restrictTo('admin','client'),
    craftController.getCraft)
.delete(
    authController.protect,
    authController.restrictTo('admin','client'),
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