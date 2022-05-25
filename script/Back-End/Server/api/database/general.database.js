const nodemailer = require('nodemailer');
const mysql = require('mysql');
const con = require('./connect.database')
const helpers = require('./../helpers/general.helpers')
const service = require('./../services/general.service')
const bcrypt = require('bcrypt');


// add student to database
function addStudent(res, id, school, grade, classnum, pupilGender) {
    const studentCode = generateStudentCode(5);
    if (grade >= 10) {
        userType = "T"; // tutor
    } else userType = "P"; // pupil

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
    if (userType === "T") {
        // if tutor
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
                                      'Hi Im ${parseInt(
                                        mysql.escape(grade)
                                      )}th grader',
                                      0,
                                      5,
                                      0,
                                      ${mysql.escape(pupilGender)}
                          );`;
        con.query(sqlQuery2);
    }
    const response = {
        studentCode: studentCode,
    };
    service.getResultObject(JSON.stringify(response), undefined, res);
}


// register pre-authentication using studentCode and id check
function registerAuth(res, id, studentCode) {
    let sqlQuery = `SELECT * FROM students WHERE id = ${mysql.escape(
      id
    )} AND StudentCode = ${mysql.escape(studentCode)};`;
    con.query(sqlQuery, function (err, result) {
        service.checkAuth(result, err, res);
    });
}


// register middleware testing
function testProperty(res, prop, name) {
    let checkQuery;
    if (prop === "1")
        checkQuery = `SELECT * FROM students WHERE username = ${mysql.escape(
        name
      )};`;
    else if (prop === "2")
        checkQuery = `SELECT * FROM students WHERE email = ${mysql.escape(name)};`;
    else if (prop === "3")
        checkQuery = `SELECT * FROM students WHERE phone = ${mysql.escape(name)};`;
    if (checkQuery === undefined) {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        return res.end("Invalid property number!");
    }
    con.query(checkQuery, function (err, result) {
        checkPropTest(result, err, res);
    });
}

// Register function
function register(res, id, studentCode, fullname, username, gender, phone, email, pswd) {
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
                              email =  ${mysql.escape(email)}
                          WHERE 
                              id = ${mysql.escape(id)} AND
                              StudentCode = ${mysql.escape(studentCode)};`;
    console.log(sqlQuery);
    con.query(sqlQuery, function (err, result) {

        const resultObj = result;
        const registerErr = err;

        setPassword(id, pswd, (result, err) => {
            // callback 
            if (err) {
                service.checkActionDone(result, err, res)
            } else {
                service.checkSignUp(resultObj, registerErr, res, id, username, pswd);
            }
        });

    });
    //}
}

// students Sign in function
function signIn(res, id, username, password) {
    // creating jwt
    var sqlQuery1 = `SELECT id, userType, fullname, username, pswd, school, gender, grade, phone, email, classnum
                      FROM students 
                      WHERE (id = ${mysql.escape(id)}
                      OR username = ${mysql.escape(username)})`;

    con.query(sqlQuery1, (err, result) => {

        if (err || Object.keys(result).length === 0) // error / user was not found
            service.checkActionDone(result, err, res);

        // valid user was found and it matches the given username 
        else {
            // compare the hash on the db with the given password
            const hash = result[0].pswd;
            const resultObj = result;

            bcrypt.compare(password, hash, (err, result) => {
                service.signJwt(result, resultObj, err, res);
            });
        }

    });
}


// Admin sign in function
function signInAdmin(res, id, password) {
    var sqlQuery = `SELECT * FROM admins WHERE id = ${mysql.escape(
      id
    )} AND pswd = ${mysql.escape(password)};`;
    con.query(sqlQuery, function (err, result) {
        service.signJwt(result, err, res);
    });
}

// Admin creation function
function createAdmin(res, id, firstname, lastname, pswd, school, phone, email) {
    var sqlQuery = `INSERT INTO admins
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
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// look for a teacher function.
function searchTeacher(
    res,
    subjectNum,
    date,
    studentGender,
    tutorGender,
    grade1,
    grade2 = undefined,
    rate,
    offset
) {
    var sqlQuery = `SELECT distinct tutors.studentid, tutors.subject1, tutors.subject2, tutors.subject3, tutors.subject4, students.fullname, tutors.bio, students.imgFileExt, students.grade, students.gender, tutors.rate, tutors.pupilGender
                      FROM tutors 
                      INNER JOIN students ON tutors.studentid = students.id
                      INNER JOIN calendar ON tutors.studentid = calendar.studentid
              
                      WHERE (tutors.subject1 = ${mysql.escape(subjectNum)} OR
                             tutors.subject2 = ${mysql.escape(subjectNum)} OR
                             tutors.subject3 = ${mysql.escape(subjectNum)} OR
                             tutors.subject4 = ${mysql.escape(subjectNum)})
                          AND calendar.availabledate = ${mysql.escape(date)}
                          AND tutors.isapproved = 1
                          AND (tutors.pupilGender = ${mysql.escape(studentGender)}
                              OR tutors.pupilGender IS NULL)
                          AND (tutors.rate >= ${mysql.escape(parseInt(rate))})`;


    // student's gender preferences
    if (tutorGender != "null")
        sqlQuery += ` AND (students.gender = ${mysql.escape(tutorGender)})`;

    // Adding grade preferences accordingly
    // sending without grades preferences
    if (grade1 != "null" || grade2 != "null") {
        if (grade2 == "null" && grade1 != "null") {
            grade2 = grade1; // repeating the same checking
        }
        var gradesPrefs = ` AND (students.grade = ${mysql.escape(grade1)}
                            OR students.grade = ${mysql.escape(grade2)})`
        sqlQuery += gradesPrefs;
    }

    console.log("sql query: " + sqlQuery);
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// show available hours of tutor
function showAvailableHours(res, tutorId) {
    console.log(tutorId);
    var sqlQuery = `SELECT id, studentid, availabledate, starttime, endtime FROM calendar
                      WHERE calendar.studentId = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// delete a lesson from db by its id
function cancelLesson(res, lessonId, pupilId) {
    var sqlQuery = `DELETE FROM lessons WHERE id = ${mysql.escape(
      lessonId
    )} AND pupilid = ${mysql.escape(pupilId)};`; // delete the lesson itself
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}


// show students
function showStudents(res) {
    con.query("SELECT * FROM students", function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// schedule and add lesson to database
function scheduleLesson(
    res,
    pupilId,
    tutorId,
    calendarId,
    subject,
    points,
    grade
) {
    const room = "LetsStudy/" + subject + "/" + generateStudentCode(11);
    var sqlQuery = `INSERT INTO lessons(pupilId, tutorId, tutorcalid, points, grade, tookPlace, room, roomPswd, subjectNum) VALUES 
                      ( ${mysql.escape(pupilId)},  ${mysql.escape(
      tutorId
    )},  ${mysql.escape(calendarId)}, ${mysql.escape(points)}, ${mysql.escape(
      grade
    )}, 0, ${mysql.escape(room)}, ${generateStudentCode(5)}, ${mysql.escape(
      subject
    )})`;
    con.query(sqlQuery, function (err, result) {
        service.checkActionDone(result, err, res);
    });
}


// show all the future lessons of a student
function showLessons(res, studentid, utype) {
    var sqlQuery = `SELECT 	lessons.id, 
                              students.fullname,
                              lessons.pupilid, 
                              lessons.tutorid, 
                              lessons.tutorcalid, 
                              calendar.availabledate, 
                              calendar.starttime, 
                              calendar.endtime, 
                              lessons.subjectNum, 
                              lessons.points, 
                              lessons.grade
                      FROM lessons
                      INNER JOIN calendar ON lessons.tutorcalid  = calendar.id`;
    if (utype === "P")
        sqlQuery += `\n INNER JOIN students ON lessons.tutorid = students.id`;
    else sqlQuery += `\n INNER JOIN students ON lessons.pupilid = students.id`;

    sqlQuery += `\n WHERE (pupilid = ${mysql.escape(
      studentid
    )} OR tutorid = ${mysql.escape(studentid)});`;
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// show statistical info about precentage of specific subject tutors out of all of the students
function showStats(res, cityid, subject) {
    var students = 1;
    con.query(
        `SELECT COUNT(*) FROM students WHERE cityid = ${mysql.escape(cityid)};`,
        function (err, result) {
            students = service.getResultObject(result, err, res);
            con.query();
        }
    );
    //console.log(students);
    /*
      var totalStdents = getnumberofstudentsincity(city);
      var studentsPerSubject=getnumberofstudentsofrequiredlessonincity(city, subject);
      var percentage = (numofstudentsofrequiredlesson * 100) / numofstudents;
      return percentage;
      */
}

// approve tutor
function approveTutor(res, studentId) {
    con.query(
        `UPDATE tutors SET  tutors.isapproved = 1 WHERE studentid = ${mysql.escape(
        studentId
      )};`,
        function (err, result) {
            service.getResultObject(result, err, res);
        }
    );
}

// add a calendar record to the calendar table that contains an availability schedule of the tutor for a specific day
async function AddAvailableTime(res, listTimes, tutorId) {
    for (let i = 0; i < listTimes.length; i++) {
        let timeObj = listTimes[i];
        let availableDate = timeObj.availableDate;
        let starttime = timeObj.startTime;
        let endtime = timeObj.endTime;
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
                      );`;
        console.log(
            tutorId + ", " + availableDate + ", " + starttime + ", " + endtime
        );
        const query = new Promise((resolve, reject) => {
            con.query(sqlQuery, async (err, result) => {
                service.checkError(result, err, res, resolve, reject);
            });
        });

        await query.then((resolve) => {
            console.log("Query res: " + resolve);
            console.log("check Header sent: " + res.headersSent);
            if (resolve != null) {
                res.writeHead(200, {
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                });
                res.end(resolve);
            }
        });
    }

    console.log("Header sent: " + res.headersSent);
    if (!res.headersSent) {
        // if no error has been raised during the update availablilty
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        res.end("Done successfully!");
    }
}

// remove a calendar record from the calendar table that contains an availability schedule of the tutor for a specific day
async function removeAvailableTime(res, tutorId, calIdlist) {
    for (let i = 0; i < calIdlist.length; i++) {
        calId = calIdlist[i];
        var sqlQuery = `DELETE FROM calendar WHERE studentId = ${mysql.escape(
        tutorId
      )} AND id =  ${mysql.escape(calId)}`;
        const query = new Promise((resolve, reject) => {
            con.query(sqlQuery, async (err, result) => {
                service.checkError(result, err, res, resolve, reject);
            });
        });
        await query.then((resolve) => {
            console.log("Query res: " + resolve);
            console.log("check Header sent: " + res.headersSent);
            if (resolve != null) {
                res.writeHead(200, {
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                });
                res.end(resolve);
            }
        });
    }
    console.log("Header sent: " + res.headersSent);
    if (!res.headersSent) {
        // if no error has been raised during the update availablilty
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        res.end("Done successfully!");
    }
}

// get all of the teaching subjects of a specific tutor
function getTeachingSubjects(res, tutorId) {
    var sqlQuery = `SELECT subject1, subject2, subject3, subject4 
                      FROM tutors 
                      WHERE studentId =${mysql.escape(tutorId)};`;

    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// update tutor's teaching subjects
// get all of the teaching subjects of a specific tutor
function updateTeachingSubjects(
    res,
    tutorId,
    subject1,
    subject2,
    subject3,
    subject4
) {
    var sqlQuery = `UPDATE tutors 
                      SET  
                      subject1 = ${mysql.escape(subject1)},
                      subject2 = ${mysql.escape(subject2)},
                      subject3 = ${mysql.escape(subject3)},
                      subject4 = ${mysql.escape(subject4)}
                      WHERE studentId = ${mysql.escape(tutorId)};`;

    con.query(sqlQuery, function (err, result) {
        service.checkActionDone(result, err, res);
    });
}
// no more needed because tutor has 4 subjects
/*
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
        service.getResultObject(result, err, res);
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
        service.getResultObject(result, err, res);
    });
}
*/

// get the amount ogf tutoring hours of a specific tutor
function getTutoringHours(res, tutorId) {
    sqlQuery = `SELECT tutoringHours FROM tutors WHERE studentid = ${mysql.escape(
      tutorId
    )};`;
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}

// add a tutoring hour to a tutor after the lesson have been made
function addTutoringHour(res, tutorId) {
    sqlQuery = `UPDATE tutors SET tutoringHours = (tutoringHours + 1) WHERE studentId = ${mysql.escape(
      tutorId
    )};`;
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}


var fs = require('fs');

// function for sending a string token generated to the user.
// function for finding student by its id / email in order to send him token
function findStudent(email, studentId, callback) {
    sqlQuery = `SELECT * FROM students WHERE email = ${mysql.escape(
      email
    )} OR id = ${mysql.escape(studentId)};`;
    con.query(sqlQuery, function (err, result) {
        if (err) throw err;
        return callback(result);
    });
}

function sendToken(res, result) {
    console.log(result[0] == null);

    if (result[0] == null) // User couldn't be found by email or id
    {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
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
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: "letstudybuisness@gmail.com",
        to: email,
        subject: 'Password Change Token',
        html: `:Please use this token to reset your password<br><b>${token}</b>`
    };
    smtpTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error")
            console.log(error);
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end(error);
        } else {
            //res.redirect('/');
            let expiration = new Date(); // current time
            expiration.setTime(expiration.getTime() + 5 * 60 * 1000); // adding 5 min to expiration
            sqlQuery = `UPDATE students SET token = ${mysql.escape(token)}, expiration = ${mysql.escape(expiration)} WHERE id = ${mysql.escape(studentId)};`;
            console.log('Email sent: ' + info.response);
            con.query(sqlQuery, function (err, result) {
                service.getResultObject(result, err, res)
            });
        }
    });
    res.end("Email was not found!");
    return;
}

// this function gets property number, new value for the property and user's id.
// the function will run an sql query that changes the property's old value to the new value.
function changeProperty(req, res, propNum, val, id) {
    let sqlQuery = `UPDATE students SET username = ${mysql.escape(
      val
    )} WHERE id = ${mysql.escape(id)};`;
    switch (propNum) {
        case 1: // change username
            break;
        case 2: // change Email
            sqlQuery = `UPDATE students SET email = ${mysql.escape(
          val
        )} WHERE id = ${mysql.escape(id)};`;
            break;
        case 3: // change phone number
            sqlQuery = `UPDATE students SET phone = ${mysql.escape(
          val
        )} WHERE id = ${mysql.escape(id)};`;
            break;
        case 4: // change tutor's bio information
            sqlQuery = `UPDATE tutors SET bio = ${mysql.escape(
          val
        )} WHERE studentid = ${mysql.escape(id)};`;
    }

    console.log(sqlQuery);
    con.query(sqlQuery, function (err, result) {
        //service.checkActionDone(result, err, res);
    });
    console.log(req.tokenData);
    console.log(val);
    if (propNum == 1) signIn(res, id, undefined, req.tokenData.pswd);
    else signIn(res, id, undefined, req.tokenData.pswd);
}

function checkToken(token, callback) {
    sqlQuery = `SELECT * FROM students WHERE token = ${mysql.escape(token)};`;
    con.query(sqlQuery, (err, result) => {
        if (err) {
            throw err;
        }
        return callback(result);
    });
}

// password change using confirm password and password. uses:
//    1. logged in
//    2. reset password after token authentication

// has a callback - fits to register 
function changePassword(studentId, newPass, callback) {


    const saltRounds = 10;
    bcrypt.hash(newPass, saltRounds, (err, hash) => {
        sqlQuery = `UPDATE students set pswd = ${mysql.escape(hash)} 
                    WHERE id = ${mysql.escape(studentId)};`;
        
        console.log(sqlQuery);
        con.query(sqlQuery, function (err, result) {
            callback(err, result)
        });
    });
}

// no callback - only for changing password
function setPassword(res, studentId, newPass) {
    sqlQuery = `UPDATE students set pswd = ${mysql.escape(
      newPass
    )} WHERE id = ${mysql.escape(studentId)};`;
    console.log(sqlQuery);
    con.query(sqlQuery, function (err, result) {
        service.checkActionDone(result, err, res);
    });
}

// rate lesson
function rateLesson(res, tutorId, lessonId, rate) {
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
      );`;
    // define avg var
    sqlQuery2 = `SELECT @avg_rate := AVG(rates.rate) FROM rates WHERE rates.tutorid = ${mysql.escape(
      tutorId
    )}`;

    //insert avg into general rate of tutor
    sqlQuery3 = `UPDATE tutors
      SET tutors.rate = @avg_rate
      WHERE tutors.studentid = ${mysql.escape(tutorId)};`;
    con.query(sqlQuery1, function (err, result) {});
    con.query(sqlQuery2, function (err, result) {});
    con.query(sqlQuery3, function (err, result) {
        service.getResultObject(result, err, res);
    });
}


// this function returns base64 image of student
function get_profile_img(id, callback) {
    var sql = `SELECT imgFileExt FROM students WHERE id = ${mysql.escape(id)}`;

    con.query(sql, function (err, results) {
        if (err) {
            throw err;
        } else {
            callback(results[0].imgFileExt);
        }
    });
}



// image profile upload
function uploadProfileImage(res, studentId, profileImg) {
    let uploadPath =
        "C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/profileImages/" + studentId;
    var imgType;
    console.log("is png: " + profileImg.match("png"));
    if (profileImg.match("jpg")) {
        console.log("jpg");
        var base64Data = profileImg.replace("data:image/jpg;base64,", "");
        require("fs").writeFile(
            uploadPath + ".jpg",
            base64Data,
            "base64",
            function (err) {
                console.log("jpg");
            }
        );
        imgType = ".jpg";
    } else if (profileImg.match("png")) {
        console.log("jpg");
        var base64Data = profileImg.replace("data:image/png;base64,", "");
        require("fs").writeFile(
            uploadPath + ".png",
            base64Data,
            "base64",
            function (err) {
                console.log("jpg");
            }
        );
        imgType = ".png";
    } else if (profileImg.match("jpeg")) {
        var base64Data = profileImg.replace("data:image/jpeg;base64,", "");
        require("fs").writeFile(
            uploadPath + ".jpeg",
            base64Data,
            "base64",
            function (err) {
                console.log("jpeg");
            }
        );
        imgType = ".jpeg";
    } else {
        message =
            "This format is not allowed , please upload file with '.png' / '.jpg'";
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        res.end(message);
        return;
    }

    uploadPath += imgType;

    status = helpers.moderator(uploadPath, (status) => {
        if (false && JSON.parse(status).Result === true) {
            console.log(status.Result);
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "http://localhost:3000",
            });
            res.end(
                "Your profile image hasn't been uploaded because it was marked as inappropriate!"
            );
        } else {
            console.log(uploadPath);
            console.log("Image approved!");
            let sqlQuery = `UPDATE students SET imgFileExt = ${mysql.escape(
          imgType
        )} WHERE id = ${mysql.escape(studentId)};`;
            console.log(sqlQuery);
            con.query(sqlQuery, function (err, result) {
                service.getResultObject(result, err, res);
            });
        }
    });
}

// function for getting jitsi room name by lesson id
function getJitsiDetails(res, lessonId, isTeacher) {
    console.log("Fetching jitsi details");
    console.log("Lesson Id: " + lessonId);
    let sqlQuery;
    if (isTeacher)
        sqlQuery = `SELECT lessons.room, lessons.roomPswd, students.fullname 
                      FROM lessons
                      INNER JOIN students ON lessons.tutorid = students.id
                      WHERE lessons.id = ${mysql.escape(lessonId)}`;
    else
        sqlQuery = `SELECT lessons.room, lessons.roomPswd, students.fullname 
                      FROM lessons
                      INNER JOIN students ON lessons.pupilid = students.id
                      WHERE lessons.id = ${mysql.escape(lessonId)}`;
    con.query(sqlQuery, function (err, result) {
        service.getResultObject(result, err, res);
    });
}


module.exports = {
    addStudent,
    registerAuth,
    testProperty,
    register,
    signIn,
    signInAdmin,
    createAdmin,
    searchTeacher,
    showAvailableHours,
    cancelLesson,
    showStudents,
    scheduleLesson,
    showLessons,
    showStats,
    approveTutor,
    AddAvailableTime,
    removeAvailableTime,
    getTeachingSubjects,
    updateTeachingSubjects,
    getTutoringHours,
    addTutoringHour,
    findStudent,
    sendToken,
    changeProperty,
    checkToken,
    changePassword,
    rateLesson,
    get_profile_img,
    uploadProfileImage,
    getJitsiDetails
}