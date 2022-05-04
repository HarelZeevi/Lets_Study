//import hasWhiteSpace from '../../test/testInput.js';
const express = require("express");
require('dotenv').config()

const fileUpload = require("express-fileupload");

const cors = require('cors')
const app = express();



const {
    nextTick
} = require("process");

app.use(express.json());
app.use(fileUpload());



var bodyParser = require('body-parser');
const {
    application
} = require("express");

const e = require("express");
const {
    table
} = require("console");
const {
    constants
} = require("buffer");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());



/* //This function checks wether a specific property name is already in the students table
function checkPropTest(result, err, res, propName) {
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
            console.log("Already in use!");
            res.end("1");
        } else {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            console.log("Not used - free to use!");
            res.end("0");

        }
    }
    return result;
} */




//ROUTE VARS
require('./routes/general.route')(app)


// reading PORT envirinment var to get an opened port
// If PORT is not set then the port var will get 3000.
const port = process.env.PORT || 1234;
app.listen(port, () => console.log(`[Listening on port ${port}]...`));