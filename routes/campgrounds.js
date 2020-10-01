//=========================
//    CAMPGROUND ROUTES
//=========================

var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground");

//Index route
router.get("/campgrounds", function(req, res){
    Campground.find({},function(err, foundcamps){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/campgrounds", {camps: foundcamps});
        }
    })
})

//New Route
router.get("/campgrounds/new", isLoggedIn, function(req,res){
    // res.send("Add new campground");
    res.render("campgrounds/new");
})

//Create Route
router.post("/campgrounds", isLoggedIn, function(req, res){
    // res.send("You hit the post route");
    Campground.create({
        name: req.body.name,
        src: req.body.src,
        description: req.body.description
    }, function(err, camp){
        if(err){
            console.log(err);
        } else{
            console.log("we saved a campground");
            console.log(camp);
        }
    })
    res.redirect("/campgrounds");
})

//SHOW Route
router.get("/campgrounds/:id", function(req, res){
    //Populate method work as 'campground left join comments' as in SQL
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {camp:foundcamp});
        }
    })
})

//Middleware Functions
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;