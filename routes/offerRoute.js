const offerController = require("./../controllers/offerController") 
const authController = require("./../controllers//authController.js") 
const express = require('express');
const router = express.Router();
 
router.get( 
  "/my-offers", 
  authController.protect, 
  authController.restrictTo("worker"), 
  offerController.getMyOffers 
) 
router.get( 
  "/offersOfAnOrder", 
  authController.protect, 
  offerController.getOffersOfAnOrder 
) 
router 
  .route("/:id") 
  .all(authController.protect) 
  .get(offerController.getOffer) 
  .patch(offerController.updateOffer) 
  .delete( 
    authController.restrictTo("admin", "worker"), 
    offerController.deleteOffer 
  ) 
 
router 
  .route("/") 
  .all(authController.protect) 
  .get(authController.restrictTo("admin"), offerController.getAllOffers) 
  .post(authController.restrictTo("worker"), offerController.addOffer);
 
module.exports = router