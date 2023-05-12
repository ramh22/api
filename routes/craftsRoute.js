const craftController =require( './../controllers/craftController');
const authController =require( './../controllers/authController');
//const orderController =require( './../controllers/orderController');
const orderRoutes =require( '../routes/ordersRoute');
const upload=require('../config/multer');
const isLogIn=require('../utils/isLoggedIn');
const express = require('express');
//const Router =express();
const router=express.Router();


router.use('/:craftId/orders',orderRoutes);
router
  .route('/')
  .get(authController.protect,
    authController.restrictTo('client','admin'),
    craftController.getCrafts, 
    craftController.getAllCrafts);

router.route('/:id')
.get(authController.protect,
    authController.restrictTo('client','admin','worker'),
   // craftController.craft,
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

router.post('/',
authController.protect,
authController.restrictTo('admin'),
upload.single('image'),
craftController.createCraft);

// router.route('/:craftId/orders').post(
// authController.protect,
// authController.restrictTo('client'),
// upload.single('image'),
// //orderController.setCraftUserIds,
// orderController.createOrder);




module.exports=router;