const crypto = require('crypto');
const mongoose =require( 'mongoose');
const validator = require('validator');
const bcrypt =require( 'bcryptjs');
const craft=require('./../models/craftModel');
//const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    createDate:{
      type:Date,
      default:Date.now(),//timestamp
  },
  title:{
      type:String,
      required:[true,'ادخل العنوان من فضلك'],//validate
      trim:true,
  },
  orderDifficulty:{
      type:String,
      enum:['صيانة بسيطة','صيانة متوسطة','صيانة معقدة'],
      trim:true,
      required:[true,'ما نوع الصيانة التي تريدها']
  },
  description:{
      type:String,
      trim:true,
      required:true,
  },
  avatar:{type:String,
default:null},
  cloudinary_id:{type:String,
    default:null},
  user:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
     // required:[true,'order must belong to a user']
      },
  craft:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Craft',
         required:[true,'order must belong to a craft']
          },    
  rating:{
      type:mongoose.Schema.ObjectId,
          ref:'Rating',
          
      },
  orderDone:{
      type:Boolean,
      default:false,
  },
  notDoneNotDeleteOrder://قيد التنفيذ
  {
      type:Boolean,
      default:true,
      select:false,
  },
  //if length of the array of offers !=0 put orderHavingOffers===true 
  //every order with the same user_id + orderHavingOffers===true 
  orderHavingOffers:{
      type:Boolean,
      default:false,
      }, 
  offers:[
      {
          type:mongoose.Schema.ObjectId,
              ref:'Offer',  
          },
  ],
  

  },
{
  timestamps: true,
},
{toJSON:{virtuals:true}},
{toObject:{virtuals:true}}
); 
orderSchema.virtual('crafts',{
    ref:'Craft',
    foreignField:'Order',
    localField:'name'
});
const Order = mongoose.model('Order',orderSchema);
module.exports =Order; 