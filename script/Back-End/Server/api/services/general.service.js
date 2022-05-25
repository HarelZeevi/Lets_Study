/* Here goes eveything related to returning data to the user by sending response to him */
const jwt = require("jsonwebtoken")


// returning result of get data request
function getResultObject(result, err, res) {
    if (err) {
        console.log(err);
        res.send("Error!");
    } else {
        console.log("Query was successfully executed!");
        console.log(result);
        if (Object.keys(result).length != 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Not found");
            console.log("We didnt find what you are looking for...")
        }
    }
    return result;
}

// checking result of sign-up request
function checkSignUp(result, err, res, id, username, password) {
    if (err) {
        console.log(err);
        res.send("Error!");
    } else {
        console.log("Query was successfully executed!");
        console.log(result);
        if (result.affectedRows === 1) {
            signIn(res, id, username, password)
        } else {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Not found In Database!");
            console.log("Not found In Database!");
        }
    }
    return result;
}

// checking if a certain action was done without any errors
function checkActionDone(result, err, res) {
    if (err) {
        console.log(err);
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("error: " + err);
        return;
    } else {
        console.log("Query was successfully executed!");
        console.log(result);
        if (Object.keys(result).length != 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Done successfully!");
        } else {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            console.log("Not found In Database!");
            res.end("Not found In Database!");

        }
    }
    return result;
}

// checking if availablilty was added without any errors
function checkError(result, err, res, resolve) {
    if (!res.headersSent) {
        if (err != null)
            console.log("err");
        if (err) {
            //res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            console.log(err);
            //res.end("error: " + err);
            return resolve(err);
        }
        if (result.affectedRows === 0) {
            //res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            console.log("Not found In Database!");
            //res.end("Not found In Database!");
            return resolve("Not found");
        }

    }
    resolve();

}


// checking auth
function checkAuth(result, err, res) {
    if (err) {
        console.log(err);
        res.send("Error!");
        throw err;
    } else {
        if (Object.keys(result).length != 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            if (result[0].pswd != null) {
                console.log("The user is already registerd.");
                return res.end("The user is already registerd.");
            }
            console.log("user exists")
            res.end("User Exists!");
        } else {
            console.log("User was Not found!");
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("User was Not found!");
        }
    }
    return result;
}

// send to user sing in json-web-token access if authenticated 
const signJwt = (result, resultObj, err, res) => {
    if (!result) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        // invalid password
        res.end("1");
        return;
    }
    if (err) {
        console.log(err);
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Error!");
        throw err;
    } else {
        console.log("Query was successfully executed!");
        if (Object.keys(resultObj).length != 0) // if result accepted 
        {

            let uType;
            if (!resultObj[0].userType) {
                uType = 'A' // admin
            } else {
                uType = resultObj[0].userType // 'P' or 'T'
            }

            if (uType === 'T')
                resultObj[0].isTeacher = true;
            else
                resultObj[0].isTeacher = false;
            user = Object.values(JSON.parse(JSON.stringify(resultObj)))[0];
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            console.log(accessToken);
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end(JSON.stringify({
                accessToken: accessToken
            }))
        } else {
            console.log("not found");
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("1")
        }
    }
    return resultObj;
}


module.exports = {
    getResultObject,
    checkSignUp,
    checkActionDone,
    checkError,
    checkAuth,
    signJwt
}