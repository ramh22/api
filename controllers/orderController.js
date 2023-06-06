const Craft =require('./../models/craftModel');
const Order =require('./../models/orderModel');
const User =require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
const APIFeatures=require('./../utils/apiFeatures');
const isLogIn=require('../utils/isLoggedIn');
const cloudinary=require('./../config/cloudinary');
const upload=require('../config/multer');
const path=require('path');
const util = require('util');
const { isNull } = require('util');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
        });
        return newObj;
      };   
      exports.OrdersForWorkers = (req, res, next) => {
        // req.query.limit = '5';
        // req.query.sort = 'createdAt';
         req.query.fields = 'createdDate,title,orderDifficulty,user';
         next();
       };      
exports.getAllOrders= catchAsync(async(req,res,next)=>{
  let filter={};
  if(req.params.craftId) filter={craft:req.params.craftId};
  // const orders= await Order.find(filter);
  const features = new APIFeatures(Order.find(filter), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const orders = await features.query;
  //let filter={};
  //if(req.params.craftId) filter={craft:req.params.craftId};
  // // const orders= await Order.find().populate('crafts','name').select('title orderDifficulty');
  // const orders= await Order.find(filter);
   res.status(200).json(
        {
        status :'success',
         result:orders.length,
             data:
             {
                orders
             },
        });
    //next();
});
exports.getOrderFromClient = (req, res, next) => {
  // req.query.limit = '5';
  // req.query.sort = 'createdAt';
   req.query.fields = 'createdDate,title,orderDifficulty,description,avatar,cloudinary_id,user';
   next();
 };
exports.getOrder=catchAsync(async(req,res,next)=>{
  const features = new APIFeatures(Order.findById(req.params.id), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const order = await features.query;
  // order= await Order.findById(req.params.id);
  if (!order) {
          return next(new AppError('No order found with that ID', 404));
        }
          res.status(200).json({
                  status :'success',
                  data:
                   {
                   order:order,
                   },
                  });
            });
  
/*exports.createOrder=catchAsync(async(req,res,next)=>{
      const user=await User.findById(req.userAuthId);
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
    Craft.orders.push(newOrder?._id);//////
    // await craft.save();
     user.orders.push(newOrder?._id); 
    next();
});    */
/*exports.deleteOrder=catchAsync( async (req, res,next) => {
        
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
}); */

 
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

exports.deleteOrder=catchAsync( async (req, res,next) => {
        
  // Find craft by id
  let order = await Order.findById(req.params.id);///:id
  if(!order){
    return next(new AppError("order not  exists",401));
  }
  
  // Delete image from cloudinary
  await cloudinary.uploader.destroy(order.cloudinary_id);
  // Delete craft from db
  await order.deleteOne();
  //await craft.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status:'success',
    data:null,
});
});
exports.updateOrder= catchAsync(async(req,res,next)=>{
  let order=await Order.findById(req.params.id);
  // 2) Filtered out unwanted fields names that are not allowed to be updated
//const filteredBody = filterObj(req.body, 'offers', 'orderHavingOffers','notDoneNotDeleteOrder','orderDone','rating','user','craft');
if(!order){
  return next(new AppError("order not  exists",401));
}
    const updatedOrder= await Order.findByIdAndUpdate(
    req.params.id, req.body,{
        new: true,
        runValidators: true
      });
       // new:true,//name :unique
        //runValidators:true,//validate the update operation agienest model's schema}));
        res.status(200).json({
            status :'success',
            data:{
                 order:updatedOrder,
                }
            });
     //next();
} );
exports.getMyOrders = catchAsync(async (req, res, next) => {
  let order = await Order.find({ user: req.user._id, craft: req.params.craftId});
  if (!order) {
    return next(new AppError("error, orders are not exist",404));
  }
  res.status(200).json({ 
    status: "success", 
    data:order });
});