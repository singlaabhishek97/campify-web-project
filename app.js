var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '<mysql root password>',
    database : 'campify'
})

//Parse incoming body requests - req.body
app.use(bodyParser.urlencoded({extended: true}));

//Render the view from ejs
app.set("view engine", "ejs");

//CREATING Campground table (uncomment and run this once)
// 	var createCampTable = 'CREATE TABLE Campground (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(20), src VARCHAR(200))';
// connection.query(createCampTable, function(err, results, fields){
//     if(err){
//         console.log(err);
//     } else{
//         console.log('table creation query ran');
//     }
// })

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
connection.query('DELETE FROM Campground', function(err, result){
    if(err){
        throw err;
    }
});
var insertCamps = 'INSERT INTO Campground set ?';
campgrounds.forEach(function(item){
    connection.query(insertCamps, item, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log(results);
        }
    })
})

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

//SHOW Route
app.get("/campgrounds/:id", function(req, res){
    res.render("show", {camp: campgrounds[req.params.id]});

})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});