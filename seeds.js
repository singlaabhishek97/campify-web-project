var mongoose    = require("mongoose");
var Campground  = require("./models/campground");

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

function seedDB(){
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
}

module.exports = seedDB;