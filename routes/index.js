//=========================
//    INDEX AUTH ROUTES
//=========================

var express = require("express");
var router  = express.Router({mergeParams: true});

var passport = require("passport");
var User = require("../models/user");

router.get("/home", function(req, res){
    res.render("landing.ejs");
})

router.get("/", function(req, res){
    res.redirect("/home");
})

//SHOW signup FORM
router.get("/register", function(req, res){
    res.render("register");
})

//HANDLE SIGNUP
router.post("/register", function(req, res){
    // res.send("Signing you up");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
})

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
})

//HANDLE LOGIN
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
 });
 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;