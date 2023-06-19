const Offer = require("./../models/offerModel");
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
   //check if user already ordere rd in this craft
 /* const hasoffered = orderFound?.offers?.find((offer) => {
    return offer?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasoffered) {
    return next( new AppError("You have already offered this",404));
  }*/
exports.addOffer = catchAsync(async (req, res,next) => { 
  const body = req.body 
  body.worker = req.user.id;
  const offer = await Offer.create(body);
  if (!offer) { 
    return next(new AppError(
      "can't create offer" ,404));
  } 
    res.status(200).json({ status: "success", data: offer }) 
  } 
); 
 
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
  const workerId = req.user.id 
  // const offers = await Offer.find({ worker: workerId }) 
  const features = new APIFeatures(Offer.find({worker:workerId}), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const offers = await features.query;
  // const workerId = req.user.id 
  // const offers = await Offer.find({ worker: workerId }) 
  if (!offers) { 
    return next(new AppError(
     "there is some thing wrong while extracting your offers",404
    )); 
  }  
    res.status(200).json({ 
      status: "success",
     length: offers.length,
       data: offers }) 
  
});
 // all offers in an order
exports.getOffersOfAnOrder = catchAsync(async (req, res) => { 
  const order = req.query.orderId;
  const offers = await Offer.find({ order }).populate("worker");// there is worker to  a offer
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
  //var filter={};
  //if(req.params.craftId) filter={craft:req.params.craftId};//={status:'completed'};
  //let completedOffers=await Offer.find(filter)
 

  const stats = await Offer.aggregate([
    {
      $match: { status: 'completed' }
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
    
