function define_tables_schema(connection){
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

    // CREATING Comment table
	var createCommentTable = 'CREATE TABLE Comment (camp_id INT, text VARCHAR(200), author VARCHAR(30), FOREIGN KEY(camp_id) REFERENCES Campground(id))';
    connection.query(createCommentTable, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log('comment creation query ran');
        }
    })
}

module.exports = define_tables_schema;