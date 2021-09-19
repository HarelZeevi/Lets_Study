//import hasWhiteSpace from '../../test/testInput.js';
const express = require("express");
require('dotenv').config()
const jwt = require("jsonwebtoken")
var fs = require('fs');
const fileUpload = require("express-fileupload");
//const Joi = require("joi");
const crypto = require("crypto");
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const path = require('path');
const nodemailer = require('nodemailer');
const { nextTick } = require("process");
app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname + "/client/"));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());

//hasWhiteSpace("hrllo sdasd")

//connection to db
const con = mysql.createConnection({
    host: "b1kz3wyilkzkgbcvthwe-mysql.services.clever-cloud.com",
    user: "unvhli21w5pbia4r",
    password:"nWuBECNMKAZ1SBTPYfk3",
    database: "b1kz3wyilkzkgbcvthwe"
});

con.connect(function(err) {
    // error exception 
    if (err)
    {
        console.log("Error while connecting to database:" + err);
        throw err;
        
    }
    
    console.log("Connected to Database!");
    
});

// checking result of get request
function checkGetReq(result, err, res)
{
    if(err)
    { 
        console.log(err);
        res.send("Error!");
    }
    else
    {
        console.log("Query was successfully executed!");
        console.log(result);
        if (Object.keys(result).length != 0)
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end(JSON.stringify(result));
        }
        else 
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("Not found");
            console.log("We didnt find what you are looking for...")
        }
    }
    return result;
}

// checking result of sign-up request
function checkSignUp(result, err, res, id, username, password)
{
    if(err)
    { 
        console.log(err);
        res.send("Error!");
    }
    else
    {
        console.log("Query was successfully executed!");
        console.log(result);
        if (result.affectedRows === 1)
        {
            signIn(res, id, username, password)
        }
        else 
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("Not found In Database!");
            console.log("Not found In Database!");
        }
    }
    return result;
}

// checking result of post request
function checkPostReq(result, err, res)
{
    if(err)
    { 
        console.log(err);
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("error: " + err);
        return;
    }
    else
    {
        console.log("Query was successfully executed!");
        console.log(result);
        if (Object.keys(result).length != 0)
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("Done successfully!");
        }
        else 
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            console.log("Not found In Database!");
            res.end("Not found In Database!");
            
        }
    }
    return result;
}

// checking auth
function checkAuth(result, err, res)
{
    if(err)
    { 
        console.log(err);
        res.send("Error!");
        throw err;
    }
    else
    {
        if (Object.keys(result).length != 0)
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            if (result[0].pswd != null){
                console.log("The user is already registerd.");
                return res.end("The user is already registerd.");
            }
            console.log("user exists")
            res.end("User Exists!");
        }
        else 
        {
            console.log("User was Not found!");
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("User was Not found!");
        }
    }
    return result;
}

// the function generates a random student-code and returns it
function generateStudentCode(length) {
    var code = "";
    for (let i = 0; i < length; i++) {
        code = code + Math.round(Math.random() * 9);
    }
    return code;
}

// add student to database
function addStudent(res, id, school, grade, classnum, pupilGender)
{
    const studentCode =  generateStudentCode(5);
    if (grade >= 10){
        userType = 'T'; // tutor
    }
    else 
        userType = 'P'; // pupil

    var sqlQuery1 = `
    INSERT INTO students
            (
						studentCode,
                        id,
                        userType,
                        profile_img,
                        fullname,
                        username, 
                        school, 
                        gender, 
                        grade,
                        phone,
                        email, 
                        pswd,
                        classnum,
                        token, 
                        expiration
            )
            VALUES
            (
                        ${mysql.escape(studentCode)},
                        ${mysql.escape(id)},
                        ${mysql.escape(userType)},
                        null,
                        null,
                        null,
                        ${mysql.escape(school)},
                        null,
                        ${mysql.escape(grade)},
                        null,
                        null,
                        null,
                        ${mysql.escape(classnum)},
                        null,
                        null
            );`;
    con.query(sqlQuery1,  function(err, result){});
    if (userType === 'T') // if tutor
    {
        var sqlQuery2 = `INSERT INTO tutors
                        (
                                    studentid,
                                    bio,
                                    isapproved,
                                    rate,
                                    tutoringHours,
                                    pupilGender
                        )
                        VALUES
                        (
                                    ${mysql.escape(id)},
                                    'Hi Im ${mysql.escape(grade)}th grader',
                                    false,
                                    5,
                                    0,
                                    ${mysql.escape(pupilGender)}
                        );`;
        con.query(sqlQuery2);
    }
    const response = {studentCode: studentCode}
    checkPostReq(JSON.stringify(response), undefined, res);
}

// register pre-authentication using studentCode and id check
function registerAuth(res, id, studentCode)
{
    let sqlQuery = `SELECT * FROM students WHERE id = ${mysql.escape(id)} AND StudentCode = ${mysql.escape(studentCode)};`;
    con.query(sqlQuery,  function(err, result){
        checkAuth(result, err, res);
    });
}


//This function checks wether a specific property name is already in the students table
function checkPropTest(result, err, res, propName)
{
    if(err)
    { 
        console.log(err);
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("error: " + err);
        return;
    }
    else
    {
        console.log("Query was successfully executed!");
        console.log(result);
        if (Object.keys(result).length != 0)
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            console.log("Alredy in use!");
            res.end("1");
        }
        else 
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            console.log("Not used - free to use!");
            res.end("0");
            
        }
    }
    return result;
}


// register middleware testing 
function testProperty(res, prop, name){
    let checkQuery;
    if (prop === "1")
        checkQuery = `SELECT * FROM students WHERE username = ${mysql.escape(name)};`;  
    else if (prop === "2")
        checkQuery = `SELECT * FROM students WHERE email = ${mysql.escape(name)};`;  
    else if (prop === "3") 
        checkQuery = `SELECT * FROM students WHERE phone = ${mysql.escape(name)};`;  
    if (checkQuery === undefined){
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        return res.end("Invalid property number!");
    }
    con.query(checkQuery,  function(err, result){
        checkPropTest(result, err, res)
    });
}

// Register function 
function register (res, id, studentCode, fullname, username, gender, phone, email, pswd)
{
    //const testRes = testRegister(res, username, phone, email, next);
   // console.log("Test result: " + testRes);
    //if (1 == 1 || testRes)
        //return null;
    //else{
        var sqlQuery = `UPDATE students 
                        SET fullname = ${mysql.escape(fullname)},
                            username = ${mysql.escape(username)}, 
                            gender = ${mysql.escape(gender)}, 
                            phone =  ${mysql.escape(phone)}, 
                            email =  ${mysql.escape(email)}, 
                            pswd =  ${mysql.escape(pswd)}
                        WHERE 
                            id = ${mysql.escape(id)} AND
                            StudentCode = ${mysql.escape(studentCode)};`;
        console.log(sqlQuery);
        con.query(sqlQuery,  function(err, result){
            checkSignUp(result, err, res, id, username, pswd);
        });
    //}
}

// students Sign in function
function signIn(res, id, username, password)
{  
    // creating jwt 
    var sqlQuery = `SELECT id, userType, fullname, username, school, gender, grade, phone, email, classnum
                    FROM students 
                    WHERE (id = ${mysql.escape(id)} OR username = ${mysql.escape(username)}) AND pswd = ${mysql.escape(password)};`;
    con.query(sqlQuery,  function(err, result){
        signJwt(result, err, res);
    });
}

// send to user sing in json-web-token access if authenticated 
function signJwt(result, err, res)
{
    if(err)
    { 
        console.log(err);
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Error!");
        throw err;
    }
    else
    {
        console.log("Query was successfully executed!");
        if (Object.keys(result).length != 0) // if result accepted 
        {

            if (!result[0].userType)
            {
                uType = 'A' // admin
            }
            else 
            {
                uType =  result[0].userType // 'P' or 'T'
            }
            
            user = Object.values(JSON.parse(JSON.stringify(result)))[0];
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"})
            console.log(accessToken);
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end(JSON.stringify({accessToken:accessToken}))
        }
        else 
        {
            console.log("not found");
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("1")
        }
    }
    return result;   
}

// authenticate token function to convert token to user object
function authJwt(req, res, next)
{
    console.log("Auth")
    const token = req.headers.authorization.split(' ')[1]
    if (token == null){ 
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        return res.end("unauthorized");   
    }
    try{
        let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.tokenData = decodeToken;
        next();
    }
    catch (err){ 
        console.log(err);
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("unauthorized")    
    }
}

// Admin sign in function
function signInAdmin(res, id, password)
{
    var sqlQuery = `SELECT * FROM admins WHERE id = ${mysql.escape(id)} AND pswd = ${mysql.escape(password)};`;
    con.query(sqlQuery,  function(err, result){
        signJwt(result, err, res);
    });
}



// Admin creation function
function createAdmin(res, id, firstname, lastname, pswd, school, phone, email)
{
    var sqlQuery = 
    `INSERT INTO admins
    (
                id ,
                firstname,
                lastname,
                pswd,
                school,
                phone,
                email
                
    )
    VALUES
    (
                ${mysql.escape(id)},
                ${mysql.escape(firstname)},
                ${mysql.escape(lastname)},
                ${mysql.escape(pswd)},
                ${mysql.escape(school)},
                ${mysql.escape(phone)},
                ${mysql.escape(email)}
    );`;
    con.query(sqlQuery,  function(err, result){
        checkGetReq(result, err, res);
    });
}

// look for a teacher function
function searchTeacher(res, subject, date, studentGender, tutorGender, grade1, grade2 = undefined, rate)
{
    var sqlQuery = `SELECT subjects.studentid, subjects.subjectname, subjects.points, students.fullname, tutors.bio, students.profile_img, students.grade, students.gender, tutors.rate, tutors.pupilGender, calendar.starttime, calendar.endtime, calendar.id
                    FROM subjects 
                    
                    INNER JOIN tutors ON subjects.studentid = tutors.studentid 
                    INNER JOIN students ON subjects.studentid = students.id
                    INNER JOIN calendar ON subjects.studentid = calendar.studentid
            
                    WHERE subjects.subjectname = ${mysql.escape(subject)}
                        AND calendar.availabledate = ${mysql.escape(date)}
                        AND tutors.isapproved = 1
                        AND (tutors.pupilGender = ${mysql.escape(studentGender)}
                            OR tutors.pupilGender IS NULL)
                        AND (tutors.rate >= ${mysql.escape(parseInt(rate))})
                    GROUP BY(subjects.studentid)`; 
    
    // student's gender preferences
    if (tutorGender)
        sqlQuery += `AND (students.gender = ${mysql.escape(tutorGender)})`;
    // Adding grade preferences accordingly
    // sending without grades preferences
    if (grade2 === undefined && grade1 != undefined){ 
        grade2 = grade1; // repeating the same checking
    }

    var gradesPrefs = `AND (students.grade = ${mysql.escape(grade1)} OR students.grade = ${mysql.escape(grade2)})`;  

    if (grade1 === undefined) // No grade preferences
        sqlQuery += ";";
    else 
        sqlQuery += gradesPrefs + ";";

        con.query(sqlQuery,  function(err, result){
            checkGetReq(result, err, res);
        });
}

// show available hours of tutor 
function showAvailableHours(res, tutorId)
{
    var sqlQuery = `SELECT * FROM calendar
                    INNER JOIN tutors ON tutors.studentid = calendar.studentid
                    WHERE calendar.studentId = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery,  function(err, result){
        checkGetReq(result, err, res);
    });
}

// delete a lesson from db by its id
function cancelLesson(res, lessonId, pupilId)
{ 
    var sqlQuery = `DELETE FROM lessons WHERE id = ${mysql.escape(lessonId)} AND pupilid = ${mysql.escape(pupilId)};`;  // delete the lesson itself
    con.query(sqlQuery,  function(err, result){
        checkGetReq(result, err, res);
    });
}

// show students
function showStudents(res)
{
    con.query("SELECT * FROM students", function(err, result){
        checkGetReq(result, err, res);
    });
}

// schedule and add lesson to database
function scheduleLesson(res, pupilId, tutorId, calendarId, subject, points, grade)
{
    const room = "LetsStudy/" + subject + "/" +  generateStudentCode(11);
    var sqlQuery = `INSERT INTO lessons(pupilId, tutorId, tutorcalid, subjectName, points, grade, tookplace, room) VALUES ( ${mysql.escape(pupilId)},  ${mysql.escape(tutorId)},  ${mysql.escape(calendarId)}, ${mysql.escape(subject)},${mysql.escape(points)}, ${mysql.escape(grade)}, 0, ${mysql.escape(room)})`;
    con.query(sqlQuery,function(err, result){
        checkGetReq(result, err, res);
    });
}

// show all the future lessons of a student
function showLessons(res, studentid)
{
    var sqlQuery = `SELECT * FROM lessons WHERE (pupilid = ${mysql.escape(studentid)} OR tutorid = ${mysql.escape(studentid)});`;
    con.query(sqlQuery,function(err, result){
        checkGetReq(result, err, res);
    });
}


// show statistical info about precentage of specific subject tutors out of all of the students
function showStats(res, cityid, subject)
{
    var students = 1;
    con.query(`SELECT COUNT(*) FROM students WHERE cityid = ${mysql.escape(cityid)};`, function(err, result){
        students = checkGetReq(result, err, res);
        con.query()
    });
    //console.log(students);
    /*
    var totalStdents = getnumberofstudentsincity(city);
    var studentsPerSubject=getnumberofstudentsofrequiredlessonincity(city, subject);
    var percentage = (numofstudentsofrequiredlesson * 100) / numofstudents;
    return percentage;
    */
}

// approve tutor
function approveTutor(res, studentId)
{
    con.query(`UPDATE tutors SET  tutors.isapproved = 1 WHERE studentid = ${mysql.escape(studentId)};`, function(err, result){
        checkGetReq(result, err, res);
    });
}

// add a calendar record to the calendar table that contains an availability schedule of the tutor for a specific day
function AddAvailableTime(res, tutorId, availableDate,  starttime, endtime)
{
    var sqlQuery = `
    INSERT INTO calendar
            (
                        studentid ,
                        availabledate ,
                        starttime ,
                        endtime
            )
            VALUES
            (
                        ${mysql.escape(tutorId)},
                        ${mysql.escape(availableDate)},
                        ${mysql.escape(starttime)},
                        ${mysql.escape(endtime)}
            );`
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });
}

// remove a calendar record from the calendar table that contains an availability schedule of the tutor for a specific day
function removeAvailableTime(res, calId)
{
    var sqlQuery = `DELETE FROM calendar WHERE id =  ${mysql.escape(calId)}`;
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });
}

// add specific teaching subject to tutor's list of teaching subjects
function  addTeachingSubjects(res, tutorId, subject, points, grade)
{
    var sqlQuery = `INSERT INTO subjects
                    (
                        studentid,
                        subjectname ,
                        points,
                        grade
                    )
                    VALUES
                    (
                        ${mysql.escape(tutorId)},
                        ${mysql.escape(subject)},
                        ${mysql.escape(points)},
                        ${mysql.escape(grade)}
                    );`;
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });
}

// remove specific teaching subject to tutor's list of teaching subjects
function removeTeachingSubjects(res, tutorId, subject, points, grade)
{
    var sqlQuery = `DELETE FROM subjects
                    WHERE (studentid = ${mysql.escape(tutorId)}
                        AND subjectname = ${mysql.escape(subject)}
                        AND points = ${mysql.escape(points)}
                        AND grade = ${mysql.escape(grade)});`;
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });
}

// get the amount ogf tutoring hours of a specific tutor
function getTutoringHours(res, tutorId){
    sqlQuery = `SELECT tutoringHours FROM tutors WHERE studentid = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });
}

// add a tutoring hour to a tutor after the lesson have been made
function addTutoringHour(res, tutorId){
    sqlQuery = `UPDATE tutors SET tutoringHours = (tutoringHours + 1) WHERE studentId = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });
}

// function for sending a string token generated to the user.
// function for finding student by its id / email in order to send him token
function findStudent(email, studentId, callback)
{
    sqlQuery = `SELECT * FROM students WHERE email = ${mysql.escape(email)} OR id = ${mysql.escape(studentId)};`;
        con.query(sqlQuery, function(err, result){
            if (err) throw err;
            return callback(result);
        });
}

function sendToken(res, result)
{
    console.log(result[0] == null);
    if (result[0] == null) // User couldn't be found by email or id
    {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Email was not found!");
        return;
    }
    var email = result[0].email;
    console.log("email:" + email);
    var studentId = result[0].id;
    console.log("id:" + studentId);
    var token = generateStudentCode(6);
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "letstudybuisness@gmail.com",
            pass: "asasdasdwgsdgaffg134134"
        }
    });

    var mailOptions = {
        from: "letstudybuisness@gmail.com",
        to: email,
        subject: 'Password Change Token',
        html: `:Please use this token to reset your password<br><b>${token}</b>`
    };
    smtpTransport.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("error")
            console.log(error);
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end(error);
        }
        else{
            //res.redirect('/');
            let expiration = new Date(); // current time
            expiration.setTime(expiration.getTime() + 5 * 60 * 1000); // adding 5 min to expiration
            sqlQuery = `UPDATE students SET token = ${mysql.escape(token)}, expiration = ${mysql.escape(expiration)} WHERE id = ${mysql.escape(studentId)};`;
            console.log('Email sent: ' + info.response);
            con.query(sqlQuery, function(err, result){checkGetReq(result, err, res)}); 
        }
    });
}

function compareTimes(tokentime)
{
    var currentdate = new Date(); 
    let tokenTime = new Date(tokentime);
    if (currentdate.getDate() <= tokenTime.getDate() &&
        currentdate.getTime() <= tokenTime.getTime())
        return true;
    return false;
}

function checkToken(token, callback)
{
    sqlQuery = `SELECT * FROM students WHERE token = ${mysql.escape(token)};`;
    con.query(sqlQuery, (err, result) => {
        if (err){ 
            throw err;
        }
        return callback(result);
    }); 
}

// password change using confirm password and password. uses: 
//    1. logged in 
//    2. reset password after token authentication
function changePassword(res, studentId, newPass)
{
    sqlQuery = `UPDATE students set pswd = ${mysql.escape(newPass)} WHERE id = ${mysql.escape(studentId)};`;
    console.log(sqlQuery);
    con.query(sqlQuery, function(err, result){
        checkPostReq(result, err, res);
    });   
}

// rate lesson
function rateLesson(res, tutorId, lessonId, rate)
{
    sqlQuery1 = `INSERT INTO rates
    (
                tutorid,
                lessonid,
                rate
                
                
    )
    VALUES
    (
                ${mysql.escape(tutorId)},
                ${mysql.escape(lessonId)},
                ${mysql.escape(rate)}
    );`
    // define avg var
    sqlQuery2 = `SELECT @avg_rate := AVG(rates.rate) FROM rates WHERE rates.tutorid = ${mysql.escape(tutorId)}`;
    
    //insert avg into general rate of tutor
    sqlQuery3 = `UPDATE tutors
    SET tutors.rate = @avg_rate
    WHERE tutors.studentid = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery1, function(err, result){
    }); 
    con.query(sqlQuery2, function(err, result){
    });
    con.query(sqlQuery3, function(err, result){
        checkGetReq(result, err, res);
    });
}

// check content image
async function moderator(img_path, callback)
{
    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://eastus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate',
    'headers': {
        'Ocp-Apim-Subscription-Key': '5cb93105c3b34cf0972df936167f0160',
        'Content-Type': 'image/png'
    },
    body: fs.createReadStream(img_path)

    };
    request(options, async function (error, response) {
    if (error) throw new Error(error);
    callback(/*response.body*/{Result:false});
    });
}


// image profile upload 
function uploadProfileImage(res, studentId, profileImg)
{
    let uploadPath = 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/profileImages/' + profileImg.name;

    // 'mv' function for uploading the file to the server
    if (profileImg.mimetype === "image/jpeg" || profileImg.mimetype === "image/png")
    {
        profileImg.mv(uploadPath, function(err) {
        if (err)
        {
            console.log(err);
            res.send(err);
        }
        else
            {
                status = moderator(uploadPath, (status)=> {
                    if (false && JSON.parse(status).Result === true)
                    {
                        console.log(status.Result);
                        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
                        res.end("Your profile image hasn't been uploaded because it was marked as inappropriate!");
                    }
                    else   
                    {
                        console.log(status)
                        console.log("Image approved!");
                        let sqlQuery = `UPDATE students SET profile_img = LOAD_FILE(${mysql.escape(uploadPath)}) WHERE id = ${mysql.escape(studentId)};`;
                        con.query(sqlQuery, function(err, result){
                            checkGetReq(result, err, res);
                        });
                    }
                });
            }
        });
    }
    else 
    {
        message = "This format is not allowed , please upload file with '.png' / '.jpg'";
        res.send(message);
    }
}

// function for getting jitsi room name by lesson id
function getRoomName(res, lessonId)
{
    let sqlQuery = `SELECT room FROM lessons WHERE id = ${mysql.escape(lessonId)}`;
    con.query(sqlQuery, function(err, result){
        checkGetReq(result, err, res);
    });   
}

// this function gets property number, new value for the property and user's id.
// the function will run an sql query that changes the property's old value to the new value. 
function changeProperty(res, propNum, val, id)
{
    let sqlQuery = `UPDATE students SET username = ${mysql.escape(val)} WHERE id = ${mysql.escape(id)};`;
    switch(propNum)
    {
        case 1:  // change username 
            break;
        case 2: // change Email
            sqlQuery = `UPDATE students SET email = ${mysql.escape(val)} WHERE id = ${mysql.escape(id)};`;
            break;
        case 3: // change phone number
            sqlQuery = `UPDATE students SET phone = ${mysql.escape(val)} WHERE id = ${mysql.escape(id)};`;
            break;
        case 4: // change tutor's bio information
            sqlQuery = `UPDATE tutors SET bio = ${mysql.escape(val)} WHERE studentid = ${mysql.escape(id)};`;
    }

    con.query(sqlQuery, function(err, result){
        checkPostReq(result, err, res);
    }); 

}

/* API routes*/

/* app possible methods:
    app.get(path, callback function - the called function in response)       -> getting information
    app.post()      -> adding new info
    app.put()       -> updating info
    app.delete()    -> deleting info
*/


// define a route of get request. this route stands on the root.
app.get('/', (req, res) => {
    res.send("Welcome to Sql Api!");
});


// check weather a user is logged in, if true return his name and image.
app.post('/api/students/isSignedIn', authJwt, (req, res) => {
    const username = undefined || req.tokenData.username;
    const profile_img = undefined || req.tokenData.profile_img;
    const navbarData = {
        username: username,
        profile_img: profile_img
    };
    res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
    res.end(JSON.stringify(navbarData));
});

// show students
app.get('/api/students', authJwt, (req, res) =>{
    showStudents(res);
});


// add student - admin 
// returns student-code
app.post('/api/students', authJwt, (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }
    
    // add student code
    const id = req.body.id; // admin enters info and the validation on the student's side
    const school = req.tokenData.school; // automatically entered by admin's school
    const grade = req.body.grade; // admin enters info
    const classnum = req.body.classnum; // admin enters info
    const pupilGender = req.body.pupilGender || undefined; // admin enters info
    
    addStudent(res, id, school, grade, classnum, pupilGender);
});

// pre registration authentication 
app.get('/api/students/registerAuth/:id/:studentCode', (req, res) => {
    const id = req.params.id;
    const studentCode = req.params.studentCode;

    registerAuth(res, id, studentCode);
});


// checking wether a property (email / username / phone) is already in the users table.
app.post('/api/students/register/propTest', (req, res) => {
    const prop = req.body.property;
    const name = req.body.name;
    testProperty(res, prop, name);
});

// register 
app.post('/api/students/register', (req, res) => {
    // for validation 
    const id = req.body.id;
    const studentCode = req.body.studentCode;
    
    const fullname = req.body.fullname; 
    const username = req.body.username; 

    const gender = req.body.gender; 
    // const partnergender = req.body.partnergender; remove and add only in tutor's case
    const phone = req.body.phone;
    const email = req.body.email;
    const pswd = req.body.pswd;
    register (res, id, studentCode, fullname, username, gender, phone, email, pswd);
});

// sign in - returns student object
app.post('/api/students/signIn', (req, res) => {
    const id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;
    signIn(res, id, username, password);
});

// sign in fro admin - returns admin object
app.post('/api/admins/signIn', (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    signInAdmin(res, id, password);
});

// create school admin 
app.post('/api/admins', (req, res) => {
    // add student code
    const id = req.body.id; 
    const firstname = req.body.firstname;
    const lastname = req.body.lastname; 
    const pswd = req.body.pswd; 
    const school = req.body.school;
    const phone = req.body.phone;
    const email = req.body.email;

    createAdmin(res, id, firstname, lastname, pswd, school, phone, email);
});

// look for a teacher
app.get('/api/tutors/:subject/:date/:rate/:tutorGender?/:grade1?/:grade2?', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    } 

    const subject = req.params.subject; // The lesson's requested subject (must pass)
    const date = req.params.date;       // The requested date of the lesson (must pass)
    const grade1 = req.params.grade1 || undefined;     //The tutor's preferred grade - 10 / 11 / 12 (optional pass)
    const grade2 = req.params.grade2 || undefined;     //The tutor's preferred grade - 10 / 11 / 12 (optional pass) 
    const studentGender = req.tokenData.gender;   // The learner's gender - male or female (must pass)
    const tutorGender = req.params.tutorGender || undefined;   // The tutor's preferred gender - male or female (optional pass)
    const rate = req.params.rate;
    searchTeacher(res, subject, date, studentGender, tutorGender, grade1, grade2, rate);
});

// show available hours
app.get('/api/availability/:tutorId', authJwt, (req, res) => {

    const tutorId = req.params.tutorId;
    showAvailableHours(res, tutorId);
});

// cancel lesson and delete it from db
app.delete('/api/lessons/:lessonId', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.") 

    const lessonId = req.params.lessonId;
    const pupilId = req.tokenData.id;
    cancelLesson(res, lessonId, pupilId);
});

// approve tutor function
app.put('/api/approveTutor/:tutorId', authJwt, (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.params.tutorId;
    approveTutor(res, tutorId);
});

// add lesson and shedule it
app.post('/api/lessons', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P')) return res.status(401).send("You are Not allowed to do this action.")

    const pupilId = req.tokenData.id;
    const tutorId = req.body.tutorId;
    const calendarId = req.body.calendarId;
    const subject = req.body.subject;
    const points = req.body.points;
    const grade = req.body.grade;
    scheduleLesson(res, pupilId, tutorId, calendarId, subject, points, grade);
});

// show upcoming lessons of a student / tutor by its id
app.get('/api/lessons/', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")
    
    const studentId = req.tokenData.id;
    showLessons(res, studentId);
});

// add available date and hour to tutor's schedule
app.post('/api/availability/', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.tokenData.id;
    const availableDate = req.body.availableDate;
    const starttime = req.body.starttime;
    const endtime = req.body.endtime;
    AddAvailableTime(res, tutorId, availableDate,  starttime, endtime);
});

// remove available date and hour from tutor's schedule
app.delete('/api/availability/:calendarId', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const calId = req.params.calendarId;
    removeAvailableTime(res, calId);
});

// add taching subject to tutor
app.post('/api/teachingSubjects/', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const subject = req.body.subject;
    const tutorId = req.tokenData.id;
    const grade = req.body.grade;
    const points = req.body.points;
    addTeachingSubjects(res, tutorId, subject, points, grade);
});

// remove teaching subject of tutor
app.delete('/api/teachingSubjects/:subject/:grade/:points', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const subject = req.params.subject;
    const tutorId = req.tokenData.id;
    const grade = req.params.grade;
    const points = req.params.points;
    removeTeachingSubjects(res, tutorId, subject, points, grade);
});

// get tutoring hours of a specific tutor
app.get('/api/tutoringHours/:tutorId', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.") 

    const tutorId = req.tokenData.id;
    getTutoringHours(res, tutorId);
});

// add tutoring hour to tutor
app.post('/api/tutoringHours', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.") 

    const tutorId = req.tokenData.id;
    addTutoringHour(res, tutorId);
});

// reset password using email 
app.post('/api/sendToken/', (req, res) => {
    const email = req.body.email;
    const studentId = req.body.studentId;
    findStudent(email, studentId, (result) => {sendToken(res, result)});
});
 
// check if token is the same as sent
app.post('/api/checkToken/', (req, res) => {
    const token = req.body.token;
    checkToken(token, (result) => {
        if (result[0] != null && token === result[0].token && compareTimes(result[0].expiration)){
            signIn(res, result[0].id, result[0].username, result[0].pswd);
        }
        else{    
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("1");
        }
    });
});


// change password 
app.post("/api/changePassword/", authJwt, (req, res) => {
    if (req.tokenData.userType != 'P' && req.tokenData.userType != 'T') {
        return res.end("You are not allowed to do this action!");
    }
    else{
        const studentId = req.tokenData.id;
        const newPass = req.body.newPass;
        console.log(newPass);
        changePassword(res, studentId, newPass);
    }
});

// rate lesson
app.post('/api/rates', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }

    const tutorId = req.body.tutorId;
    const lessonId = req.body.lessonId;
    const rate = req.body.rate;
    
    rateLesson(res, tutorId, lessonId, rate)
});


app.get('/api/stats/:cityid/:subject', authJwt, (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }
    
    const cityid = req.params.cityid;
    const subject = req.params.subject;
    showStats(res, cityid, subject);
});

// userr account settings update below

// upload profile image
app.post('/api/students/uploadProfileImg/', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
    }
    else 
    {
        console.log("Starting file upload!");
        let profileImg = req.files.profileImg;
        let studentId = req.tokenData.id;
        uploadProfileImage(res, studentId, profileImg);    
    }
});

// change username
app.post('/api/students/changeUsername', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }

    const newUsername = req.body.newUsername;
    const id = req.tokenData.id;

    changeProperty(res, 1, newUsername, id)
})

// change Email
app.post('/api/students/changeEmail', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }

    const newEmail = req.body.newEmail
    const id = req.tokenData.id;
    
    changeProperty(res, 2, newEmail, id);
})

// change phone number
app.post('/api/students/changePhone', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }
    
    const newPhone = req.body.newPhone;
    const id = req.tokenData.id;
    
    changeProperty(res, 3, newPhone, id);
})

// change tutor's bio info
app.post('/api/tutors/changeBio', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }

    const newBio = req.body.newBio;
    const id = req.tokenData.id;
    
    changeProperty(res, 4, newBio, id);
})

// getting jitsi room name
app.get('/api/lessonRoom/:lessonId', (req, res) => {
    const lessonId = req.params.lessonId;
    getRoomName(res, lessonId)
});

// integration
    
app.get('/index',function(req,res){
    res.sendFile(path.join(__dirname+'/client/signup.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/signup.css', function(req, res) {
    res.sendFile(__dirname + "/client/" + "signup.css");
  });

app.get('/jitsi',function(req, res) {
     res.sendFile(__dirname + "/client/" + "jitsi.html");
});

// reading PORT envirinment var to get an opened port
// If PORT is not set then the port var will get 3000.
const port = process.env.PORT || 1234;
app.listen(port, () => console.log(`[Listening on port ${port}]...`));