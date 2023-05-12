const Craft =require('./../models/craftModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
const APIFeatures=require('./../utils/apiFeatures');
const cloudinary=require('./../config/cloudinary');
const upload=require('../config/multer');
const path=require('path');

exports.getCrafts = (req, res, next) => {
 // req.query.limit = '5';
 // req.query.sort = 'createdAt';
  req.query.fields = 'name,avatar';
  next();
};
exports.craft = (req, res, next) => {
  // req.query.limit = '5';
  // req.query.sort = 'createdAt';
   req.query.fields = 'name,avatar';
   next();
 };

exports.getAllCrafts= catchAsync(async(req,res,next)=>{
  const features = new APIFeatures(Craft.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const crafts = await features.query;
    // crafts= await Craft.find();
    res.status(200).json(
        {
        status :'success',
        result:crafts.length,
             data:
             {
                crafts
             },
        });
    next();
 });

/*exports.getCraft=catchAsync(async(req,res,next)=>
{
  const features = new APIFeatures(Craft.findById(req.params.id), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
  //const popcar=
  const craft = await features.query;//populate('orders')
    const populatedCraft=  craft.populate('orders');//findById(req.params.id);
    
    if (!craft) {
        return next(new AppError('No craft found with that ID', 404));
      }
        res.status(200).json({
                status :'success',
                data:
                 {
               craft:populatedCraft
                 },
                });
            next();
 } );*/
 exports.getCraft=catchAsync(async(req,res,next)=>{
const craft= await Craft.findById(req.params.id).populate('orders');
if (!craft) {
        return next(new AppError('No craft found with that ID', 404));
      }
        res.status(200).json({
                status :'success',
                data:
                 {
                 craft
                 },
                });
            next();
          });

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
          if (allowedFields.includes(el)) newObj[el] = obj[el];
          });
          return newObj;
        };        
exports.updateCraft= catchAsync(async(req,res,next)=>{
          // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'workers', 'orders');

            const updateCraft= await Craft.findByIdAndUpdate(
              req.craft.id, filteredBody,{
                new: true,
                runValidators: true
              });
               // new:true,//name :unique
                //runValidators:true,//validate the update operation agienest model's schema}));
                res.status(200).json({
                    status :'success',
                    data:{
                         craft:updateCraft,//{name ,avatar}
                        }
                    });
             next();
        } );
exports.createCraft = catchAsync(async (req, res,next) => {

    //craft exists
    const craftFound = await Craft.findOne({ name:req.body.name });
        if (craftFound) {
            return next(new AppError("Craft already exists",401));
            }
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
    
   const craft=await Craft.create({
      name:req.body.name.replace(/['"]+/g, ""),
         avatar: result.secure_url,
        cloudinary_id: result.public_id,
    })
        //  await craft.save();//created at , updated at
          
            res.status(201).json({
              status: "success",
             data:{ 
                craft
            },
            });
        //   
    });  
    /*
    */
exports.updateCraft= catchAsync(async (req, res,next) => {
    let craft = await Craft.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(craft.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      name: req.body.name || craft.name,
      avatar: result?.secure_url || craft.avatar,
      cloudinary_id: result?.public_id || craft.cloudinary_id,
    };
    craft = await Craft.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
        status:'success',
        data:{craft}
      }
        );
  next();
}); 

exports.deleteCraft=catchAsync( async (req, res,next) => {
        
  // Find craft by id
  let craft = await Craft.findById(req.params.id);///:id
  // Delete image from cloudinary
  await cloudinary.uploader.destroy(craft.cloudinary_id);
  // Delete craft from db
  await craft.remove();
  res.status(204).json({
    status:'success',
    data:{
    craft:null
},
});
next();
}); 
/*

exports.getAllCrafts= catchAsync(async(req,res,next)=>{
    
    const crafts= await Craft.find();
    res.status(200).json(
        {
        status :'success',
        result:crafts.length,
             data:
             {
                crafts
             },
        });
    next();
 }); */