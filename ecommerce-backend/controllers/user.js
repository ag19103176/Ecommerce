const User = require("../models/user")
const Order = require("../models/order")
exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status("400").json({
                error: "NO USER WAS FOUND!"
            })
        }
        req.profile = user;
        next();
    })
}

exports.getUser = (req,res) => {
    req.profile.salt =undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile);
}

exports.getAllUsers = (req,res) => {
    User.find({}).exec((err,user) => {
        if(err || !user){
            return res.status("400").json({
                error: "No user was found!",
            })
        }
        // user.forEach(element => {
        //     element.salt = undefined;
        //     element.encry_password = undefined;
        //     element.createdAt = undefined;
        //     element.updatedAt = undefined;
        // });
        return res.send(user);
    })
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
       {_id : req.profile._id},
       {$set : req.body},
       {new:true, userFindAndModify: false},
       (err,user) =>{
        if(err){
            return res.status("400").json({
                error: "not authorized!"
            })
        }
        user.encry_password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;
        user.salt = undefined;
        return res.json(user);
       }
    )
}
//important
exports.userPurchaseList = (req,res) => {
 Order.find({user: req.profile._id})
 //populate allows us to reference documents in other methods
 //populate
 .populate("user","_id name")
 .exec((err,order) => {
    if(err){
        return res.status("400").json({
            error: "No Order in this account!"
        })
    }
    return res.json(order);
 })
}

exports.pushOrderInPurchaseList = (req,res,next) => {
  let purchases = []
  req.body.order.products.forEach(product=> {
    purchases.push({
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        amount: req.body.order.amount,
        transaction_id:req.body.order.transaction_id
    })
  });
  //store this in db
  User.findOneAndUpdate(
    {_id: req.profile._id},
    {$push : {purchases: purchases}},
    {new: true},
    (err,item) => {
        if(err){
            return res.status(400).json({
                error: "Unable to update!"
            })
        }
    next();
    }
  )
}