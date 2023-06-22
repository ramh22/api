const express = require('express');
const mongoose=require('mongoose');
const xss= require('xss');
const morgan = require('morgan');
const dotenv=require('dotenv').config({path:`${__dirname}/problem`}); //read environment variable before start the app
const AppError=require('./utils/AppError');
const ErrorRequestHandler=require('./utils/ErrorRequestHandler');
const globalErrorHandler=require('./controllers/errorController');
const dbConnect=require('./config/dbConnect');
const userRoutes =require( './routes/usersRoute');
const craftRoutes =require( './routes/craftsRoute');
const orderRoutes =require( './routes/ordersRoute');
const offerRoutes = require("./routes/offerRoute");
const reportRoutes = require("./routes/reportRoute");
// start the express app

dbConnect();
const app=express();

// Development logging
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
  }
app.use(express.json());
   //body parser
   app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/crafts',craftRoutes);
app.use('/api/v1/orders',orderRoutes);
app.use("/api/v1/offers", offerRoutes)
app.use("/api/v1/reports", reportRoutes);
// xss secure

  //route not found
  app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));//update here by return
  });

  app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.status='error';
    err.statusCode=404||401||400||403;
    next(err);
  });
  
  //export const globalErrhandler = 
 app.use((err, req, res, next) => {
    //err stack
    //message
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message,
    });
     
  });
 
  

//app.use(globalErrorHandler);
//app.use(ErrorRequestHandler);
module.exports=app;