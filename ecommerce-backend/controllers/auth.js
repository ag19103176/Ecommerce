const User = require('../models/user')
const {check,validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const ejwt = require('express-jwt')
exports.signup = (req,res) => {
    // console.log(req.body);
    //validation
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        });
    }

    const user = new User(req.body);
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                err: "not able to save user!"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    }); 
};
exports.signin = (req,res) => {
    const {email,password} = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        });
    }

    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"USER EMAIL DOESNT EXISTS!"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password do not match!"
            })
        }
        //token 
        const token = jwt.sign({_id: user._id},"gautamisonline")
        //cookie
        res.cookie("token",token,{expire: new Date() + 9999});

        //res to frontend
        const {_id,name,email,role} = user;
        return res.json({
            token,user:{_id,name,email,role}
        });
    });
}
exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message: "User Signout!"
    })
}; 

//protected routes
exports.isSignedIn = ejwt({
    secret: "gautamisonline",
    userProperty: "auth"
});

//custom middleware
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED!"
        });
    } 
    next();
};

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not admin!"
        })
    }
    next();
}
