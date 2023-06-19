const User =require( './../models/userModel');
const Craft =require( './../models/craftModel');
const catchAsync=require('./../utils/catchAsync');
const APIFeatures=require('./../utils/apiFeatures');
const AppError=require('./../utils/AppError');
const isLogIn=require('../utils/isLoggedIn');
//exports.getUser=catchAsync(async(req,res,next)=>{});  
exports.getMyCraftID = (req, res, next) => {
  // req.query.limit = '5';
  // req.query.sort = 'createdAt';
   req.query.fields = 'myCraft';
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
