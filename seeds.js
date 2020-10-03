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

function seedDB(connection){
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

    //INSERTING Comments
    connection.query('SELECT id FROM Campground', function(err, foundcamps){
        if(err){
            console.log(err);
        } else{
            foundcamps.forEach(function(item){
                var newComment = {
                    camp_id: item.id,
                    text: "Sample comment",
                    author: "Default User"
                }
                connection.query('INSERT INTO Comment SET ?', newComment, function(err, result){
                    if(err){
                        console.log(err);
                    } else{
                        console.log("new comment inserted");
                    }
                })
            })
        }
    })
}

module.exports = seedDB;