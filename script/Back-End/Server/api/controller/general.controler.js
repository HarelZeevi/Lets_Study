const db = require('./../database/general.database')

const getJitsiDetails = (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("You are not allowed to do this action!");
    }
    const lessonId = req.body.lessonId;
    const isTeacher = req.tokenData.isTeacher;
    db.getJitsiDetails(res, lessonId, isTeacher)
}


const controller = (req, res) => {
    const username = undefined || req.tokenData.username;
    var profile_img = "";
    const isTeacher = req.tokenData.isTeacher;
    db.get_profile_img(req.tokenData.id, function (extension) {
        const phone = undefined || req.tokenData.phone;
        const email = undefined || req.tokenData.email;

        base64Data = helpers.base64Img(req.tokenData.id, extension)
        if (base64Data != null) {
            if (base64Data.indexOf("dataimage/") == -1)
                base64Data = `data:image/${extension.replace(".", "")};base64,` + helpers.base64Img(req.tokenData.id, extension)
            else
                base64Data = base64Data.replace("dataimage/", "data:image/").replace("base64", ";base64,");
        }
        const navbarData = {
            username: username,
            isTeacher: isTeacher,
            profile_img: base64Data,
            phone: phone,
            email: email
        };

        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end(JSON.stringify(navbarData));
    })
}


const isTeahcer = (req, res) => {
    let isTeacher = false;
    if (req.tokenData.userType == 'T')
        isTeacher = true;
    res.send({
        "isTeacher": isTeacher
    });
}


const students = (req, res) => {
    db.showStudents(res);
}

const addStudent = (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("You are not allowed to do this action!");
    }

    // add student code
    const id = req.body.id; // admin enters info and the validation on the student's side
    const school = req.tokenData.school; // automatically entered by admin's school
    const grade = req.body.grade; // admin enters info
    const classnum = req.body.classnum; // admin enters info
    const pupilGender = req.body.pupilGender || undefined; // admin enters info

    console.log("res" + validator.testData(id, 5));
    if (testData(id, 5) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid input!");
        return;
    }

    db.addStudent(res, id, school, grade, classnum, pupilGender);
}


const registerAuth = (req, res) => {
    const id = req.params.id;
    const studentCode = req.params.studentCode;

    if (testData(id, 5) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid id!");
        return;
    }

    db.registerAuth(res, id, studentCode);
}


const testProperty = (req, res) => {
    const prop = req.body.property;
    const name = req.body.name;
    db.testProperty(res, prop, name);
}


const register = (req, res) => {
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

    db.register(res, id, studentCode, fullname, username, gender, phone, email, pswd);
}

const isSignedIn = (req, res) => {
    const id = req.body.id;
    const password = req.body.password;

    console.log("id: " + id + " password: " + password);
    db.signInAdmin(res, id, password);
}

const addAdmin = (req, res) => {
    // add student code
    const id = req.body.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const pswd = req.body.pswd;
    const school = req.body.school;
    const phone = req.body.phone;
    const email = req.body.email;

    db.createAdmin(res, id, firstname, lastname, pswd, school, phone, email);
}