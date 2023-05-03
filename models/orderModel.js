const crypto = require('crypto');
const mongoose =require( 'mongoose');
const validator = require('validator');
const bcrypt =require( 'bcryptjs');
//const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
  });
const Order = mongoose.model('Order',orderSchema);
module.exports =Order; 