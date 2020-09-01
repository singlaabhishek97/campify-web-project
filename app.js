var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground  = require("./models/campground");
var seedDB      = require("./seeds");
var Comment     = require("./models/comment");

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true});

//Initialising database
seedDB();

//Parse incoming body requests - req.body
app.use(bodyParser.urlencoded({extended: true}));

//Render the view from ejs
app.set("view engine", "ejs");

app.get("/home", function(req, res){
    res.render("landing.ejs");
})

app.get("/", function(req, res){
    res.redirect("/home");
})

//Index route
app.get("/campgrounds", function(req, res){
    Campground.find({},function(err, foundcamps){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/campgrounds", {camps: foundcamps});
        }
    })
})

//New Route
app.get("/campgrounds/new", function(req,res){
    // res.send("Add new campground");
    res.render("campgrounds/new");
})

//Create Route
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/:id", function(req, res){
    //Populate method work as 'campground left join comments' as in SQL
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {camp:foundcamp});
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});