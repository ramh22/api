const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');
//const slugify=require('slugify');
//const validator=require('validator');


const ratingSchema = new mongoose.Schema(
    {
       rate:{ type:Number,
            required:[true,'order must have rate from 1 to 5'],
            
            min:1,
            max:5,},
       
        order:{
            type:mongoose.Schema.ObjectId,
            ref:'Order',
            required:[true,'rating must belong to an order']
            }, 
            //user who creating the rating
        client:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:[true,'rating must belong to an one user']
                }, 
    },
    // we want to populate the IDs into real objects.
    {
        toJSON:{virtuals:true},
        Timestamp:true},
    {toObject:{virtuals:true}}
    );
    // ratingSchema.virtual('Order',{
    //     ref:'Order',
    //     foreignField:'Rating',
    //     localField:'_id',
    // });
    // ratingSchema.virtual('User',{
    //     ref:'User',
    //     foreignField:'Rating',
    //     localField:'_id'
    
    // });
ratingSchema.index({order:1,user:1},{unique:true});
const Rating = mongoose.model('Rating',ratingSchema);
module.exports =Rating; 