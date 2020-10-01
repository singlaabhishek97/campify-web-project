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
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");

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

//For method overriding (put=post)
app.use(methodOverride("_method"));

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(process.env.PORT || 3000, () => {
	console.log('server listening on port 3000');
});