const Craft =require('./../models/craftsModel');
const catchAsync=require('./../public/catchAsync');

exports.getAllCrafts= async(req,res,next)=>{
    try{
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
    }
    catch(err){
        res.status(400).json({
        status:'faild',
        message: err 
    });
    }
    next();
 }
exports.getCraft=async(req,res,next)=>{
    try{
            //const id=req.params.id*1;
    const craft= await Craft.findById(req.params.id);
        res.status(200).json({
                status :'success',
                data:
                 {
                 craft:craft,
                 },
                });
            }
            catch(err){
                res.status(400).json({
                status:'faild',
                message: err 
            });}
            next();
        } 
exports.updateCraft=async(req,res,next)=>{
        try{
            const craft= await Craft.findByIdAndUpdate(req.params.id,req.body({
                new:true,
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
            const { name ,image} = req.body;
            //craft exists
            const craftFound = await Craft.findOne({ name });
            if (craftFound) {
              throw new Error("Craft already exists");
            }
            //create
            const craft = await Craft.create({
              name: name?.toLowerCase(),
              image: req?.file?.path,
            });
          
            res.json({
              status: "success",
              message: "Craft created successfully",
              craft,
            });
          });  