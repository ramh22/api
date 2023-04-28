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
// start the express app

dbConnect();
const app=express();
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
app.use(express.json());

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/',userRoutes);
// xss secure
/*app.all('*', (req, res, next) => {
    // res.status(404).json({
    // status:'fail',
    // message:`Can't find ${req.originalUrl}on this server!`
    // });
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  */
  app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.status='fail';
    err.statusCode=404||401||400||403;
    next(err);
  });
  
  //export const globalErrhandler = 
 app.use((err, req, res, next) => {
    //err stack
    //message
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    // const stack = err?.stack;
    // const statusCode = err?.statusCode ? err?.statusCode : 500;
    // const message = err?.message;
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message,
    });
  });

  //404 handler
  //export const notFound = 
/*app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
  });
  */
  
//app.use(globalErrorHandler);
//app.use(ErrorRequestHandler);
module.exports=app;