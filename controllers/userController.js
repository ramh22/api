const User =require( './../models/userModel');
const Report =require( './../models/reportModel');
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
 //const craft = await features.query;//populate('orders')
// const populatedCraft=  craft.populate('orders');//findById(req.params.id);
 
exports.getUser=catchAsync(async(req,res,next)=>{
  const features = new APIFeatures(User.findById(req.params.id), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const user = await features.query;
//const populatedUser=user.populate('reports');
if(!user){
  return next(new AppError('user not found',404));
}
  res.status(200).json({
  data:{user}//{user:populatedUser},
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
 //const user = await User.findById(req.params.id);
 let user = await User.findById(req.params.id);
  
  //const userFound = await user.findOne({ user:req.params.id });
      if (!user) {
          return next(new AppError("user is not exist",404));
          }
      // Upload image to cloudinary
      //const result = await cloudinary.uploader.upload(req.file.path);
    
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
      const data={
        avatar: result?.secure_url||user.avatar,
       cloudinary_id: result.public_id||null,
   }
  let userUpdated=await User.findByIdAndUpdate(req.user.id,
    data,
    {
      new:true,
      runValidators:true
    });
          res.status(200).json({
            status: "success",
           data:{ 
              user:userUpdated
          },
          });
     // next();  
  });  
  exports.updateProfile= catchAsync(async(req,res,next)=>{
     
     
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
  
  exports.addImagesOfWorks = catchAsync(async (req, res,next) => {
    //const user = await User.findById(req.params.id);
    let user = await User.findById(req.params.id);
     
     //const userFound = await user.findOne({ user:req.params.id });
         if (!user) {
             return next(new AppError("user is not exist",404));
             }
         // Upload image to cloudinary
         //const result = await cloudinary.uploader.upload(req.file.path);
       
       let result;
       if (req.files) {
         result = await cloudinary.uploader.upload(req.files.path);
       }
       //Images of works
         const data={
           avatar: result?.secure_url||user.avatar,
          cloudinary_id: result.public_id||null,
      }
     let userUpdated=await User.findByIdAndUpdate(req.user.id,
       data,
       {
         new:true,
         runValidators:true
       });
             res.status(200).json({
               status: "success",
              data:{ 
                 user:userUpdated
             },
             });
        // next();  
     });  