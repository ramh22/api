const mongoose = require('mongoose');
const user=require('./../models/userModel');
const Order=require('./../models/orderModel');

//const slugify=require('slugify')
//const validator = require('validator');

const offerSchema = new mongoose.Schema(
  {
    text:{
      type: String,
      required:[true,'please add the offer'],
    },  
    //offerAccepted:status 
    status:{
        type:String,
        enum: ["completed", "canceled","pending","carryingout","accepted"],
        default:"pending"
    },
    
    worker:{
       type:mongoose.Schema.ObjectId,
       ref:'User',
       required:[true,'offer must belong to a worker']
       },  
       order:{
        type:mongoose.Schema.ObjectId,
        ref:'Order',
        required:[true,'offer must belong to a order']
        },  

  },
  { toJSON: { virtuals: true },
    timestamps:true,
 },
  { toObject: { virtuals: true } }
);

offerSchema.virtual('User',{
  ref:'User',
  foreignField:'Offer',
  localField:'_id'

});
offerSchema.virtual('Order',{
  ref:'Order',
  foreignField:'Offer',//order
  localField:'_id'

});
//relation between offer and worker
offerSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'worker',
    select: 'name address avatar'
  }).populate({
    path:'order',
    select:'user title orderDifficulty'
  });
 
  next();
});

const Offer = mongoose.model('Offer',offerSchema);
module.exports =Offer; 