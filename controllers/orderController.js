const Craft =require('./../models/craftModel');
const Order =require('./../models/orderModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
const isLogIn=require('./../utils/isLogIn');
const cloudinary=require('./../config/cloudinary');
const upload=require('../config/multer');
const path=require('path');

exports.getAllOrders= catchAsync(async(req,res,next)=>{
    const orders= await Order.find().populate('crafts','name').select('title');
    res.status(200).json(
        {
        status :'success',
         result:orders.length,
             data:
             {
                orders
             },
        });
    next();
});
exports.createOrder=catchAsync(async(req,res,next)=>{
      // const {title,orderDifficulty,description,photo,craft}=req.body;
      
     
    //    const craftFound=await Craft.find({name:' '});
    //    if(!craftFound){
    //     return next(new AppError("craft does not exist",401));
    //    }
       
         // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
    
        // Create new order
        let newOrder = await Order.create({
          title: req.body.title,
          orderDifficulty: req.body.orderDifficulty,
          description: req.body.description,
          
          user:req.userAuthId,
          avatar: result.secure_url,
          cloudinary_id: result.public_id,
        });
    
          await newOrder.save();//created at , updated at
           
    // const newOrder= await Order.create({
    //   craft,
    //   title,
    //   orderDifficulty,
    //   description,
    //   pho,
    //   user:req.userAuthId,
    // });

   // craftFound.orders.push(newOrder._id);//

    //await craftFound.save();

    res.status(201).json({
            status:'success',
            data:{
                order:newOrder
            },
         });  
    next();
});    