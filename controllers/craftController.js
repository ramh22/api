const Craft =require('./../models/craftModel');
const catchAsync=require('./../utils/catchAsync');
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
exports.updateCraft=async(req,res,next)=>{
        try{
            const craft= await Craft.findByIdAndUpdate(req.params.id,req.body({
                new:true,//name :unique
                runValidators:true,//validate the update operation agienest model's schema
                }));
                res.status(200).json({
                    status :'success',
                    data:{
                         craft
                        }
                    });}
            catch(err){
                res.status(404).json({
                        status:'fail',
                        message:err
                       });}
             next();
        } ;
exports.createCraft = catchAsync(async (req, res) => {

    //craft exists
    const craftFound = await Craft.findOne({ name:req.body.name });
        if (craftFound) {
            return next(new AppError("Craft already exists",401));
            }
    console.log(req.file);
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
    
        // Create new craft
        let craft = new Craft({
          name: req.body.name,
          avatar: result.secure_url,
          cloudinary_id: result.public_id,
        });
    
        
            //create
        //     const craft = await Craft.create({
        //       name: name?.toLowerCase(),
        //       image: req?.file?.path,
        //     });
          await craft.save();
            res.status(201).json({
              status: "success",
             data:{ 
                craft
            },
            });
        //   
    });  
    /*
   async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    let user = new User({
      name: req.body.name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save user
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
}
}*/