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
// 	var createCampTable = 'CREATE TABLE Campground (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(20), src VARCHAR(200), description VARCHAR(400))';
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
        src: "https://i.imgur.com/ODDE4xD.jpg",
        description: "Solang Valley in Manali attracts visitors from the far ends of the world"
    },
    {
        name: "Spiti Valley",
        src: "https://i.imgur.com/P8T8Sti.jpg",
        description: "Spiti Valley nestled in the Keylong district of Himachal Pradesh"
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
    var query = 'SELECT * FROM Campground WHERE id = ' + req.params.id;
    connection.query(query, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("show", {camp:foundcamp[0]});
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});