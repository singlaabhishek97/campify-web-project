var mongoose = require("mongoose");

//Defining schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    src: String,
    description: String
})

module.exports = mongoose.model("Campground", campgroundSchema);