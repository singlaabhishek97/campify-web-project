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

    // CREATING Campground table (uncomment and run this once)
	var createCampTable = 'CREATE TABLE Campground (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(20), src VARCHAR(200), description VARCHAR(400))';
connection.query(createCampTable, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log('table creation query ran');
        }
    })

    //Clear the DB first then add new camps
    // connection.query('DELETE FROM Campground', function(err, result){
    //     if(err){
    //         throw err;
    //     }
    // });
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
}

module.exports = seedDB;