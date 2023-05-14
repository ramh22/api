const orderController =require( '../controllers/orderController');
const authController =require( '../controllers/authController');
const craftController =require( '../controllers/craftController');

const upload=require('../config/multer');
const isLogIn=require('../utils/isLoggedIn');
const express = require('express');

const router=express.Router({mergeParams:true});

router.route('/ordersInCraft/:id').get(
    authController.protect,
    authController.restrictTo('worker','admin'),
    orderController.getAllOrders);

    //reviewRouter.post("/:productID", isLoggedIn, createCtrl);
router.route('/').post(
authController.protect,
authController.restrictTo('client'),
upload.single('image'),
//orderController.setCraftUserIds,
orderController.createOrder);

router.route('/:id').delete(authController.protect,
    authController.restrictTo('client','admin') ,
    orderController.deleteOrder);
module.exports= router;