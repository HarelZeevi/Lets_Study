// import modules.js file
const express = require("express");
require('dotenv').config()
const jwt = require("jsonwebtoken")
var fs = require('fs');
const fileUpload = require("express-fileupload");
//const Joi = require("joi");
const crypto = require("crypto");
const app = express();
const mysql = require('mysql');
const path = require('path');
const nodemailer = require('nodemailer');
const { nextTick } = require("process");
app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname + "/client/"));



//connection to db
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"1234",
    database: "lets_study_users"
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

// checking result
function checkResult(result, err, res)
{
    if(err)
    { 
        console.log(err);
        res.send("Error!");
        throw err;
    }
    else
    {
        console.log("Query was successfully executed!");
        if (Object.keys(result).length != 0)
        {
            res.send(result).status(200);
        }
        else 
        {
            console.log("not found");
            res.send("We didnt find what you are looking for...")
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
        console.log(result);
        if (Object.keys(result).length != 0)
        {
            res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
            console.log("user exists")
            res.end("User Exists!");
        }
        else 
        {
            console.log("User was Not found!");
            res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
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
                                    photo,
                                    bio,
                                    isapproved,
                                    rate,
                                    tutoringHours,
                                    pupilGender
                        )
                        VALUES
                        (
                                    ${mysql.escape(id)},
                                    null,
                                    'Hi Im ${mysql.escape(grade)}th grader',
                                    false,
                                    5,
                                    0,
                                    ${mysql.escape(pupilGender)}
                        );`;
        con.query(sqlQuery2);
    }
    const response = {studentCode: studentCode}
    checkResult(JSON.stringify(response), undefined, res);
}

// register pre-authentication using studentCode and id check
function registerAuth(res, id, studentCode)
{
    let sqlQuery = `SELECT * FROM students WHERE id = ${mysql.escape(id)} AND StudentCode = ${mysql.escape(studentCode)};`;
    con.query(sqlQuery,  function(err, result){
        checkAuth(result, err, res);
    });
}

// Register function 
function register (res, id, studentCode, fullname, username, gender, phone, email, pswd)
{
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
    con.query(sqlQuery,  function(err, result){
        checkResult(result, err, res);
    });
}

// students Sign in function
function signIn(res, id, username, password)
{  
    // creating jwt 
    var sqlQuery = `SELECT * FROM students WHERE (id = ${mysql.escape(id)} OR username = ${mysql.escape(username)}) AND pswd = ${mysql.escape(password)};`;
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
        res.send("Error!");
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
            res.json({accessToken:accessToken})
        }
        else 
        {
            console.log("not found");
            res.send("1")
        }
    }
    return result;   
}

// authenticate token function to convert token to user object
function authJwt(req, res, next)
{
    const token = req.header('x-api-key')
    if (!token) 
        return res.sendStatus(401); 
    try{
        let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.tokenData = decodeToken;
        next();
    }
    catch (err){ 
        console.log(err);
        res.sendStatus(401);
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
        checkResult(result, err, res);
    });
}

// look for a teacher function
function searchTeacher(res, subject, date, studentGender, tutorGender, grade1, grade2 = undefined, rate)
{
    var sqlQuery = `SELECT subjects.studentid, subjects.subjectname, subjects.points, students.fullname, students.grade, students.gender, tutors.rate, tutors.pupilGender, calendar.starttime, calendar.endtime
                    FROM subjects 
                    INNER JOIN tutors ON subjects.studentid = tutors.studentid 
                    INNER JOIN students ON subjects.studentid = students.id
                    INNER JOIN calendar ON subjects.studentid = calendar.studentid
                    WHERE subjects.subjectname = ${mysql.escape(subject)}
                        AND calendar.availabledate = ${mysql.escape(date)}
                        AND tutors.isapproved = 1
                        AND (tutors.pupilGender = ${mysql.escape(studentGender)}
                            OR tutors.pupilGender = NULL)
                        AND (tutors.rate >= ${mysql.escape(parseInt(rate))})`; 
    
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
            checkResult(result, err, res);
        });
}

// show available hours of tutor 
function showAvailableHours(res, tutorId)
{
    var sqlQuery = `SELECT * FROM calendar
                    INNER JOIN tutors ON tutors.studentid = calendar.studentid
                    WHERE calendar.studentId = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery,  function(err, result){
        checkResult(result, err, res);
    });
}

// delete a lesson from db by its id
function cancelLesson(res, lessonId, pupilId)
{ 
    var sqlQuery = `DELETE FROM lessons WHERE id = ${mysql.escape(lessonId)} AND pupilid = ${mysql.escape(pupilId)};`;  // delete the lesson itself
    con.query(sqlQuery,  function(err, result){
        checkResult(result, err, res);
    });
}

// show students
function showStudents(res)
{
    con.query("SELECT * FROM students", function(err, result){
        checkResult(result, err, res);
    });
}

// schedule and add lesson to database
function scheduleLesson(res, pupilId, tutorId, calendarId, subject, points, grade)
{
    const room = "LetsStudy/" + subject + "/" +  generateStudentCode(11);
    var sqlQuery = `INSERT INTO lessons(pupilId, tutorId, tutorcalid, subjectName, points, grade, tookplace, room) VALUES ( ${mysql.escape(pupilId)},  ${mysql.escape(tutorId)},  ${mysql.escape(calendarId)}, ${mysql.escape(subject)},${mysql.escape(points)}, ${mysql.escape(grade)}, 0, ${mysql.escape(room)})`;
    con.query(sqlQuery,function(err, result){
                checkResult(result, err, res);
    });
}

// show all the future lessons of a student
function showLessons(res, studentid)
{
    var sqlQuery = `SELECT * FROM lessons WHERE (pupilid = ${mysql.escape(studentid)} OR tutorid = ${mysql.escape(studentid)});`;
    con.query(sqlQuery,function(err, result){
        checkResult(result, err, res);
    });
}


// show statistical info about precentage of specific subject tutors out of all of the students
function showStats(res, cityid, subject)
{
    var students = 1;
    con.query(`SELECT COUNT(*) FROM students WHERE cityid = ${mysql.escape(cityid)};`, function(err, result){
        students = checkResult(result, err, res);
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
        checkResult(result, err, res);
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
        checkResult(result, err, res);
    });
}

// remove a calendar record from the calendar table that contains an availability schedule of the tutor for a specific day
function removeAvailableTime(res, calId)
{
    var sqlQuery = `DELETE FROM calendar WHERE id =  ${mysql.escape(calId)}`;
    con.query(sqlQuery, function(err, result){
        checkResult(result, err, res);
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
        checkResult(result, err, res);
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
        checkResult(result, err, res);
    });
}

// get the amount ogf tutoring hours of a specific tutor
function getTutoringHours(res, tutorId){
    sqlQuery = `SELECT tutoringHours FROM tutors WHERE studentid = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery, function(err, result){
        checkResult(result, err, res);
    });
}

// add a tutoring hour to a tutor after the lesson have been made
function addTutoringHour(res, tutorId){
    sqlQuery = `UPDATE tutors SET tutoringHours = (tutoringHours + 1) WHERE studentId = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery, function(err, result){
        checkResult(result, err, res);
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
    if (result[0] === undefined) // User couldn't be found by email or id
    {
        return res.send("email or id don't exist in students table");
    }
    var email = result[0].email;
    console.log(email);
    var studentId = result[0].id;
    crypto.randomBytes(48, (err, buffer)=>{
        if (err)
        {
            console.log(err);
            res.send(errr);
        }
        var token = buffer.toString("hex");
        const smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "letstudybuisness@gmail.com",
                pass: "BnaYSbHgFFLxL7"
            }
        });

        var mailOptions = {
            from: "letstudybuisness@gmail.com",
            to: email,
            subject: 'Password Change Token',
            html: `:Please use this token to reset your password<br><b>${token}</b>`
        };
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                res.send(error);
            }
            else{
                //res.redirect('/');
                let expiration = new Date(); // current time
                expiration.setTime(expiration.getTime() + 5 * 60 * 1000); // adding 5 min to expiration
                sqlQuery = `UPDATE students SET token = ${mysql.escape(token)}, expiration = ${mysql.escape(expiration)} WHERE id = ${mysql.escape(studentId)};`;
                console.log("[EMAIL SENT!]");
                con.query(sqlQuery, function(err, result){checkResult(result, err, res)}); 
            }
        });
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
    sqlQuery = `SELECT id, token, expiration FROM students WHERE token = ${mysql.escape(token)};`;
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
function changePassword(res, studentId, pass, confirmPass)
{
    if (!(confirmPass === pass))
    {
        return res.send("Not matching Passwords!");
    }
    sqlQuery = `UPDATE students set pswd = ${mysql.escape(newPass)} WHERE id = ${mysql.escape(studentId)};`;
    con.query(sqlQuery, function(err, result){
        checkResult(result, err, res);
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
        checkResult(result, err, res);
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
    callback(response.body);
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
                    if (JSON.parse(status).Result === true)
                    {
                        console.log(status.Result);
                        res.send("Your profile image hasn't been uploaded because it was marked as inappropriate!");
                    }
                    else   
                    {
                        console.log(status)
                        console.log("Image approved!");
                        let sqlQuery = `UPDATE tutors SET photo = LOAD_FILE(${mysql.escape(uploadPath)}) WHERE studentid = ${mysql.escape(studentId)};`;
                        con.query(sqlQuery, function(err, result){
                            checkResult(result, err, res);
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
        checkResult(result, err, res);
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



// show students
app.get('/api/students', (req, res) =>{
    showStudents(res);
});


// add student - admin 
// returns student-code
app.post('/api/students', authJwt, (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.send("You are Not allowed to do this action.")
    
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



// register 
app.put('/api/students/register', (req, res) => {
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
app.get('/api/tutors/:subject/:date/:studentGender/:rate/:tutorGender?/:grade1?/:grade2?', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P')) return res.send("You are Not allowed to do this action.") 

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
    console.log(email);
    console.log(studentId);
    findStudent(email, studentId, (result) => {sendToken(res, result)});
});
 
// check if token is the same as sent
app.post('/api/checkToken/', (req, res) => {
    const token = req.body.token;
    checkToken(token, (result) => {
        if (token === result[0].token && compareTimes(result[0].expiration))
            res.send(result[0].id);
        else    
            res.send("Tokens don't match / time is up");
    });
});

// change the password
app.post('/api/resetPassword/', (req, res) => {
    const studentId = req.body.studentId;
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    resetPassword(res, studentId, token, password, confirmPassword, function(result){
        if (confirmPassword === password &&
            compareTimes(result.expiration))
        {
            changePassword(res, studentId, password)
        }
        else
        {
            res.send(`We couldn't reset your password. Please check again:
                        \n\t1. if the expiration time hasn't passed.
                        \n\t2. if the token you entered is the token that have been emailed to you. `);
        }
    });
});

// change password 
app.put("/api/changePassword/", authJwt, (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.send("You are Not allowed to do this action.")
    
    const studentId = req.tokenData.id;
    const newPass = req.body.newPass;
    
    changePassword(res, studentId, newPass);
});

// rate lesson
app.post('/api/rates', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P')) return res.send("You are Not allowed to do this action.")

    const tutorId = req.body.tutorId;
    const lessonId = req.body.lessonId;
    const rate = req.body.rate;
    
    rateLesson(res, tutorId, lessonId, rate)
});

/////***** add your route here ******/////////
app.get('/api/stats/:cityid/:subject', (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.send("You are Not allowed to do this action.")
    
    const cityid = req.params.cityid;
    const subject = req.params.subject;
    showStats(res, cityid, subject);
});

// upload profile image
app.post('/api/students/uploadProfileImg/', authJwt, (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) return res.send("You are Not allowed to do this action.")
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
    }
    else 
    {
        let profileImg = req.files.profileImg;
        let studentId = req.tokenData.id;
        uploadProfileImage(res, studentId, profileImg);    
    }
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