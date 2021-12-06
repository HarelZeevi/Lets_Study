 /* Inserts */
 USE lets_study_users;
 INSERT INTO cities
            (
                        cityname
            )
            VALUES
            (
                        "ramat gan"
            );
            
INSERT INTO schools
            (
                        schoolid,
                        schoolname,
                        cityid,
                        subsleft
            )
            VALUES
            (
                        "571109",
                        "amit bar ilan",
                        1,
                        7
            );
            
# student example so only insert into students table
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
                        classnum 
            )
            VALUES
            (
						"QLtSMX6ECSFURJ3",
                        "987654321",
                        'P',
                        null,
                        "John Adams",
                        "johnie123",
                        "571109",
                        "M",
                        1,
                        "0502346815",
                        "John100@gmail.com",
                        "1234",
                        2
            );
            
# A full tutor insertion includes 2 inserts: 1. insert to student 2. insert to tutors 
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
                        classnum 
            )
            VALUES
            (
						"QeQ6M>6E23U._3",
                        "123456789",
                        'T', 
                        null,
                        "Ori",
                        "Granevich",
                        #school = schoolId
                        "571109",
                        "M",
                        10,
                        "0567776577",
                        "ori@gmail.com",
                        "1234",
                        2
            );
            
INSERT INTO tutors
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
                        "123456789",
                        'physics and math 5 points',
                        true,
                        5,
						0,
                        'M'
            );

INSERT INTO admins
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
                        "342665978",
                        "Avi",
                        "Yaakovi",
                        "1234",
                        "571109",
                        "0567893425",
                        "aviYaak@gmail.com"
            );

INSERT INTO languages
            (
                        studentid,
                        langname
            )
            VALUES
            (
                        "123456789",
                        "english"
            );

INSERT INTO subjects
            (
						studentid,
                        subjectname ,
                        points,
                        grade
            )
            VALUES
            (
						"123456789",
                        "math",
                        5,
                        7
            );
            
# tutor calendar insert
INSERT INTO calendar
            (
                        studentid ,
                        availabledate ,
                        starttime ,
                        endtime
            )
            VALUES
            (
                        "123456789",
                        "2021-05-11",
                        "12:00:00",
                        "15:00:00"
            );

INSERT INTO lessons
            (
                        pupilid,
                        tutorid ,
                        tutorcalid ,
                        subjectname ,
                        points ,
                        grade  ,
                        tookplace,
                        room
            )
            VALUES
            (
                        "987654321",
                        "123456789",
                        1,
                        "math",
                        5, 
                        9,
                        false,
						"54763817"
            );

INSERT INTO rates
            (
						tutorid,
						lessonid,
                        rate
						
                        
            )
            VALUES
            (
						"123456789",
                        1,
                        5
            );
        

# Selects 
SELECT *
FROM   cities
WHERE  cityname = "ramat gan";

SELECT *
FROM   students
WHERE  firstname = "ilay";
		 
SELECT *
FROM   students
WHERE  StudentCode = "QLQSMX6ECSFURJ3";

SELECT *
FROM   tutors
WHERE  isapproved = true;

SELECT *
FROM   workers
WHERE  isapproved = true;

SELECT *
FROM   languages
WHERE  studentid = "278917655"
AND    langname = "english";

SELECT *
FROM   schools
WHERE  schoolname = "amit bar ilan";

SELECT *
FROM   subjects
WHERE  subjectname = "math";

SELECT *
FROM   calendaar
WHERE  studentid = "328456722";

SELECT *
FROM   lessons
WHERE  tookplace = true;

SELECT *
FROM   rates
WHERE  studentid = "328456722"; 


# Deletes 
DELETE
FROM   cities
WHERE  cityname = "ramat gan";

DELETE
FROM   students
WHERE id="123456789";
		    
DELETE
FROM   students
WHERE StudentCode="QLQSMX6ECSFURJ3";

DELETE
FROM   tutors
WHERE  studentid="123456789";

DELETE
FROM   workers
WHERE  isapproved = true;

DELETE
FROM   languages
WHERE  studentid = "278917655"
AND    langname = "english";

DELETE
FROM   schools
WHERE  schoolname = "amit bar ilan";

DELETE
FROM   subjects
WHERE  subjectname = "math";

DELETE
FROM   calendaar
WHERE  studentid = "328456722";

DELETE
FROM   lessons
WHERE  tookplace = true;

DELETE
FROM   rates
WHERE  tutorid = "123456789"; 
