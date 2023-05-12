const Craft =require('./../models/craftModel');
const Order =require('./../models/orderModel');
const User =require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
const isLogIn=require('../utils/isLoggedIn');
const cloudinary=require('./../config/cloudinary');
const upload=require('../config/multer');
const path=require('path');
const util = require('util');
const { isNull } = require('util');

exports.getAllOrders= catchAsync(async(req,res,next)=>{
  let filter={};
  if(req.params.craftId) filter={craft:req.params.craftId};
   // const orders= await Order.find().populate('crafts','name').select('title orderDifficulty');
   const orders= await Order.find(filter);
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
/*exports.createOrder=catchAsync(async(req,res,next)=>{
      const user=await User.findById(req.userAuthId);

      // const craft=await Craft.findById(req.params._id);
      // if(!craft){
      //  return next(new AppError("craft does not exist",401));
      // }
      // const {title,orderDifficulty,description}=req.body;
      
         //Upload image to cloudinary
      // req=req.file.path||null;
      //  const result = await cloudinary.uploader.upload(req);//(req.file.path||null);
    
        // Create new order
        let newOrder = await Order.create({
        craft:req.body.Craft.name,
          title: req.body.title,
          orderDifficulty: req.body.orderDifficulty,
          description: req.body.description,
          
          user:req.userAuthId,
         // avatar: result.secure_url,
          //cloudinary_id: result.public_id,
        });
    
          await newOrder.save();//created at , updated at
           
   
    res.status(201).json({
            status:'success',
            data:{
                order:newOrder
            },
         }); 
         
    Craft.orders.push(newOrder?._id);//

    // await craft.save();
     user.orders.push(newOrder?._id); 
    next();
});    */
exports.deleteOrder=catchAsync( async (req, res,next) => {
        
  // Find order by id
  let order = await Order.findById(req.params.id);///:id
  // Delete image from cloudinary
  await cloudinary.uploader.destroy(order.cloudinary_id);
  // Delete craft from db
  await order.remove();
  res.status(204).json({
    status:'success',
    data:{
    order:null
},
});
next();
}); 

 
 /*
exports.setCraftUserIds= (req, res, next) => {
  // Allow nested routes
  if (!req.body.craft) req.body.craft = req.params.craftId;
  if (!req.body.user) req.body.user = req.user.id;//from protect middleware
  next();
};
 */
exports.createOrder = catchAsync(async (req, res,next) => {
  //allowed nested routes
  if (!req.body.craft) req.body.craft = req.params.craftId;
  if (!req.body.user) req.body.user = req.user.id;//from protect middleware
  
  const {title,orderDifficulty,description} = req.body;
  //1. Find the craft
  // const {craftID} = req.params;
  // const craftFound = await Craft.findById(craftID).populate("orders");
  // if (!craftFound) {
  //   return next( new AppError("craft Not Found",500));
  // }
  //check if user already ordererd in this craft
 /* const hasordered = craftFound?.orders?.find((order) => {
    return order?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasordered) {
    return next( new AppError("You have already ordered this",404));
  }*/
    //Upload image to cloudinary
    
  const result = await cloudinary.uploader.upload(req.file.path);
    
  //create order
  const order = await Order.create({
    title,
    orderDifficulty,
    description,
    avatar: result.secure_url,
    cloudinary_id: result.public_id,
    craft:req.params.craftId,
    user:req.user.id,
    //craftID:craftFound?._id,
    //user:req.userAuthId,
  });
  //Push order into craft Found
  //craftFound.orders.push(order?._id);
  //resave
  //await craftFound.save();
  res.status(201).json({
    status:"success",
   data:{
    order,
   }
  });
  next();
});
