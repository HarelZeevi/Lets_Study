const mysql = require(`mysql`);

const db =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"1234",
    database: "lets_study_users"
});

db.connect(function(err) {
    // error exception 
    if (err)
    {
        console.log("Error while connecting to database:" + err);
        throw err;
        
    }
    
    console.log("Connected to Database!");
    
});

async function showstudents()
{    
    const result1 = await db.query('SELECT * FROM students;');
    console.log(result1[0]);
};

showstudents(db)