const Product = require('../models/product')
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            res.status(400).json({
                error: "No product Found!"
            })
        }
        req.product = product;
        next();
    })
};

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file) => {
        if(err){
            res.status(400).json({
                error:"problem with image!"
            });
        }
        //destructure the fields
        const {name,description,price,category,stock} = fields;
        
        if(!name || !description || !price || !category || !stock){
                return res.status(400).json({
                    error: "Please fill all the fields!"
                })
        }

        let product = new Product(fields);

        //handle file
        if(file.photo){
           if(file.photo.size > 3000000){
            return res.status(400).json({
                error: "file size too big!"
            })
           } 
           product.photo.data = fs.readFileSync(file.photo.path);
           product.photo.contentType = file.photo.type;
        }
        //save to db
        product.save((err,product) => {
            if(err){
                res.status(400).json({
                    error: "saving failed"
                })
            }
            return res.json(product);
        });
    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}
//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}
//delete route
exports.deleteProduct = (req,res) => {
  let product = req.product;
  product.remove((err,delProduct)=>{
    if(err){
        res.status(400).json({
            error:"cannot delete product!"
        })
    }
    return res.json(delProduct);
  })
}

//update product
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            res.status(400).json({
                error:"problem with image!"
            });
        }
        
        let product = req.product;
        //lodash working!imp
        product = _.extend(product,fields);

        //handle file
        if(file.photo){
           if(file.photo.size > 3000000){
            return res.status(400).json({
                error: "file size too big!"
            })
           } 
           product.photo.data = fs.readFileSync(file.photo.path);
           product.photo.contentType = file.photo.type;
        }
        //save to db
        product.save((err,product) => {
            if(err){
                res.status(400).json({
                    error: "updation failed"
                })
            }
            return res.json(product);
        });
    })
}
//product listing
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8; 
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find({})
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products) => {
        if(err){
            return res.status(400).json({
                error: "No products found!"
            })
        }
        return res.json(products);
    });
}
exports.getAllUnique = (req,res) => {
    Product.distinct("category",{},(err,category)=>{
        if(err){
            res.status(400).json({
                error: "category not found!"
            })
        }
        res.json(category);
    })
}
//middleware initiates if purchase is succesfull then it loop thru the cart items and updates all stocks and sold value!!
//for this we use bulkwrite method of mongo
exports.updateStock = (req,res,next) => {

    let myOperations = req.body.order.products.map(prod => {
       return {
        updateOne: {
            filter: {_id: prod._id},
            update: {$inc: {stock: -prod.count ,sold: +prod.count}}
        }
       }
    })

    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            res.status(400).json({
                error:"bulk operations failed!"
            })
        }
        next()
    });
}

