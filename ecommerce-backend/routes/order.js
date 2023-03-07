const express = require('express');
var router = express.Router();
const { isSignedIn, isAuthenticated,isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');
const {pushOrderInPurchaseList} = require('../controllers/user')
const {updateStock} = require("../controllers/product")
const {getOrderById, createOrder,getAllOrders,getOrderStatus,updateStatus} = require('../controllers/order')

//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//real routes
//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);

//status of order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)
//update
 

module.exports = router;