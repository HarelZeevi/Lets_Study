// import modules.js file
const express = require("express"); 
const Joi = require("joi");
const app = express();
const mysql = require('mysql');
app.use(express.json());

//connection to db
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"mahshevim5",
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

// modules of db
function checkResult(result, err, res)
{
    if(err)
    { 
        console.log("Error!")
        res.send("Error!");
        throw err;
    }
    else
    {
        console.log("Query was successfully executed!");
        res.send(result);

    }
}

// Register function 
function register (res, id, firstname, lastname, age, school, gender, partnergender, grade, cityid, phone, email, pswd, isaccelerated, isspecialedu, classnum )
{
    var sqlQuery = "INSERT INTO students (id, firstname, lastname, age, school, gender, partnergender, grade, cityid, phone, email, pswd, isaccelerated, isspecialedu, classnum ) VALUES ( " + mysql.escape(id) + ", " + mysql.escape(firstname) + ", " + mysql.escape(lastname) + ", " + mysql.escape(age) + ", " + mysql.escape(school) + ", " + mysql.escape(gender) + ", " + mysql.escape(partnergender) + ", " + mysql.escape(grade) + ", " + mysql.escape(cityid) + ", " + mysql.escape(phone) + ", " + mysql.escape(email) + ", " + mysql.escape(pswd) + ", " + mysql.escape(isaccelerated) + ", " + mysql.escape(isspecialedu) + ", " +mysql.escape(classnum) + ")";
    con.query(sqlQuery,  function(err, result){
        checkResult(result, err, res);
    });
}

// Sign in function
function signIn(res, id, password)
{
    var sqlQuery = `SELECT * FROM students WHERE id = ${mysql.escape(id)} AND pswd = ${mysql.escape(password)};`;
    con.query(sqlQuery,  function(err, result){
        checkResult(result, err, res);
    });
}

// look for a teacher function
function searchTeacher(res, subject, date, studentGender, tutorGender, grade1, grade2 = undefined)
{
    var sqlQuery = `SELECT subjects.studentid, students.firstName, students.lastname, students.grade, students.gender, tutors.rate, calendar.starttime, calendar.endtime
                FROM subjects 
                INNER JOIN tutors ON subjects.studentid = tutors.studentid 
                INNER JOIN students ON subjects.studentid = students.id
                INNER JOIN calendar ON subjects.studentid = calendar.studentid
                WHERE subjects.subjectname = ${mysql.escape(subject)} 
                    AND calendar.availabledate = ${mysql.escape(date)}
                    AND (students.partnergender = ${mysql.escape(studentGender)}
                        OR students.partnergender = NULL)`; // tutor's gender preferences
                

    var genderPrefs = `AND (students.gender = ${mysql.escape(tutorGender)})`; // checking that the learner wants to learn with M /F or Null
    if (tutorGender)
        sqlQuery += genderPrefs;

    // Adding grade preferences accordingly
    // sending without grades preferences

    if (grade2 == undefined && grade1 != undefined){ 
        grade2 = grade1; // repeating the same checking
    }

    var gradesPrefs = `AND (students.grade = ${mysql.escape(grade1)} OR students.grade = ${mysql.escape(grade2)})`;  

    if (grade1 == undefined) // No grade preferences
        sqlQuery += ";";
    else 
        sqlQuery += gradesPrefs + ";";

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



// register 
app.post('/api/students', (req, res) => {
    const id = req.body.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const school = req.body.school;
    const gender = req.body.gender;
    const partnergender = req.body.partnergender;
    const grade = req.body.grade;
    const cityid = req.body.cityid;
    const phone = req.body.phone;
    const email = req.body.email;
    const pswd = req.body.pswd;
    const isaccelerated = req.body.isaccelerated;
    const isspecialedu = req.body.isspecialedu;
    const classnum = req.body.classnum;

    register (res, id, firstname, lastname, age, school, gender, partnergender, grade, cityid, phone, email, pswd, isaccelerated, isspecialedu, classnum);
});

// sign in - returns student object
app.get('/api/students/:id/:password', (req, res) => {
    const id = req.params.id;
    const password = req.params.password;
    signIn(res, id, password);
});

// look for a teacher
app.get('/api/students/:subject/:date/:studentGender/:tutorGender?/:grade1?/:grade2?', (req, res) => {
    const subject = req.params.subject; // The lesson's requested subject (must pass)
    const date = req.params.date;       // The requested date of the lesson (must pass)
    const grade1 = req.params.grade1 || undefined;     //The tutor's preferred grade - 10 / 11 / 12 (optional pass)
    const grade2 = req.params.grade2 || undefined;     //The tutor's preferred grade - 10 / 11 / 12 (optional pass) 
    const studentGender = req.params.studentGender;   // The learner's gender - male or female (must pass)
    const tutorGender = req.params.tutorGender || undefined;   // The tutor's preferred gender - male or female (optional pass)

    searchTeacher(res, subject, date, studentGender, tutorGender, grade1, grade2);
});

/***PUT reqs***/
//id update
app.put('/api/students:id', (req, res) => {
    /***  Search the id and ensure it exists. else 404 will be returned.
     * validate the new id and accorindgly send 404 message if invalid.
     * else, if valid the former id will be updated.
    ***/
    const student = students.find(student => student.id == req.params.id);
    
    // if student has no value return 404
    if (!student)
    {    
        res.status(404).send("The given ID didn't match any existing student.");
        return;
    }
    // joi schema for validation
    const schema = {
        name: Joi.string().min(3).required(),
        id: Joi.string().min(9).max(9).required()
    }
    const {error} = Joi.validate(req.body, schema); // Equivilent of reult.error
    if (result.error)
    {
        res.status(400).send(result.error.details[0].message);        
        return;
    }

    // if student name can be updated


})

// reading PORT envirinment var to get an opened port
// If PORT is not set then the port var will get 3000.
const port = process.env.PORT || 1534;
app.listen(port, () => console.log(`[Listening on port ${port}]...`));