const Offer = require("./../models/offerModel");
const User = require("./../models/userModel");
const Order = require("./../models/orderModel");
const AppError=require('./../utils/AppError');
const catchAsync = require("./../utils/catchAsync");
const APIFeatures=require('./../utils/apiFeatures');


/*
exports.populatedWorkers = (req, res, next) => {
        
  req.query.fields = 'text user';
  next();
};  */
exports.getAllOffers = catchAsync(async (req, res,next) => { 
  //no need to populate in this function cause will noe use them 
  const offers = await Offer.find();
  if (!offers)  { 
    return next(new AppError(
      "can't get  offers" ,404));
  } 
    res 
      .status(200) 
      .json({ status: "success", 
      length: offers.length,
       data: {offers},
      }); 
  
});
 
exports.addOffer = catchAsync(async (req, res,next) => { 
  const {text,status}=req.body;
  const {orderId}=req.params;
  const orderFound = await Order.findById(orderId).populate("offers");
  if (!orderFound) { 
    return next(new AppError(
      " order not found " ,404));
  } 

const hasOffered = orderFound?.offers?.find((offer) => {//user=worker//
  
  return offer.worker.id === req.user.id;
 
  });
  
  if (hasOffered) {
    return next(new AppError("You have already added your offer",404));
  }
//create review
const offer = await Offer.create({
  text,
  status,
  order:orderFound?._id,
  worker:req.user.id,
});
//Push offer into order Found
orderFound.offers.push(offer?._id);
//resave
await orderFound.save();  

    res.status(201)
    .json({
       status: "success", 
       data: offer }) 
  }); 
 
exports.getOffer = catchAsync(async (req, res,next) => { 
  const offer = await Offer.findById(req.params.id).populate("worker order") 
  if (!offer) { 
    return next(new AppError(
            "there is no offer with this id" ,404)); 
  } 
    res.status(200).json({ 
      status: "success", 
      data: offer });
  
});
//get my offer + the worker 
exports.offersOfTheWorker = (req, res, next) => {
        
  req.query.fields = 'text status user';
  next();
};  

exports.getMyOffers = catchAsync(async (req, res,next) => { 
// const workerId = req.user.id 
let workerId = await User.findById(req.params.id);
//let filter={};
////if(req.params.workerId) filter={worker:req.params.workerId};

  // const offers = await Offer.find({ worker: workerId }) 
  const features = new APIFeatures(Offer.find({ worker: workerId }), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const offers = await features.query;
  // const workerId = req.user.id 
  // const populatedOffers = await offers.populate('worker order');
  if (!offers) { 
    return next(new AppError(
     "there is some thing wrong while extracting your offers",404
    )); 
  }  
    res.status(200).json({ 
      status: "success",
     length: offers.length,
       data: offers });
  
});
 // all offers in an order
exports.getOffersOfAnOrder = catchAsync(async (req, res) => { 
  let filter={};
  if(req.params.orderId) filter={order:req.params.orderId};
  //let orderId = await Order.findById(req.params.id);
  const offers = await Offer.find(filter).populate("worker");// there is worker to  a offer
  if (!offers) { 
    res.status(404).json({ 
      status: "fail", 
      length: offers.length, 
      message: 
        "there is some thing wrong while extracting order offers in order", 
    }) 
  } 
    res.status(200).json({
       status: "success",
        length: offers.length,
         data: offers }) 

});
 
exports.updateOffer = catchAsync(async (req, res,next) => { 
  let text, status 
  if (req.user.role === "worker") { 
    text = req.body.text;
  } else if (req.user.role === "client") { 
    status = req.body.status;
  } 
  const offer = await Offer.findOneAndUpdate( 
    { _id: req.params.id }, 
    { status: status, text: text }, 
    { new: true } 
  ) 
  if (!offer) { 
    return next (new AppError("there is no offer with this id" ,404) );
  }
    res.status(200).json({ 
      status: "success",
       data: offer }) ;

}) 
exports.deleteOffer = catchAsync(async (req, res,next) => { 
  const offer=await Offer.findById(req.params.id);
  //if (!(await Offer.findById(req.params.id))) { 
    if(!offer){
      return next(new AppError("there is no offer with this id" ,404)); 
  } 
    await Offer.deleteOne({ _id: req.params.id }) 
    res.status(200).json({ 
      status: "success", 
      message:" the data deleted successfully", 
    }) 
  
});
//get offers completed
exports.getOfferStats = catchAsync(async (req, res, next) => {
 
  const workerId = await User.findOne({worker:req.user.id});
  if(!workerId){
    return next(new AppError("there is no worker with this id" ,404)); 
  }
  const stats = await Offer.aggregate([
    {
      $match: { worker: `$workerId` }
    },
    // {
    //   $group: {
    //     _id: { $toUpper: '$status' },
    //     numOffers: { $sum: 1 },
    //   }},
       ]
        );
        if(!stats){
          return next(new AppError("there is no offer with this id" ,404)); 
      } 
        res.status(200).json({
          status: 'success',

          data: {
            stats
          }
        });
        
      });
    //complete offer/:id
    //thensame my offers
exports.getOffersOfAnyWorker = catchAsync(async (req, res, next) => {
  const workerId=req.query.id;
  let offers = await Offer.find({ worker:workerId });
  if (!offers) {
    return next(new AppError("error, offers are not exist",404));
  }
  res.status(200).json({ 
    status: "success", 
    length:offers.length,
    data:offers });
});