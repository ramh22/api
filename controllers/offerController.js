const Offer = require("./../models/offerModel");
const AppError=require('./../utils/AppError');
const catchAsync = require("./../utils/catchAsync");
 
exports.getAllOffers = catchAsync(async (req, res) => { 
  //no need to populate in this function cause will noe use them 
  const offers = await Offer.find() 
  if (!offers) { 
    res.status(400).json({ status: "fail", message: "can't get offers" }) 
  } else { 
    res 
      .status(200) 
      .json({ status: "success", length: offers.length, data: offers }) 
  } 
}) 
 
exports.addOffer = catchAsync(async (req, res,next) => { 
  const body = req.body 
  body.worker = req.user.id 
  const offer = await Offer.create(body) 
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
  
}) 
 
exports.getMyOffers = catchAsync(async (req, res) => { 
  const workerId = req.user.id 
  const offers = await Offer.find({ worker: workerId }) 
  if (!offers) { 
    res.status(404).json({ 
      status: "fail", 
      length: offers.length, 
      message: "there is some thing wrong while extracting your offers", 
    }) 
  } else { 
    res.status(200).json({ status: "success", data: offers }) 
  } 
}) 
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
 
exports.updateOffer = catchAsync(async (req, res) => { 
  let text, status 
  if (req.user.role === "worker") { 
    text = req.body.text 
  } else if (req.user.role === "client") { 
    status = req.body.status 
  } 
  const offer = await Offer.findOneAndUpdate( 
    { _id: req.params.id }, 
    { status: status, text: text }, 
    { new: true } 
  ) 
  if (!offer) { 
    res 
      .status(404) 
      .json({ status: "fail", message: "there is no offer with this id" }) 
  } else { 
    res.status(200).json({ status: "success", data: offer }) 
  } 
}) 
exports.deleteOffer = catchAsync(async (req, res) => { 
  if (!(await Offer.findById(req.params.id))) { 
    res 
      .status(404) 
      .json({ status: "fail", message: "there is no offer with this id" }) 
  } else { 
    await Offer.deleteOne({ _id: req.params.id }) 
    res.status(200).json({ 
      status: "success", 
      message:" the data deleted successfully", 
    }) 
  } 
})