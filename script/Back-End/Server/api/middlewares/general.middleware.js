const jwt = require("jsonwebtoken")

// register middleware testing 
function testProperty(res, prop, name) {
    let checkQuery;
    if (prop === "1")
        checkQuery = `SELECT * FROM students WHERE username = ${mysql.escape(name)};`;
    else if (prop === "2")
        checkQuery = `SELECT * FROM students WHERE email = ${mysql.escape(name)};`;
    else if (prop === "3")
        checkQuery = `SELECT * FROM students WHERE phone = ${mysql.escape(name)};`;
    if (checkQuery === undefined) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return res.end("Invalid property number!");
    }
    con.query(checkQuery, function (err, result) {
        checkPropTest(result, err, res)
    });
}


// authenticate token function to convert token to user object
function authJwt(req, res, next) {

    const token = req.headers.authorization.split(' ')[1]
    console.log(token);
    if (token == null) {
        console.log("unauthorized")
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return res.end("unauthorized");
    }
    try {

        let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.tokenData = decodeToken;
        next();
    } catch (err) {
        console.log(err);
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return res.end("unauthorized")
    }
}


module.exports = {
    testProperty,
    authJwt
}