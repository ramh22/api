const orderController = require("../controllers/orderController")
const authController = require("../controllers/authController")
const craftController = require("../controllers/craftController")

const upload = require("../config/multer")
const isLogIn = require("../utils/isLoggedIn")
const express = require("express")

const router = express.Router({ mergeParams: true })

router
  .route("/myOrders")
  .get(authController.protect, orderController.getMyOrders);
  router
  .route("/ordersDone")
  .get(authController.protect,orderController.getOrderStats, orderController.getMyOrders);

router
  .route("/:id")
  .get(
    authController.protect,
    // authController.restrictTo('client','admin','worker') ,
    orderController.getOrderFromClient,
    orderController.getOrder
  )
  .patch(
    authController.protect,
    authController.restrictTo("client"),
    upload.single("image"),
    orderController.updateOrder
  )
  .delete(
    authController.protect,
    authController.restrictTo("client", "admin"),
    orderController.deleteOrder
  )

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("worker", "admin"),
    orderController.OrdersForWorkers,
    orderController.getAllOrders
  )
  .post(
    authController.protect,
    authController.restrictTo("client"),
    upload.single("image"),
    //orderController.setCraftUserIds,
    orderController.createOrder
  )

//reviewRouter.post("/:productID", isLoggedIn, createCtrl);

module.exports = router