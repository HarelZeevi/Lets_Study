INSERT INTO Cities 
(cityName)
VALUES
("Ramat Gan");

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
                        "Avi",
                        "Yaakovi",
                        "Amit Bar Ilan",
                        "Teacher"
            );
           
           
INSERT INTO students
            (
                        id,
                        firstname,  
                        lastname,
                        age,
                        school,
                        gender,
                        tutorgender,
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
                        "John@gmail.com", "1234", True, False, 2);
                        
INSERT INTO tutors
            (
                        ,
                        isapproved,
                        rate,
                        hobby,
                        teachsubject,
                        pupilgender,
                        isSEQ
            )
            VALUES
            (
                        "123456789",
                        true,
                        4,
                        "Basketball",
                        "English",
                        "F",
                        false
            );
   
  
DELETE FROM cities
WHERE  cityname = "ramat gan";
