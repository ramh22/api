const userController =require( './../controllers/userController');
const craftController =require( './../controllers/craftController');
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

router.route('/:id').get(userController.getUser);
router.get('/:id',
    userController.getMyCraftID,
    userController.getUser);  

router.get('/profile/:id',
    authController.protect,
    userController.getProfile,
    userController.getUser);  
        
    router.patch('/image/:id',
        authController.protect,
        authController.restrictTo('worker','client'),
        upload.single("image"),
        userController.addUserPhoto
        );
        router.patch('/imagesOfWorks/:id',
        authController.protect,
        authController.restrictTo('worker','client'),
        upload.array("images"),
        userController.addImagesOfWorks
        );        
router.patch('/profile/:id',
authController.protect,
authController.restrictTo('worker','client'),
userController.updateProfile
);
router.get('/workersOfCraft/:craftId',userController.getUsersOfCraft);
module.exports=router;
