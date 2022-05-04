const mysql = require('mysql');

//connection to db
const con = mysql.createConnection({
    host: "b1kz3wyilkzkgbcvthwe-mysql.services.clever-cloud.com",
    user: "unvhli21w5pbia4r",
    password: "nWuBECNMKAZ1SBTPYfk3",
    database: "b1kz3wyilkzkgbcvthwe"
});


con.connect(function (err) {
    // error exception 
    if (err) {
        console.log("Error while connecting to database:" + err);
        throw err;
    }

    console.log("Connected to Database!");
});


module.exports = con;