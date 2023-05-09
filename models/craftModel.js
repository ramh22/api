const mongoose = require('mongoose');
const slugify=require('slugify');
//const validator=require('validator');
const Order=require('./../models/orderModel');
const User=require('./../models/userModel');

const craftSchema=new mongoose.Schema(
    {
    name:{
        type:String,
        required:[true,'a craft must have a name'],//validate,
        unique:true,
        //enum:["نجار", "سباك", "كهربائي", "نقاش", "عامل نظافة", "حداد", "صيانة اجهزة كهربائية", "عامل بناء"],
        trim:true,
         maxLength:[40,'less or equal 40 character'],
         minLength:[3,'more or equal 3 character'],
     
        },
    avatar:String,
    cloudinary_id:String,
    slug:String,
    workers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      ],
    
  },
    {
        timestamps:true
        ,toJSON:{virtuals:true}},
    {toObject:{virtuals:true}}
    );
    craftSchema.virtual('order',{
      ref:'Order',
      foreignField:'Craft',
      localField:'_id'
  });
    const Craft = mongoose.model('Craft',craftSchema);
module.exports =Craft; 