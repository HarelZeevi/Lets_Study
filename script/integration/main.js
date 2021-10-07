//import hasWhiteSpace from '../../test/testInput.js';
const express = require("express");
require('dotenv').config()
const jwt = require("jsonwebtoken")
var fs = require('fs');
const fileUpload = require("express-fileupload");
const 
tests = require('../../test/testInput')
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
const { application } = require("express");
const e = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());



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
                        imgFileExt,
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
    con.query(sqlQuery1);
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
                                    'Hi Im ${parseInt(mysql.escape(grade))}th grader',
                                    0,
                                    5,
                                    0,
                                    ${mysql.escape(pupilGender)}
                        );`;
        con.query(sqlQuery2);
    }
    const response = {studentCode: studentCode}
    checkGetReq(JSON.stringify(response), undefined, res);
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
    var sqlQuery = `SELECT id, userType, fullname, username, pswd, school, gender, grade, phone, email, classnum
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
    var sqlQuery = `SELECT subjects.studentid, subjects.subjectname, subjects.points, students.fullname, tutors.bio, students.imgFileExt, students.grade, students.gender, tutors.rate, tutors.pupilGender
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
    return callback(/*response.body*/{Result:false});
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
    let uploadPath = 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/profileImages/' + studentId;
    var imgType;
    console.log("is png: " + profileImg.match("png"));
    if (profileImg.match("jpg"))
    {
        console.log("jpg")
        var base64Data = profileImg.replace("data:image/jpg;base64,", "");
        require("fs").writeFile(uploadPath + ".jpg", base64Data, 'base64', function(err) {
            console.log("jpg")
        });
        imgType = ".jpg";
    }
    else if (profileImg.match("png"))
    {
        console.log("jpg")
        var base64Data = profileImg.replace("data:image/png;base64,", "");
        require("fs").writeFile(uploadPath + ".png", base64Data, 'base64', function(err) {
            console.log("jpg")
        });
        imgType = ".png";
    }

    else if (profileImg.match("jpeg"))
    {
        var base64Data = profileImg.replace("data:image/jpeg;base64,", "");
        require("fs").writeFile(uploadPath + ".jpeg", base64Data, 'base64', function(err) {
            console.log("jpeg")
        });
        imgType = ".jpeg";
    }
    else 
    {
        message = "This format is not allowed , please upload file with '.png' / '.jpg'";
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end(message);
        return;
    }

    uploadPath += imgType;
    

    status = moderator(uploadPath, (status)=> {
        if (false && JSON.parse(status).Result === true)
        {
            console.log(status.Result);
            res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
            res.end("Your profile image hasn't been uploaded because it was marked as inappropriate!");
        }
        else   
        {
            console.log(uploadPath)
            console.log("Image approved!");
            let sqlQuery = `UPDATE students SET imgFileExt = ${mysql.escape(imgType)} WHERE id = ${mysql.escape(studentId)};`;
            console.log(sqlQuery);
            con.query(sqlQuery, function(err, result){
                checkGetReq(result, err, res);
            });
        }
    });
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
function changeProperty(req, res, propNum, val, id)
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

    console.log(sqlQuery);
    con.query(sqlQuery, function(err, result){
        //checkPostReq(result, err, res);
    }); 
    console.log(req.tokenData)
    console.log(val)
    if (propNum == 1)
        signIn(res, id, undefined, req.tokenData.pswd);
    else    
        signIn(res, id, undefined, req.tokenData.pswd);

}

function testData(value, inputType)
{
    return 0;
    switch(inputType)
    {
        case 1: // name
        {    
            if(!(tests.validateName(value)))
                return 1;
        }
        case 2: // pswd
        {    
            if(!(tests.validatePswd(value)))
                return 2;
            break;
        }
        case 3: // username
        {    
            if(!(tests.validateUsername(value)))
                return 3;
            break;
        }
        case 4: //phone
        {    
            if(!(tests.validatePhone(value)))
                return 4;
            break;
        }
        case 5: // id
        {    
            if(!(tests.validateId(value)))
                return 5;
            break;
        }
        case 6: // email
        {    
            if(!(tests.validateEmail(value)))
                return 6;
            break;
        }
        case 7: //
        {
            // check here
        }
    }
    return 0;
}

// read file and return it's base 64
function base64Img(id, ext) {
    let file = 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/profileImages/' + id + ext;
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return  Buffer.from(bitmap).toString('base64');
}

// this function returns base64 image of student
function get_profile_img(id, callback){
    
    var sql = `SELECT imgFileExt FROM students WHERE id = ${mysql.escape(id)}`;

    con.query(sql, function(err, results){
          if (err){ 
            throw err;
          }
          callback(results[0].imgFileExt);
  })
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
    var profile_img = "";
    get_profile_img(req.tokenData.id, function(extension){
        const phone = undefined || req.tokenData.phone;
        const email = undefined || req.tokenData.email;
        
        base64Data = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAABJJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6QXR0cmliPSdodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICA8QXR0cmliOkFkcz4KICAgPHJkZjpTZXE+CiAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz4KICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMS0wOS0xOTwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgPEF0dHJpYjpFeHRJZD42OWM2YzA3NS1mNjE1LTRjZTItYmEyMi05ZThhY2VmNTg2MjI8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+R3JlZW4gYW5kIFB1cnBsZSBBY3Rpb24gQWR2ZW50dXJlIFZpZGVvIEdhbWluZyBMb2dvPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2Rj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`;
        base64Data = base64Img(req.tokenData.id, extension)
        if (base64Data.indexOf("dataimage/") == -1)
            base64Data = `data:image/${extension.replace(".", "")};base64,` + base64Img(req.tokenData.id, extension)
        else
            base64Data = base64Data.replace("dataimage/", "data:image/").replace("base64", ";base64,");
        const navbarData = {
            username: username,
            profile_img: base64Data,
            phone: phone,
            email: email
        };
        
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end(JSON.stringify(navbarData));
    })
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
    
    console.log("res" + testData(id, 5));
    if(testData(id, 5) !== 0)
    {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Invalid input!");
        return;
    }
    
    addStudent(res, id, school, grade, classnum, pupilGender);
});

// pre registration authentication 
app.get('/api/students/registerAuth/:id/:studentCode', (req, res) => {
    const id = req.params.id;
    const studentCode = req.params.studentCode;

    if(testData(id, 5) !== 0)
    {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Invalid id!");
        return;
    } 

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

    /*if(testData(username, 3) !== 0 ||
       testData(fullname, 1) !== 0 || 
       testData(id, 5) !== 0 ||
       testData(phone, 4) !== 0 ||
       testData(email, 6) !== 0)
    {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Invalid input!");
        return;
    } */

    register (res, id, studentCode, fullname, username, gender, phone, email, pswd);
});

// sign in - returns student object
app.post('/api/students/signIn', (req, res) => {
    const id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;
    if(false && (testData(password, 2) !== 0 || 
       testData(id, 5) !== 0))
    {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Invalid Username!");
        return;
    } 
    signIn(res, id, username, password);
});

// sign in fro admin - returns admin object
app.post('/api/admins/signIn', (req, res) => {
    const id = req.body.id;
    const password = req.body.password;

    console.log("id: " + id + " password: " + password);
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
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.status(401).send("You are Not allowed to do this action.")
    
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
    console.log(req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        console.log("no file");
        res.status(200).send('No files were uploaded.');
    }
    else 
    {
        console.log("Starting file upload!");
        let profileImg =req.body.profileImg;
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
    console.log("params: " + req.body.params);
    changeProperty(req, res, 1, newUsername, id)
});

// change Email
app.post('/api/students/changeEmail', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }

    const newEmail = req.body.newEmail;
    const id = req.tokenData.id;
    
    changeProperty(req, res, 2, newEmail, id);
});

// change phone number
app.post('/api/students/changePhone', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }
    
    const newPhone = req.body.newPhone;
    const id = req.tokenData.id;
    
    changeProperty(req, res, 3, newPhone, id);
});

// change tutor's bio info
app.post('/api/tutors/changeBio', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'T')) {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("You are not allowed to do this action!");
    }

    const newBio = req.body.newBio;
    const id = req.tokenData.id;
    
    changeProperty(req, res, 4, newBio, id);
});

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