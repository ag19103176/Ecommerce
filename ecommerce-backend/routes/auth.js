const express = require('express');
var router = express.Router();
const {signout} = require('../controllers/auth')
const {signup} = require('../controllers/auth')
const {signin} = require('../controllers/auth')
const {isSignedIn} = require('../controllers/auth')
const {check,validationResult} = require('express-validator')

router.post('/signup',[
    check("name").isLength({ min:3 }).withMessage("must be atleast 3 characters long!"),
    check("email").isEmail().withMessage("email is required!"),
    check("password").isLength({ min:3 }).withMessage("should be atleast 3 char long!"),
],signup);

router.post('/signin',[
    check("email").isEmail().withMessage("email is required!"),
    check("password").isLength({ min:3 }).withMessage("password field is required!"),
],signin);

router.get('/signout',signout);
//protected route!
router.get('/testroute',isSignedIn,(req,res)=>{
  res.json(req.auth);  
});



module.exports = router; 