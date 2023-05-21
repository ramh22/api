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
        trim:true,
         maxLength:[40,'less or equal 40 character'],
         minLength:[3,'more or equal 3 character'],
     
        },
    avatar:String,
    cloudinary_id:String,
    slug:String,
    // workers: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: "User",
    //     },
    //   ],
    // orders: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: "Order",
    //     },
    //   ],
  },
    {
        timestamps:true
        ,toJSON:{virtuals:true}},
    {toObject:{virtuals:true}}
    );
    //virtual populate
craftSchema.virtual('orders',{
  ref:'Order',
  foreignField:'craft',
  localField:'_id'
  });
  //virtual populate
  /*craftSchema.virtual('workers',{
    ref:'User',
    foreignField:'craft',
    localField:'_id'
    });*/
  // craftSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path:'workers',
  //     select:'name -__v -passwordChangedAt'});
  //     next();
  // });
     
    const Craft = mongoose.model('Craft',craftSchema);
module.exports =Craft; 