const Rating=require('./../models/ratingModel');
const Order=require('./../models/orderModel');

exports.createRating=vatchAsync(async(req,res,next)=>{
    const {  rate } = req.body;
      //1. Find the product
  const { orderID } = req.params;
  const orderFound = await Order.findById(orderID).populate("rating");//rating from schema of order
  if (!orderFound) {
    throw new Error("order Not Found");
  }
   //check if user already put a reting this orderbefore
   const hasRated = orderFound.rating.find((rating) => {
    return rating.user.id === req.user.id;
  });
  if (hasRated) {
    return next( new AppError("You have already added rating",404));
  }
     //create rating
  const rating = await Rating.create({
    rate,
    order: orderFound._id,
    user: req.user.id,
  });
    //resave
    await orderFound.save();
    res.status(201).json({
      success: true,
      data:{rating} ,
    });
  });