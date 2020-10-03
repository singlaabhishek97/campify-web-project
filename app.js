var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var seedDB = require("./seeds");
var define_tables_schema = require("./database_schema");

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '<mysql root password>'
})

//Define tables schema
define_tables_schema(connection);

//Initialising database
seedDB(connection);

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

//INDEX Route
app.get("/campgrounds", function(req, res){
    connection.query('select * from campground', function(err, foundCamps){
        if(err){
            console.log(err);
        } else{
            //console.log(foundCamps);
            res.render("campgrounds/campgrounds", {camps: foundCamps});
        }
    })
})

//New Route
app.get("/campgrounds/new", function(req,res){
    // res.send("Add new campground");
    res.render("campgrounds/new");
})

//CREATE Route
app.post("/campgrounds", function(req, res){
    // res.send("You hit the post route");
    // campgrounds.push({name: req.body.name, src: req.body.src})
    var newCamp = {
        name: req.body.name,
        src: req.body.src,
        description: req.body.description
    }
    connection.query('INSERT INTO Campground SET ?', newCamp, function(err, result){
        if(err) {
            console.log(err);
        } else{
            console.log(result);
        }
    })
    res.redirect("/campgrounds");
})

//SHOW Route
app.get("/campgrounds/:id", function(req, res){
    var query = 'SELECT * FROM Campground LEFT JOIN Comment ON Campground.id = Comment.camp_id WHERE id = ' + req.params.id;
    connection.query(query, function(err, foundcamprows){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {camp:foundcamprows});
        }
    })
})

//=========================
//    COMMENT ROUTES
//=========================

//New comment route
app.get("/campgrounds/:id/comments/new", function(req, res){
    console.log(req.params.id);
    // res.send("you have ht new comment page");
    var query = 'SELECT * FROM Campground WHERE id = ' + req.params.id;
    connection.query(query, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {camp: foundcamp[0]});
        }
    })
})

//Create Comment Route
app.post("/campgrounds/:id/comments", function(req, res){
    // res.send("You hit the post route");
    var newComment  = req.body.comment;
    newComment.camp_id = req.params.id;
    connection.query('INSERT INTO Comment SET ?', newComment, function(err){
        if(err) {
            console.log(err);
        } else{
            console.log("comment added successfully");
        }
        res.redirect("/campgrounds/" + req.params.id);
    })
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});