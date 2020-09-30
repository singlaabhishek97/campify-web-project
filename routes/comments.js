//=========================
//    COMMENT ROUTES
//=========================

var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

//New comment route
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {camp: foundcamp});
        }
    })
})

//Create Comment Route
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // res.send("You hit the post route");
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err) {
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err, newcomment){
                if(err){
                    console.log(err);
                } else{
                    foundcamp.comments.push(newcomment);
                    foundcamp.save();
                }
            })
        }
        res.redirect("/campgrounds/"+foundcamp._id);
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;