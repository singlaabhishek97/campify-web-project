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
            console.log(foundCamps);
            res.render("campgrounds.ejs", {camps: foundCamps});
        }
    })
})

//New Route
app.get("/campgrounds/new", function(req,res){
    // res.send("Add new campground");
    res.render("new");
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
    var query = 'SELECT * FROM Campground LEFT JOIN Comment ON Campground.id = Comment.camp_id WHERE id = ' + req.params.id
    connection.query(query, function(err, foundcamprows){
        if(err){
            console.log(err);
        } else{
            res.render("show", {camp:foundcamprows});
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});