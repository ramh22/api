const orderController =require( '../controllers/orderController');
const authController =require( '../controllers/authController');
const craftController =require( '../controllers/craftController');
const upload=require('../config/multer');
const isLogIn=require('../utils/isLogIn');
const express = require('express');

const router=express.Router();
router.route('/ordersInCraft/:id').get(
    authController.protect,
    authController.restrictTo('worker','admin'),
    orderController.getAllOrders);

router.post('/',//craft_id
authController.protect,
authController.restrictTo('client') ,
upload.single('image') ,
orderController.createOrder);

module.exports=router;