var express = require("express");
var app = express();
var bodyParser = require("body-parser");

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

app.get("/home", function(req, res){
    res.render("landing.ejs");
})

app.get("/", function(req, res){
    res.redirect("/home");
})
app.get("/campgrounds", function(req, res){
    res.render("campgrounds.ejs", {camps: campgrounds});
})

app.get("/campgrounds/new", function(req,res){
    // res.send("Add new campground");
    res.render("new");
})

app.post("/campgrounds", function(req, res){
    // res.send("You hit the post route");
    campgrounds.push({name: req.body.name, src: req.body.src})
    res.redirect("/campgrounds");
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});