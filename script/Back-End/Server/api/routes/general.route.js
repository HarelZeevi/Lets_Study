const express = require("express");
const db = require("./../database/general.database")
const middleware = require('./../middlewares/general.middleware')
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
    app.post('/api/students/isSignedIn', middleware.authJwt, (req, res) => controller.isSignedIn(req, res));

    // check if user is teacher
    app.get('/api/isTeacher', middleware.authJwt, (req, res) => controller.isTeacher(req, res));

    // show students
    app.get('/api/students', middleware.authJwt, (req, res) => controller.students(req, res));


    // add student - admin, returns student-code
    app.post('/api/students', middleware.authJwt, (req, res) => controller.addStudent(req, res));

    // pre registration authentication 
    app.get('/api/students/registerAuth/:id/:studentCode', (req, res) => controller.registerAuth(req, res));

    // checking wether a property (email / username / phone) is already in the users table.
    app.post('/api/students/register/propTest', (req, res) => controller.testProperty(req, res));

    // register 
    app.post('/api/students/register', (req, res) => controller.register(req, res));

    // sign in - returns student object
    app.post('/api/students/signIn', (req, res) => controller.signIn(req, res));

    // sign in fro admin - returns admin object
    app.post('/api/admins/signIn', (req, res) => controller.isSignedIn(req, res));

    // create school admin 
    app.post('/api/admins', (req, res) => controller.addAdmin(req, res));

    // look for a teacher
    app.post('/api/findTutors/', middleware.authJwt, (req, res) => controller.findTutors(req, res));


    // cancel lesson and delete it from db
    app.delete('/api/lessons/:lessonId', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const lessonId = req.params.lessonId;
        const pupilId = req.tokenData.id;
        db.cancelLesson(res, lessonId, pupilId);
    });

    // approve tutor function
    app.put('/api/approveTutor/:tutorId', middleware.authJwt, (req, res) => {
        if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.params.tutorId;
        db.approveTutor(res, tutorId);
    });

    // add lesson and shedule it
    app.post('/api/addlesson', middleware.authJwt, (req, res) => {
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
    app.post('/api/lessons/', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const studentId = req.tokenData.id;
        const utype = req.tokenData.userType;
        db.showLessons(res, studentId, utype);
    });

    // show available hours
    app.post('/api/getAvailability/', middleware.authJwt, (req, res) => {
        let tutorId;
        if (req.tokenData.userType == 'P')
            tutorId = req.body.tutorId;
        else
            tutorId = req.tokenData.id;
        console.log(tutorId);
        db.showAvailableHours(res, tutorId);
    });

    // add available date and hour to tutor's schedule
    app.post('/api/addAvailability/', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        const listTimes = req.body.listTimes;
        console.log("List times: ");
        console.log(JSON.parse(listTimes));
        db.AddAvailableTime(res, JSON.parse(listTimes), tutorId);
    });

    // remove available date and hour from tutor's schedule
    app.post('/api/deleteAvailability/', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        const calIdlist = req.body.calendarIdDelete.split(",").map(x => parseInt(x));
        console.log(calIdlist);
        db.removeAvailableTime(res, tutorId, calIdlist);
    });


    // get tutors subject1, subject2, subject3, subject4 
    app.post('/api/tutors/getTeachingSubjects', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")
        console.log("Get Subject called");
        const tutorId = req.tokenData.id;
        db.getTeachingSubjects(res, tutorId);
    });

    app.post('/api/tutors/updateTeachingSubjects', middleware.authJwt, (req, res) => {
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
    app.post('/api/tutors/UpdateTeachingSubjects/', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")
        const stSubjects = req.stSubjects;
        const subject = req.body.subject;
        const tutorId = req.tokenData.id;
        const grade = req.body.grade;
        const points = req.body.points;
        addTeachingSubjects(res, tutorId, stSubjects);
    });

    // remove teaching subject of tutor
    app.post('/api/teachingSubjects/:subject/:grade/:points', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const subject = req.params.subject;
        const tutorId = req.tokenData.id;
        const grade = req.params.grade;
        const points = req.params.points;
        removeTeachingSubjects(res, tutorId, subject, points, grade);
    });
    */

    // get tutoring hours of a specific tutor
    app.get('/api/tutoringHours/:tutorId', middleware.authJwt, (req, res) => {
        if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

        const tutorId = req.tokenData.id;
        db.getTutoringHours(res, tutorId);
    });

    // add tutoring hour to tutor
    app.post('/api/tutoringHours', middleware.authJwt, (req, res) => {
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
    app.post("/api/changePassword/", middleware.authJwt, (req, res) => {
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
    app.post('/api/rates', middleware.authJwt, (req, res) => {
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


    app.get('/api/stats/:cityid/:subject', middleware.authJwt, (req, res) => {
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
    app.post('/api/students/uploadProfileImg/', middleware.authJwt, (req, res) => {

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
    app.post('/api/students/changeUsername', middleware.authJwt, (req, res) => {
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
    app.post('/api/students/changeEmail', middleware.authJwt, (req, res) => {
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
    app.post('/api/students/changePhone', middleware.authJwt, (req, res) => {
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
    app.post('/api/tutors/changeBio', middleware.authJwt, (req, res) => {
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
    app.post('/api/getJitsiDetails', middleware.authJwt, (req, res) => controller.getJitsiDetails(req, res));

}