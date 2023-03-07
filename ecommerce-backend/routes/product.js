const express = require('express');
const { isSignedIn, isAuthenticated,isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');
const { getProductById,createProduct,getProduct,photo,deleteProduct,updateProduct,getAllProducts,getAllCategories,getAllUnique} = require('../controllers/product');
const router = express.Router()

//params
router.param("userId",getUserById);
router.param("productId",getProductById);

//real routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
router.get("/product/:productId",getProduct);
//performance optimisation
router.get("/product/photo/:productId",photo);
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);
router.get("/products",getAllProducts);
router.get("/products/categories",getAllUnique);

module.exports = router;