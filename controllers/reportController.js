const Report = require("./../models/reportModel");
const User = require("./../models/userModel");
const AppError=require('./../utils/AppError');
const catchAsync = require("./../utils/catchAsync");
const APIFeatures=require('./../utils/apiFeatures');
exports.addReport = catchAsync(async (req, res,next) => {
  const {text}=req.body;
    //1. Find the reported user
   if (!req.body.reported) req.body.reported = req.params.reportedId;
    if (!req.body.reporter) req.body.reporter = req.user.id;//from protect middleware
  
  // const { reportedID } = req.params;
// const  reported= await User.findById(req.params.reportedId);//.populate("reports");
//   if (!reported) {
//     return next( new AppError("user  Not Found",404));
//   } 
   //create report
    const newReport = await Report.create({
         text,
         reported: req.params.reportedId,
         reporter: req.user.id,
        });
  
    res.status(201).json({
      status:"success",
     data:{
       report:newReport
     }
    });
    next();
  });
  
  exports.getAllReports=catchAsync( async (req, res,next) => {
          
    
    });