const db = require('./../database/general.database')
const helpers = require('./../helpers/general.helpers')
const validator = require('./../validations/general.validation')

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

// students Sign in function
const signIn = (req, res) => {
    const id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;
    if (false && (validator.testData(password, 2) !== 0 || validator.testData(id, 5) !== 0)) {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        res.end("Invalid Username!");
        return;
    }
    db.signIn(res, id, username, password);
}

const isSignedIn = (req, res) => {
    console.log(req.username)
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


const isTeacher = (req, res) => {
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

    console.log("res" + validator.validator.testData(id, 5));
    if (validator.testData(id, 5) !== 0) {
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

    if (validator.testData(id, 5) !== 0) {
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

    /*if(validator.testData(username, 3) !== 0 ||
       validator.testData(fullname, 1) !== 0 || 
       validator.testData(id, 5) !== 0 ||
       validator.testData(phone, 4) !== 0 ||
       validator.testData(email, 6) !== 0)
    {
        res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:3000'});
        res.end("Invalid input!");
        return;
    } */

    db.register(res, id, studentCode, fullname, username, gender, phone, email, pswd);
}

const signInAdmin = (req, res) => {
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



const deletelesson = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const lessonId = req.params.lessonId;
    const pupilId = req.tokenData.id;
    db.cancelLesson(res, lessonId, pupilId);
};



const approveTutor = (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.params.tutorId;
    db.approveTutor(res, tutorId);
};



const addLesson = (req, res) => {
    if (!(req.tokenData.userType === 'P')) return res.status(401).send("You are Not allowed to do this action.")

    const pupilId = req.tokenData.id;
    const tutorId = req.body.tutorId;
    const calendarId = req.body.calendarId;
    const subject = req.body.subject;
    const points = req.body.points;
    const grade = req.tokenData.grade;
    db.scheduleLesson(res, pupilId, tutorId, calendarId, subject, points, grade);
};



const showLesson = (req, res) => {
    if (!(req.tokenData.userType === 'P' || req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const studentId = req.tokenData.id;
    const utype = req.tokenData.userType;
    db.showLessons(res, studentId, utype);
};



const getAvailability = (req, res) => {
    let tutorId;
    if (req.tokenData.userType == 'P'){
        tutorId = req.body.tutorId;
        console.log("id: " + req.body.tutorId);
    }
    else
        tutorId = req.tokenData.id;
    console.log(tutorId);
    db.showAvailableHours(res, tutorId);
};



const addAvailability = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.tokenData.id;
    const listTimes = req.body.listTimes;
    console.log("List times: ");
    console.log(JSON.parse(listTimes));
    db.AddAvailableTime(res, JSON.parse(listTimes), tutorId);
};



const deleteAvailability = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.tokenData.id;
    const calIdlist = req.body.calendarIdDelete.split(",").map(x => parseInt(x));
    console.log(calIdlist);
    db.removeAvailableTime(res, tutorId, calIdlist);
};



const getTeachingSubjects = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")
    console.log("Get Subject called");
    const tutorId = req.tokenData.id;
    db.getTeachingSubjects(res, tutorId);
};



const updateTeachingSubjects = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.tokenData.id;
    const subjects = req.body.subjects.split(","); // an array of 4 subject the user have chosen
    console.log(subjects);
    const subject1 = subjects[0] == "" ? null : subjects[0];
    const subject2 = subjects[1] == "" ? null : subjects[1];
    const subject3 = subjects[2] == "" ? null : subjects[2];
    const subject4 = subjects[3] == "" ? null : subjects[3];
    db.updateTeachingSubjects(res, tutorId, subject1, subject2, subject3, subject4)
};



const getTutoringHours = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.tokenData.id;
    db.getTutoringHours(res, tutorId);
};



const addTutoringHour = (req, res) => {
    if (!(req.tokenData.userType === 'T')) return res.status(401).send("You are Not allowed to do this action.")

    const tutorId = req.tokenData.id;
    db.addTutoringHour(res, tutorId);
};



const resetPassword = (req, res) => {
    const email = req.body.email;
    const studentId = req.body.studentId;
    db.findStudent(email, studentId, (result) => {
        db.sendToken(res, result)
    });
};



// check if token is the same as sent
const checkToken = (req, res) => {
    const token = req.body.token;
    db.checkToken(token, (result) => {
      if (
        result[0] != null &&
        token === result[0].token &&
        helpers.compareTimes(result[0].expiration)
      ) {
        db.signIn(res, result[0].id, result[0].username, result[0].pswd);
      } else {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        res.end("1");
      }
    });
};



// change password
const changePassword = (req, res) => {
    if (req.tokenData.userType != "P" && req.tokenData.userType != "T") {
        return res.end("You are not allowed to do this action!");
    } else {
        const studentId = req.tokenData.id;
        const newPass = req.body.newPass;
        console.log(newPass);
        db.changePassword(res, studentId, newPass);
    }
};



const rates = (req, res) => {
    if (!(req.tokenData.userType === "P")) {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      });
      res.end("You are not allowed to do this action!");
    }
  
    const tutorId = req.body.tutorId;
    const lessonId = req.body.lessonId;
    const rate = req.body.rate;
  
    db.rateLesson(res, tutorId, lessonId, rate);
}



const findTutors = (req, res) => {
    console.log("Starting teacher");
    if (!(req.tokenData.userType === 'P')) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("You are not allowed to do this action!");
        return 
    }
    
    const subjectNum = req.body.subjectNum; // The lesson's requested subject (must pass)
    const offset = req.body.offset;
    
    console.log(subjectNum == null)
    if (subjectNum == null) // get all teacher 
    {
        return db.getAllTeachers(res);
    }

    const date = req.body.date; // The requested date of the lesson (must pass)
    console.log("res" + validator.testData(date, 10));
    if (validator.testData(date, 10) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid date!");
        return;
    }
    const grade1 = req.body.grade1 || undefined; //The tutor's preferred grade - 10 / 11 / 12 (optional pass)
    console.log("res" + validator.testData(grade1, 7));
    if (validator.testData(grade1, 7) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid grade!");
        return;
    }
    const grade2 = req.body.grade2 || undefined; //The tutor's preferred grade - 10 / 11 / 12 (optional pass) 
    console.log("res" + validator.testData(grade2, 7));
    if (validator.testData(grade2, 7) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid grade!");
        return;
    }
    const studentGender = req.tokenData.gender; // The learner's gender - male or female (must pass)
    console.log("res" + validator.testData(studentGender, 8));
    if (validator.testData(studentGender, 8) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid gender!");
        return;
    }
    const tutorGender = req.body.tutorGender || undefined; // The tutor's preferred gender - male or female (optional pass)
    console.log("res" + validator.testData(tutorGender, 8));
    if (validator.testData(tutorGender, 8) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid gender!");
        return;
    }
    const rate = req.body.rate;
    console.log("res" + validator.testData(rate, 12));
    if (validator.testData(rate, 12) !== 0) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("Invalid rate!");
        return;
    }
    console.log(subjectNum, date, studentGender, tutorGender, grade1, grade2, rate);
    					   
    db.searchTeacher(res, subjectNum, date, studentGender, tutorGender, grade1, grade2, rate, offset);
}





const uploadProfileImg = (req, res) => {
    if (!(req.tokenData.userType === "P" || req.tokenData.userType === "T")) {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        });
        res.end("You are not allowed to do this action!");
    }
    console.log(req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        console.log("no file");
        res.status(200).send("No files were uploaded.");
    } else {
        console.log("Starting file upload!");
        let profileImg = req.body.profileImg;
        let studentId = req.tokenData.id;
        db.uploadProfileImage(res, studentId, profileImg);
    }
};



// change username 
const changeUsername = (req, res) => {
    if (!(req.tokenData.userType === "P" || req.tokenData.userType === "T")) {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      });
      res.end("You are not allowed to do this action!");
    }
  
    const newUsername = req.body.newUsername;
    const id = req.tokenData.id;
  
    db.changeProperty(req, res, 1, newUsername, id);
};  



// change Email
const changeEmail = (req, res) => {
  if (!(req.tokenData.userType === "P" || req.tokenData.userType === "T")) {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    res.end("You are not allowed to do this action!");
  }

  const newEmail = req.body.newEmail;
  const id = req.tokenData.id;

  db.changeProperty(req, res, 2, newEmail, id);
};



// change phone number
const changePhone = (req, res) => {
  if (!(req.tokenData.userType === "P" || req.tokenData.userType === "T")) {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    res.end("You are not allowed to do this action!");
  }

  const newPhone = req.body.newPhone;
  const id = req.tokenData.id;

  db.changeProperty(req, res, 3, newPhone, id);
};



// change tutor's bio info
const changeBio = (req, res) => {
  if (!(req.tokenData.userType === "T")) {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    res.end("You are not allowed to do this action!");
  }

  const newBio = req.body.newBio;
  const id = req.tokenData.id;

  db.changeProperty(req, res, 4, newBio, id);
};



const showStats = (req, res) => {
    if (req.tokenData.userType === 'P' || req.tokenData.userType === 'T') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.end("You are not allowed to do this action!");
    }

    const cityid = req.params.cityid;
    const subject = req.params.subject;
    db.showStats(res, cityid, subject);
}

module.exports = {
    getJitsiDetails,
    isTeacher,
    students,
    signIn,
    addStudent,
    signInAdmin,
    registerAuth,
    testProperty,
    register,
    isSignedIn,
    addAdmin,
    findTutors,
    deletelesson,
    approveTutor,
    addLesson,
    showLesson,
    getAvailability,
    addAvailability,
    deleteAvailability,
    getTeachingSubjects,
    updateTeachingSubjects,
    getTutoringHours,
    addTutoringHour,
    resetPassword,
    checkToken,
    changePassword,
    rates,
    uploadProfileImg, 
    changeUsername,
    changeEmail,
    changePhone,
    changeBio,
    showStats
}