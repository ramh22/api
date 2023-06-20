const User =require( './../models/userModel');
const Craft =require( './../models/craftModel');
const catchAsync=require('./../utils/catchAsync');
const APIFeatures=require('./../utils/apiFeatures');
const AppError=require('./../utils/AppError');
const isLogIn=require('../utils/isLoggedIn');
const cloudinary=require('./../config/cloudinary');
const upload=require('../config/multer');
const path=require('path');
//exports.getUser=catchAsync(async(req,res,next)=>{});  
exports.getMyCraftID = (req, res, next) => {
  // req.query.limit = '5';
  // req.query.sort = 'createdAt';
   req.query.fields = 'myCraft';
   next();
 };
 exports.getProfile = (req, res, next) => {
  // req.query.limit = '5';
  // req.query.sort = 'createdAt';
   req.query.fields = 'name address avatar bio rate';
   next();
 };
exports.getUser=catchAsync(async(req,res,next)=>{
  const features = new APIFeatures(User.findById(req.params.id), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const user = await features.query;
if(!user){
  return next(new AppError('user not found',404));
}
  res.status(200).json({
  data:{user:user},
  });

});
 exports.myCraft=catchAsync(async(req,res,next)=>{
  //allowed nested routes
  if (!req.body.craft) req.body.craft = req.params.craftId;
  if (!req.body.user) req.body.user = req.user.id;//from protect middleware
  
    const { myCraft } = req.body;
    //update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        myCraft,
      },
      {
        new: true,
        runValidators:true,//validate the update operation agienest model's schema
      }
    );
    res.status(201).json({
      status: "success",
    user,
    });
    next();
  });
 /*
    
       
  */
 exports.addUserPhoto = catchAsync(async (req, res,next) => {

  //craft exists
  const userFound = await user.findOne({ id:req.user.public_id });
      if (!user) {
          return next(new AppError("user is not exist",401));
          }
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
 const user=await User.create({
    
       avatar: result.secure_url,
      cloudinary_id: result.public_id,
  })
      //  await craft.save();//created at , updated at
        
          res.status(201).json({
            status: "success",
           data:{ 
              user
          },
          });
      //   
  });  
  exports.updateProfile= catchAsync(async(req,res,next)=>{
      //let user = await User.findByIdAndUpdate(req.params.id);
      // Delete image from cloudinary
      //await cloudinary.uploader.destroy(user.cloudinary_id);
      // Upload image to cloudinary
      //let result;
     // if (req.file) {
       // result = await cloudinary.uploader.upload(req.file.path);
      // }
      // const data = {
      //   name: req.body.name || user.name,
      //   avatar: result?.secure_url || user.avatar,
      //   cloudinary_id: result?.public_id || user.cloudinary_id,
      //   bio:req.body.name||user.bio,
      //   rate:req.body.name||user.rate,
      //   address:req.body.name||user.address,
      // };
      const user=await User.findById(req.params.id);
      let updateUser = await User.findByIdAndUpdate(  req.user.id , 
        req.body, 
        { new: true }  );

        if (!user) { 
          return next (new AppError("there is no user with this id" ,404) );
        }
        res.status(200).json({
          status:'success',
          data:{user:updateUser}
        }
          );
   //next();
  }); 
