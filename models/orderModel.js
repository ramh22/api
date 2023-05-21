const crypto = require('crypto');
const mongoose =require( 'mongoose');
const validator = require('validator');
const bcrypt =require( 'bcryptjs');
const craft=require('./../models/craftModel');
//const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    createdDate:{
        type:Date,
        default:Date.now(),
    },
  orderedTime:Date,
 
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
         },
  cloudinary_id:{type:String,
    },
  user:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
     required:[true,'order must belong to a user']
      },
  craft:{
          type:mongoose.Schema.ObjectId,
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
// orderSchema.virtual('crafts',{
//     ref:'Craft',
//     foreignField:'Order',
//     localField:'_id'
// });
orderSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: 'name address avatar'
    });
    // this.populate({
    //   path: 'user',
    //   select: 'name photo'
    // });
    next();
  });
  orderSchema.pre('save', function(next) {
   this.orderedTime= ( Date.now()- this.createdDate)/1000;
    //this.passwordChangedAt = Date.now() - 1000;
    next();
  });
   
    
const Order = mongoose.model('Order',orderSchema);
module.exports =Order; 