const mongoose=require('mongoose');
const User=require('./../models/userModel');
const slugify=require('slugify');
const validator=require('validator');

const reportSchema=new mongoose.Schema(
    {
       report:{ type:[String],
        required:[true,'please add the report'],
       },

     
        reporter: {
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'report must belong to a user']
        },
        reported: {
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'report must add to a user']
        }

    }, { toJSON: { virtuals: true },
    timestamps:true,
 },
  { toObject: { virtuals: true } });

reportSchema.index({user:1,user:1},{unique:true});
 const Report = mongoose.model('Report',reportSchema);
module.exports =Report;