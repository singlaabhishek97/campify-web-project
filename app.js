var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true});

//Defining schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    src: String
})
var Campground = mongoose.model("Campground", campgroundSchema);

//Parse incoming body requests - req.body
app.use(bodyParser.urlencoded({extended: true}));

//Render the view from ejs
app.set("view engine", "ejs");

var campgrounds = [
    {
        name: "Solang Valley",
        src: "https://i.imgur.com/ODDE4xD.jpg"
    },
    {
        name: "Spiti Valley",
        src: "https://i.imgur.com/P8T8Sti.jpg"
    }
]

//Clear the DB first then add new camps
Campground.deleteMany({}, function(err){
    if(err){
        console.log(err);
    } else{
        console.log("campgrounds removed");
        campgrounds.forEach(function(seed){
            Campground.create(seed, function(err, newcamp){
                if(err){
                    console.log(err);
                } else{
                    console.log("new camp created : " + newcamp);
                }
            })
        })
    }
})

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
            res.render("campgrounds", {camps: foundcamps});
        }
    })
})

//New Route
app.get("/campgrounds/new", function(req,res){
    // res.send("Add new campground");
    res.render("new");
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
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("show", {camp:foundcamp});
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});