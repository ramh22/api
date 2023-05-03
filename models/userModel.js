const crypto = require('crypto');
const mongoose =require( 'mongoose');
const validator = require('validator');
const bcrypt =require( 'bcryptjs');


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      trim:true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim:true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    address: {
        type: String,
        trim:true,
        enum:['مركز الفيوم', 'مركز يوسف الصديق', 'مركز طامية', 'مركز سنورس', 'مركز إطسا', 'مركز إبشواي']
      },
    role: {
        type: String,
        enum: ['client', 'worker', 'admin'],
        default: 'client',
        required: [true, 'Please tell us your role!'],
        trim:true,
      },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 12,
        select: false,
        trim:true,
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        },
        trim:true,
      },
      
    
       myCraft:{
        type:String,
        enum:['عميل','بناء','نجارة','نقاشة','حدادة','سباكة','تنظيف','كهرباء','اجهزة كهربائية'],
        unique:true,
        required:true,
        trim:true,
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
      active: {
        type: Boolean,
        default: true,
        select: false
      },
    photo: String,
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
    reports: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Report",
        },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    tokens: [
      { type: Object }
    ],
    
  
    
  },{
    timestamps:true
  ,toJSON:{virtuals:true}
},
  {toObject:{virtuals:true}}
  ); 
    //   phone: {
    //     type: String,
    //   },
    userSchema.pre('save', async function(next) {
      // Only run this function if password was actually modified
      if (!this.isModified('password')) return next();
    
      // Hash the password with cost of 12
      this.password = await bcrypt.hash(this.password, 12);
    
      // Delete passwordConfirm field
      this.passwordConfirm = undefined;
      next();
    });
    
    userSchema.pre('save', function(next) {
      if (!this.isModified('password') || this.isNew) return next();
    
      this.passwordChangedAt = Date.now() - 1000;
      next();
    });
    
    userSchema.pre(/^find/, function(next) {
      // this points to the current query
      this.find({ active: { $ne: false } });
      next();
    });
    
    userSchema.methods.correctPassword = async function(
      passwordCurrent,
      userPassword
    ) {
      return await bcrypt.compare(passwordCurrent, userPassword);
    };
    
    userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
      if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
          this.passwordChangedAt.getTime() / 1000,
          10
        );
    
        return JWTTimestamp < changedTimestamp;
      }
    
      // False means NOT changed
      return false;
    };
    //create password and reset token
    userSchema.methods.resetToken = function() {
      const resetToken = crypto.randomBytes(32).toString('hex');
    
      this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
      console.log({ resetToken }, this.passwordResetToken);
    
      this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
      return resetToken;
    };
//compile the schema to model
const User = mongoose.model("User", userSchema);

module.exports =User;

