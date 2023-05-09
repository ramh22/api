const User =require( './../models/userModel');
const Craft =require( './../models/craftModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
const isLogIn=require('../utils/isLoggedIn');
//exports.getUser=catchAsync(async(req,res,next)=>{});  

 exports.myCraft=catchAsync(async(req,res,next)=>{
    const { myCraft } = req.body;
  
    //update
    const user = await  User.findByIdAndUpdate(
      req.params.id,
      {
        myCraft,
        
      },
      {
        new: true,
        runValidators:true,//validate the update operation agienest model's schema
      }
    );
  //   craftName=await Craft.findOne({ name:req.body.name });
  //   if(myCraft !== craftName)
  //  // if (!myCraft)
  //    {
  //       return next(new AppError("Craft name does not exist",401));
  //       }

    res.status(201).json({
      status: "success",
    user,
    });
    next();
  });
// const user=await User.findById(req.body._id);
//   const myCraft = await User.findByIdAndUpdate({/
//     user:req.userAuthId,
//     myCraft:req.body.myCraft,
// });
// await user.save();
// res.status(201).json({
//   status: "success",
//   message: "User Registered Successfully",
//   data:{ 
//     myCraft,
// }
// });
// next();
// });