 /* Inserts */
 INSERT INTO cities
            (
                        cityname
            )
            VALUES
            (
                        "ramat gan"
            );

INSERT INTO students
            (
                        id,
                        firstname,
                        lastname,
                        age,
                        school,
                        gender,
                        partnergender,
                        grade,
                        cityid,
                        phone,
                        email,
                        pswd,
                        isaccelerated bool,
                        isspecialedu bool,
                        classnum tinyint,
            )
            VALUES
            (
                        "123456789",
                        "Ori",
                        "Granevich",
                        16,
                        "Amit",
                        "F",
                        "F",
                        10,
                        1,
                        "0542316577",
                        "John@gmail.com",
                        "1234",
                        true,
                        false,
                        2
            );

INSERT INTO tutors
            (
                        id,
                        isapproved,
                        rate,
                        hobby,
                        teachsubject,
                        pupilgender,
                        isseq
            )
            VALUES
            (
                        "123456789",
                        true,
                        4,
                        "basketball",
                        "english",
                        "f",
                        false
            );

INSERT INTO workers
            (
                        id ,
                        isapproved,
                        firstname,
                        lastname,
                        school,
                        job
            )
            VALUES
            (
                        "342665978",
                        true,
                        "avi",
                        "yaakovi",
                        "amit bar ilan",
                        "teacher"
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

INSERT INTO schools
            (
                        schoolid,
                        schoolname,
                        cityid
            )
            VALUES
            (
                        "571109",
                        "amit bar ilan",
                        1
            );

INSERT INTO subjects
            (
                        subjectname ,
                        points,
                        grade
            )
            VALUES
            (
                        "math",
                        5,
                        7
            );

INSERT INTO calendar
            (
                        studentid ,
                        availabledate ,
                        starttime ,
                        endtime,
                        subjectid
            )
            VALUES
            (
                        "123456789",
                        "11-05-2021",
                        "12:00:00",
                        "15:00:00",
                        1
            );

INSERT INTO lessons
            (
                        pupilid,
                        tutorid ,
                        pupilcalid ,
                        tutorcalid ,
                        subjectid ,
                        tookplace
            )
            VALUES
            (
                        "987654321",
                        "123456789",
                        1,
                        2,
                        1,
                        false
            );

INSERT INTO rates
            (
                        lessonid,
                        rate,
                        studentid,
                        workerid
            )
            VALUES
            (
                        1,
                        5,
                        "987654321",
                        "123456789"
            );
            
/* Selects */
SELECT *
FROM   cities
WHERE  cityname = "ramat gan";

SELECT *
FROM   students
WHERE  firstname = "ilay";

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

/* Deletes */
DELETE
FROM   cities
WHERE  cityname = "ramat gan";

DELETE
FROM   students
WHERE  firstname = "ilay";

DELETE
FROM   tutors
WHERE  isapproved = true;

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
WHERE  studentid = "328456722"; 
