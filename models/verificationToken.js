const mongoose =require( 'mongoose');
const validator = require('validator');
const bcrypt =require( 'bcryptjs');
const VerificationTokenSchema = new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectId,
             ref: "User",
             required:true
        },
    createAt:{
        type :Date,
        default:Date.now(),
        expires:360000}
    ,token:{
        type:String,
        required:true
    }    });
    //const VerificationToken = mongoose.model("VerificationToken", VerificationTokenSchema);

module.exports = mongoose.model("VerificationToken", VerificationTokenSchema);
//VerificationToken;