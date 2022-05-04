const express = require("express");
const db = require("./../database/general.database")
const service = require('./../services/general.service')
const validator = require('./../validations/general.validation')
const helpers = require('./../helpers/general.helpers')
const controller = require('./../controller/general.controler');
const { testProperty } = require("../middlewares/general.middleware");
const { isAbsolute } = require("path");

/* API routes*/

/* app possible methods:
    app.get(path, callback function - the called function in response)       -> getting information
    app.post()      -> adding new info
    app.put()       -> updating info
    app.delete()    -> deleting info
*/

const app = express();


// exporting routes
module.exports = (app) => {
    // define a route of get request. this route stands on the root.
    app.get('/', (req, res) => {
        res.send("Welcome to Sql Api!");
    });


    // check weather a user is logged in, if true return his name and image.
    app.post('/api/students/isSignedIn', service.authJwt, controller.isSignedIn);

    // check if user is teacher
    app.get('/api/isTeacher', service.authJwt, controller.isTeacher);

    // show students
    app.get('/api/students', service.authJwt, controller.students);


    // add student - admin, returns student-code
    app.post('/api/students', service.authJwt, controller.addStudent);

    // pre registration authentication 
    app.get('/api/students/registerAuth/:id/:studentCode', controller.registerAuth);

    // checking wether a property (email / username / phone) is already in the users table.
    app.post('/api/students/register/propTest', controller.testProperty);

    // register 
    app.post('/api/students/register', controller.register);

    // sign in - returns student object
    app.post('/api/students/signIn', controller.signIn);

    // sign in fro admin - returns admin object
    app.post('/api/admins/signIn', controller.isSignedIn);

    // create school admin 
    app.post('/api/admins', controller.addAdmin);

    // look for a teacher
    app.post('/api/findTutors/', service.authJwt, (req, res) => {
        console.log("Starting teacher");
        if (!(req.tokenData.userType === 'P')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const subjectNum = req.body.subjectNum; // The lesson's requested subject (must pass)
        const date = req.body.date; // The requested date of the lesson (must pass)
        console.log("res" + testData(date, 10));
        if (testData(date, 10) !== 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Invalid date!");
            return;
        }
        const grade1 = req.body.grade1 || undefined; //The tutor's preferred grade - 10 / 11 / 12 (optional pass)
        console.log("res" + testData(grade1, 7));
        if (testData(grade1, 7) !== 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Invalid grade!");
            return;
        }
        const grade2 = req.body.grade2 || undefined; //The tutor's preferred grade - 10 / 11 / 12 (optional pass) 
        console.log("res" + testData(grade2, 7));
        if (testData(grade2, 7) !== 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Invalid grade!");
            return;
        }
        const studentGender = req.tokenData.gender; // The learner's gender - male or female (must pass)
        console.log("res" + testData(studentGender, 8));
        if (testData(studentGender, 8) !== 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Invalid gender!");
            return;
        }
        const tutorGender = req.body.tutorGender || undefined; // The tutor's preferred gender - male or female (optional pass)
        console.log("res" + testData(tutorGender, 8));
        if (testData(tutorGender, 8) !== 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Invalid gender!");
            return;
        }
        const rate = req.body.rate;
        console.log("res" + testData(rate, 12));
        if (testData(rate, 12) !== 0) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("Invalid rate!");
            return;
        }
        console.log(subjectNum, date, studentGender, tutorGender, grade1, grade2, rate);

        const offset = req.body.offset;
        db.searchTeacher(res, subjectNum, date, studentGender, tutorGender, grade1, grade2, rate, offset);
    });


    // cancel lesson and delete it from db
    app.delete('/api/lessons/:lessonId', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const lessonId = req.params.lessonId;
        const pupilId = req.tokenData.id;
        db.cancelLesson(res, lessonId, pupilId);
    });

    // approve tutor function
    app.put('/api/approveTutor/:tutorId', service.authJwt, (req, res) => {
        if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.params.tutorId;
        db.approveTutor(res, tutorId);
    });

    // add lesson and shedule it
    app.post('/api/addlesson', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P')) return res.status(401).send("You are Not allowed to do this action.")

        const pupilId = req.tokenData.id;
        const tutorId = req.body.tutorId;
        const calendarId = req.body.calendarId;
        const subject = req.body.subject;
        const points = req.body.points;
        const grade = req.tokenData.grade;
        db.scheduleLesson(res, pupilId, tutorId, calendarId, subject, points, grade);
    });

    // show upcoming lessons of a student / tutor by its id
    app.post('/api/lessons/', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const studentId = req.tokenData.id;
        const utype = req.tokenData.userType;
        db.showLessons(res, studentId, utype);
    });

    // show available hours
    app.post('/api/getAvailability/', service.authJwt, (req, res) => {
        let tutorId;
        if (req.tokenData.userType == 'P')
            tutorId = req.body.tutorId;
        else
            tutorId = req.tokenData.id;
        console.log(tutorId);
        db.showAvailableHours(res, tutorId);
    });

    // add available date and hour to tutor's schedule
    app.post('/api/addAvailability/', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        const listTimes = req.body.listTimes;
        console.log("List times: ");
        console.log(JSON.parse(listTimes));
        db.AddAvailableTime(res, JSON.parse(listTimes), tutorId);
    });

    // remove available date and hour from tutor's schedule
    app.post('/api/deleteAvailability/', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        const calIdlist = req.body.calendarIdDelete.split(",").map(x => parseInt(x));
        console.log(calIdlist);
        db.removeAvailableTime(res, tutorId, calIdlist);
    });


    // get tutors subject1, subject2, subject3, subject4 
    app.post('/api/tutors/getTeachingSubjects', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")
        console.log("Get Subject called");
        const tutorId = req.tokenData.id;
        db.getTeachingSubjects(res, tutorId);
    });

    app.post('/api/tutors/updateTeachingSubjects', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        const subjects = req.body.subjects.split(","); // an array of 4 subject the user have chosen
        console.log(subjects);
        const subject1 = subjects[0] == "" ? null : subjects[0];
        const subject2 = subjects[1] == "" ? null : subjects[1];
        const subject3 = subjects[2] == "" ? null : subjects[2];
        const subject4 = subjects[3] == "" ? null : subjects[3];
        db.updateTeachingSubjects(res, tutorId, subject1, subject2, subject3, subject4)
    });

    // subjects are no more stored in a differnt table but in as a field of tutor
    /*
    // add taching subject to tutor
    app.post('/api/tutors/UpdateTeachingSubjects/', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")
        const stSubjects = req.stSubjects;
        const subject = req.body.subject;
        const tutorId = req.tokenData.id;
        const grade = req.body.grade;
        const points = req.body.points;
        addTeachingSubjects(res, tutorId, stSubjects);
    });

    // remove teaching subject of tutor
    app.post('/api/teachingSubjects/:subject/:grade/:points', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const subject = req.params.subject;
        const tutorId = req.tokenData.id;
        const grade = req.params.grade;
        const points = req.params.points;
        removeTeachingSubjects(res, tutorId, subject, points, grade);
    });
    */

    // get tutoring hours of a specific tutor
    app.get('/api/tutoringHours/:tutorId', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        db.getTutoringHours(res, tutorId);
    });

    // add tutoring hour to tutor
    app.post('/api/tutoringHours', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        db.addTutoringHour(res, tutorId);
    });

    // reset password using email 
    app.post('/api/sendToken/', (req, res) => {
        const email = req.body.email;
        const studentId = req.body.studentId;
        db.findStudent(email, studentId, (result) => {
            db.sendToken(res, result)
        });
    });

    // check if token is the same as sent
    app.post('/api/checkToken/', (req, res) => {
        const token = req.body.token;
        db.checkToken(token, (result) => {
            if (result[0] != null && token === result[0].token && compareTimes(result[0].expiration)) {
                db.signIn(res, result[0].id, result[0].username, result[0].pswd);
            } else {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                });
                res.end("1");
            }
        });
    });


    // change password 
    app.post("/api/changePassword/", service.authJwt, (req, res) => {
        if (req.tokenData.userType != 'P' && req.tokenData.userType != 'T') {
            return res.end("You are not allowed to do this action!");
        } else {
            const studentId = req.tokenData.id;
            const newPass = req.body.newPass;
            console.log(newPass);
            db.changePassword(res, studentId, newPass);
        }
    });

    // rate lesson
    app.post('/api/rates', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const tutorId = req.body.tutorId;
        const lessonId = req.body.lessonId;
        const rate = req.body.rate;

        db.rateLesson(res, tutorId, lessonId, rate)
    });


    app.get('/api/stats/:cityid/:subject', service.authJwt, (req, res) => {
        if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const cityid = req.params.cityid;
        const subject = req.params.subject;
        db.showStats(res, cityid, subject);
    });

    // userr account settings update below

    // upload profile image
    app.post('/api/students/uploadProfileImg/', service.authJwt, (req, res) => {

        if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }
        console.log(req.body);
        if (!req.body || Object.keys(req.body).length === 0) {
            console.log("no file");
            res.status(200).send('No files were uploaded.');
        } else {
            console.log("Starting file upload!");
            let profileImg = req.body.profileImg;
            let studentId = req.tokenData.id;
            db.uploadProfileImage(res, studentId, profileImg);
        }
    });

    // change username
    app.post('/api/students/changeUsername', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const newUsername = req.body.newUsername;
        const id = req.tokenData.id;
        console.log("params: " + req.body.params);
        db.changeProperty(req, res, 1, newUsername, id)
    });

    // change Email
    app.post('/api/students/changeEmail', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const newEmail = req.body.newEmail;
        const id = req.tokenData.id;

        db.changeProperty(req, res, 2, newEmail, id);
    });

    // change phone number
    app.post('/api/students/changePhone', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const newPhone = req.body.newPhone;
        const id = req.tokenData.id;

        db.changeProperty(req, res, 3, newPhone, id);
    });

    // change tutor's bio info
    app.post('/api/tutors/changeBio', service.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            });
            res.end("You are not allowed to do this action!");
        }

        const newBio = req.body.newBio;
        const id = req.tokenData.id;

        db.changeProperty(req, res, 4, newBio, id);
    });

    // getting jitsi room name
    app.post('/api/getJitsiDetails', service.authJwt, controller.getJitsiDetails);

}