const User =require( './../models/userModel');
const Craft =require( './../models/craftModel');
const catchAsync=require('./../utils/catchAsync');

exports.getUser=catchAsync(async(req,res)=>{});  

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
      }
    );
    res.json({
      status: "success",
      message: " user updated successfully",
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