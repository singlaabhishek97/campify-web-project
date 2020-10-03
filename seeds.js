var users = [
    {
        username: 'user1',
        password: 'pass1'
    },
    {
        username: 'user2',
        password: 'pass2'
    }
]

var campgrounds = [
    {
        ownername: 'user1',
        name: "Solang Valley",
        src: "https://i.imgur.com/ODDE4xD.jpg",
        description: "Solang Valley in Manali attracts visitors from the far ends of the world"
    },
    {
        ownername: 'user2',
        name: "Spiti Valley",
        src: "https://i.imgur.com/P8T8Sti.jpg",
        description: "Spiti Valley nestled in the Keylong district of Himachal Pradesh"
    }
]

function seedDB(connection){
    var insertUsers = 'INSERT INTO User set ?';
    users.forEach(function(item){
        connection.query(insertUsers, item, function(err){
            if(err){
                console.log(err);
            } else{
                console.log("users inserted");
            }
        })
    })

    var insertCamps = 'INSERT INTO Campground set ?';
    campgrounds.forEach(function(item){
        connection.query(insertCamps, item, function(err, results, fields){
            if(err){
                console.log(err);
            } else{
                console.log("camps inserted");
            }
        })
    })

    //INSERTING Comments
    connection.query('SELECT * FROM Campground', function(err, foundcamps){
        if(err){
            console.log(err);
        } else{
            foundcamps.forEach(function(item){
                var newComment = {
                    camp_id: item.id,
                    text: "Sample comment",
                    author: item.ownername
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