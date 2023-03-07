const { irregular } = require('i/lib/inflections');
const {Order,ProductCart} = require('../models/order');

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    //imp method populate joining two fields of product table to order table as we have products array in order table
    //name of the individual product and price
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            res.status(400).json({
                error: "no order found"
            })
        }
        req.order = order;
        next();
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,order) => {
        if(err){
            res.status(400).json({
                error: "Cannot place an order!"
            })
        }
        return res.json(order);
    })
}

exports.getAllOrders = (req,res) => {
    Order.find({})
         .populate("user","_id name email")
         .exec((err,orders) => {
            if(err){
                res.status(400).json({
                    error: "No orders found!"
                })
            }
            return res.json(orders);
         })
}

exports.getOrderStatus = (req,res) => {
    return res.json(Order.schema.path("status").enumValues);
}

exports.updateStatus = (req,res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        ((err,order) => {
            if(err){
                res.status(400).json({
                    error: "Update failed!"
                })
            }
            return res,json(order);
        })
    )
}