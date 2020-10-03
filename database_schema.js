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

    // CREATING User table
	var createUserTable = 'CREATE TABLE User (username VARCHAR(30) PRIMARY KEY, password VARCHAR(30) NOT NULL)';
    connection.query(createUserTable, function(err){
        if(err){
            console.log(err);
        } else{
            console.log('user table creation query ran');
        }
    })

    // CREATING Campground table
	var createCampTable = 'CREATE TABLE Campground (id INT PRIMARY KEY AUTO_INCREMENT, ownername VARCHAR(30), name VARCHAR(20), src VARCHAR(200), description VARCHAR(400), FOREIGN KEY(ownername) REFERENCES User(username))';
    connection.query(createCampTable, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log('campground table creation query ran');
        }
    })

    // CREATING Comment table
	var createCommentTable = 'CREATE TABLE Comment (camp_id INT, text VARCHAR(200), author VARCHAR(30), FOREIGN KEY(camp_id) REFERENCES Campground(id), FOREIGN KEY(author) REFERENCES User(username))';
    connection.query(createCommentTable, function(err, results, fields){
        if(err){
            console.log(err);
        } else{
            console.log('comment table creation query ran');
        }
    })
}

module.exports = define_tables_schema;