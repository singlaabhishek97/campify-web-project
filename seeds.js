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
    //DROP and CREATE new DATABASE
    connection.query('DROP DATABASE campify', function(err, results){
        if (err) {
            throw err;
        }
    })
    connection.query('CREATE DATABASE campify', function(err, results){
        if (err) {
            throw err;
        }
    })
    connection.query('USE campify', function(err, results){
        if (err) {
            throw err;
        }
    })

    // CREATING Campground table
	var createCampTable = 'CREATE TABLE Campground (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(20), src VARCHAR(200), description VARCHAR(400))';
    connection.query(createCampTable, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log('table creation query ran');
        }
    })

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

    // CREATING Comment table
	var createCommentTable = 'CREATE TABLE Comment (camp_id INT, text VARCHAR(200), author VARCHAR(30), FOREIGN KEY(camp_id) REFERENCES Campground(id))';
    connection.query(createCommentTable, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log('comment creation query ran');
        }
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