const Craft =require('./../models/craftModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
const cloudinary=require('./../config/cloudinary');
const upload=require('../config/multer');
const path=require('path');
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
 });
exports.getCraft=catchAsync(async(req,res,next)=>{
    
            //const id=req.params.id*1;
    const craft= await Craft.findById(req.params.id);
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
        } );
exports.updateCraft= catchAsync(async(req,res,next)=>{
        
            const craft= await Craft.findByIdAndUpdate(req.params.id,req.body({
                new:true,//name :unique
                runValidators:true,//validate the update operation agienest model's schema
                }));
                res.status(200).json({
                    status :'success',
                    data:{
                         craft//:{name ,avatar}
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
  //await craft.remove();
  res.status(204).json({
    status:'success',
    data:{
    craft:null
},
});
next();
}); 