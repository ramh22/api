const User =require( './../models/userModel');

const catchAsync=require('./../utils/catchAsync');

exports.getUser=catchAsync(async(req,res)=>{});  
exports.myCraft=catchAsync(async(req,res)=>{

  const myCraft = await User.create({
     myCraft:req.body.myCraft,
});
res.status(201).json({
  status: "success",
  message: "User Registered Successfully",
  data: myCraft,
});
});