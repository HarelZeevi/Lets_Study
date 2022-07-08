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
    app.delete('/api/lessons/:lessonId', middleware.authJwt, (req, res) => controller.deletelesson(req, res));

    // approve tutor function
    app.put('/api/approveTutor/:tutorId', middleware.authJwt, (req, res) => controller.approveTutor(req, res));

    // add lesson and shedule it
    app.post('/api/addlesson', middleware.authJwt, (req, res) =>controller.addLesson(req, res));

    // show upcoming lessons of a student / tutor by its id
    app.post('/api/lessons/', middleware.authJwt, (req, res) =>controller.showLesson(req, res));
    // show available hours
    app.post('/api/getAvailability/', middleware.authJwt, (req, res) => controller.getAvailability(req, res));

    // add available date and hour to tutor's schedule
    app.post('/api/addAvailability/', middleware.authJwt, (req, res) =>controller.addAvailability(req, res));

    // remove available date and hour from tutor's schedule
    app.post('/api/deleteAvailability/', middleware.authJwt, (req, res) =>controller.deleteAvailability(req, res));



    // get tutors subject1, subject2, subject3, subject4 
    app.post('/api/tutors/getTeachingSubjects', middleware.authJwt, (req, res) =>controller.getTeachingSubjects(req, res));

    app.post('/api/tutors/updateTeachingSubjects', middleware.authJwt, (req, res) =>controller.updateTeachingSubjects(req, res));

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
    app.get('/api/tutoringHours/:tutorId', middleware.authJwt, (req, res) => controller.getTutoringHours(req, res));

    // add tutoring hour to tutor
    app.post('/api/tutoringHours', middleware.authJwt, (req, res) => controller.addTutoringHour(req, res));

    // reset password using email 
    app.post('/api/sendToken/', (req, res) =>controller.resetPassword(req, res));

    // check if token is the same as sent
    app.post('/api/checkToken/', (req, res) => controller.checkToken(req, res)); 


    // change password 
    app.post("/api/changePassword/", middleware.authJwt, (req, res) => controller.changePassword(req, res));

    // rate lesson
    app.post('/api/rates', middleware.authJwt, (req, res) => controller.rates(req, res)); 



    app.get('/api/stats/:cityid/:subject', middleware.authJwt, (req, res) => controller.showStats(req, res));

    // userr account settings update below

    // upload profile image
    app.post('/api/students/uploadProfileImg/', middleware.authJwt, (req, res) => controller.uploadProfileImg(req, res));

    // change username
    app.post('/api/students/changeUsername', middleware.authJwt, (req, res) => controller.changeUsername(req, res)); 

    // change Email
    app.post('/api/students/changeEmail', middleware.authJwt, (req, res) =>controller.changeEmail(req, res)); 

    // change phone number
    app.post('/api/students/changePhone', middleware.authJwt, (req, res) => controller.changePhone(req, res)); 

    // change tutor's bio info
    app.post('/api/tutors/changeBio', middleware.authJwt, (req, res) => controller.changeBio(req, res));

    // getting jitsi room name
    app.post('/api/getJitsiDetails', middleware.authJwt, (req, res) => controller.getJitsiDetails(req, res));

}