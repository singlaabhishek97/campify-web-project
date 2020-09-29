var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground  = require("./models/campground");
var seedDB      = require("./seeds");
var Comment     = require("./models/comment");
var User     = require("./models/user");
var passport = require("passport");
var LocalStrategy   = require("passport-local");

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true});

//Initialising database
seedDB();

//Parse incoming body requests - req.body
app.use(bodyParser.urlencoded({extended: true}));

//Render the view from ejs
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Any number of words",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

//=========================
//    COMMENT ROUTES
//=========================

//New comment route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {camp: foundcamp});
        }
    })
})

//Create Comment Route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//===========
//AUTH ROUTES
//===========

//SHOW signup FORM
app.get("/register", function(req, res){
    res.render("register");
})

//HANDLE SIGNUP
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
})

//HANDLE LOGIN
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
 });
 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});