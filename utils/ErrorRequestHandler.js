const AppError = require('./../utils/AppError');
exports.ErrorRequestHandler = (err, req, res, next) =>{
   console.error('Uncaught exception:', err);
   res.status(500).json({
    status:'fail',
    message:'Oops, an unexpected error occurred,please try again'
  })};

