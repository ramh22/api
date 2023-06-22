const Report = require("./../models/reportModel");
const User = require("./../models/userModel");
const AppError=require('./../utils/AppError');
const catchAsync = require("./../utils/catchAsync");
const APIFeatures=require('./../utils/apiFeatures');
exports.addReport = catchAsync(async (req, res,next) => {
    //allowed nested routes
    //1. Find the reported user
  const { reportedID } = req.params;
  const reportedIDFound = await User.findById(reportedID).populate("reports");
  if (!reportedIDFound) {
    return next( new AppError("user  Not Found",404));
  }
   //check if user already reported this reported user
   const hasReported = reportedIDFound?.reports?.find((report) => {
    return report?.reporter?.toString() === req?.userAuthId.toString();
  });
  if (hasReported) {
    throw new Error("You have already reported this user");
  }
  const {report,reporter,reported}=req.body;
    if (!req.body.reporter) req.body.reporter = req.user.id;//from protect middleware
   // const {report,reporter,reported}=req.body;
    
   //create report
    const newReport = await Report.create({
         report,
         reported: reportedIDFound?._id,
         reporter: req.userAuthId,
        });
    //Push report into reported user database
  reportedIDFound.reports.push(report?._id);
  //resave
  await reportedIDFound.save();
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