import getpass
import mysql.connector
from validate_email import validate_email
import http.client

conn = http.client.HTTPSConnection("api.zoom.us")

# connecting to db
users_ls = mysql.connector.connect(
host="localhost",
user="root",
passwd="158200Hz",
database = "users_ls"
)
cursor = users_ls.cursor()

#cursor.execute("ALTER TABLE Users MODIFY Math_points smallint UNSIGNED")
'''
cursor.execute("CREATE TABLE Links (Subject VARCHAR(50),             \
                                    Lesson_date VARCHAR(50),         \
                                    Lesson_hour VARCHAR(50),         \
                                    Teacher_name VARCHAR(50),        \
                                    Teacher_grade smallint UNSIGNED, \
                                    Teacher_gender VARCHAR(50),      \
                                    Scheduled VARCHAR(50))")      
'''
cursor.execute("ALTER TABLE Links ADD COLUMN Learner_id smallint UNSIGNED")
#cursor.execute("ALTER TABLE Links RENAME COLUMN user_id TO User_id")
headers = {
    'content-type': "application/json",
    'authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Im5UQVgxS0xPVGtDY3AxWVB1NEJNbWciLCJleHAiOjE2MDg4MDY4MzcsImlhdCI6MTYwODIwMjAzN30.6Y8XehT_ML6phq36uwYv7olYwUiZb-edAMyjf012P5U"
    }


#sending request for schedule meeting
'''
def zoom_schudeule_request():
    payload = "{\"topic\":\"TeachMe\",\"type\":2,\"start_time\":\"2020-10-24T18:00:00Z\",\"duration\":\"60\",\"timezone\":\"Asia/Jerusalem\",\"password\":\"12qwer123\"}"

    conn.request("POST", "/v2/users/zUZRppYtTpGJk7jlHeTTiA/meetings", payload, headers)

    res = conn.getresponse()
    data = res.read()

    print(data.decode("utf-8"))
'''


SCREEN = '''
88888888888                         888      888b     d888          
    888                             888      8888b   d8888          
    888                             888      88888b.d88888          
    888   .d88b.   8888b.   .d8888b 88888b.  888Y88888P888  .d88b.  
    888  d8P  Y8b     "88b d88P"    888 "88b 888 Y888P 888 d8P  Y8b 
    888  88888888 .d888888 888      888  888 888  Y8P  888 88888888 
    888  Y8b.     888  888 Y88b.    888  888 888   "   888 Y8b.     
    888   "Y8888  "Y888888  "Y8888P 888  888 888       888  "Y8888  
                                                                    
                                                                                                      
'''




# checks - not for now.
'''
def age_check(age):
    if  19 >= age >= 6:
        return True
    else:
        print(f"Age is not between 6 to 19")
        return False



def password_check(password):
    password_len = False
    is_one_capital = False
    is_one_special = False
    is_one_number = False
    if len(password) >= 8:
        password_len = True
    for i in password:
        if not is_one_capital:
            if i.isupper():
                is_one_capital = True
        if not is_one_special:
            if not i in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890":
                is_one_special = True     
        if not is_one_number:
            if i.isnumeric():
                is_one_number = True
        if is_one_capital and is_one_number and is_one_special and password_len:
            return True
    if not password_len:
        return "password to short"
    if not is_one_capital:
        return "you need at least one capital letter"
    if not is_one_special:
        return "you need at least one special character"
    if not is_one_number:
        return "you need at least one number"    




def name_check(user):
    # users = i for i in users_data_base
    """
    if user in users:
        return False
    """
    for i in user:
        if not i in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz":
            return False
    return True


def subject_check(grade, subject):
    if grade >= 10 and grade >= 12:
        return "Teacher"
    elif grade < 10:
        return "Student"
    else:
        return "Too Old"
    pass

'''

def sign_up():
    global cursor
    name = input("Enter Full name: ")
    gender = input("Enter youre gender(Male / Female): ")
    password = input("Enter Password: ")
    email = input("Enter Email address: ")
    age = int(input("Enter your Age: "))
    grade = int(input("Enter the grade you are in: "))
    user_id = input("Enter Your ID number: ")
    phone_number = input("Enter Your phone number: ")
    city = input("Enterthe city you are living in: ")
    langs = input("Enter Languages you are speaking: ")
    school = input("Enter your school name: ")
    if grade >= 9:
        user_type = "Teacher"
        bagruts = input("Enter bagruts that you have finished (If you haven't - Enter None): ")
        degrees = input("Enter degrees that you have finished (If you haven't - Enter None): ")
        math_pts = int(input("Enter how many Math points(1-5): "))
        english_pts = int(input("Enter how many English points: (1-5)"))
        physics_pts = int(input("Enter how many Physics points(1-5): "))
    else:
        user_type = "Learner"
        bagruts = None
        degrees = None
        english_pts = None
        math_pts = None
        physics_pts = None
    values = (name, password, email, grade, gender, age, user_type, user_id, phone_number, city, langs, bagruts, degrees, school, math_pts, english_pts, physics_pts)
    print(user_type)
    print("[User Successfully Created]...")
    cursor.execute("INSERT INTO Users (Name, Password, Email,  Grade, Gender,  Age, Type, User_id, Phone_number, City, Languages, Bagrut_finished, Degree_finished, School, Math_points, English_points, Physics_points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", values)
    users_ls.commit()
    return values  
    

def sign_in():
    global cursor
    name = input("Enter your name: ")
    user_id = input("Enter your id number: ")
    password = getpass.getpass("Password: ")
    print(password)
    cursor.execute("SELECT * FROM Users WHERE Name = %s AND Password = %s And User_id = %s", (name, password, user_id))
    result = cursor.fetchall()
    if result:
        print ("[signed in DONE]...")
        for x in result:
            print(x)    
        return x
    else:
        print("[Name or Password DOESN'T EXIST]...")
        return False


def Add_lesson_reqest(learner_details):
    subject = input("Which subject would you like to LEARN? ")
    lesson_date = input("Enter the date you want to learn: ")
    lesson_hour = input("Enter starting hour: ")
    teacher_grade = input("Enter teacher grade(10-12) range: ")
    teacher_gender = input("Enter teacher gender: ")
    values = (subject, lesson_date, lesson_hour, teacher_grade, teacher_gender, None, None, '0', learner_details[0])
    cursor.execute("INSERT INTO Links (Subject, Lesson_date, Lesson_hour, Teacher_grade, Teacher_gender, Teacher, Teacher_id, Scheduled, Learner) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", values)
    users_ls.commit()
    print("A request for " + subject + " lesson at: " + lesson_date +"; " + lesson_hour + " was sent!")
    

def Schedule_meeting(teacher_details):
    subject = input("Which subject would you like to TEACH? ")
    cursor.execute("SELECT * FROM Links WHERE Subject = %s", (subject,))
    possible_lessons = cursor.fetchall()
    #print(possible_lessons)
    possible_lessons_filtered = []
    if not(possible_lessons):
        print("Sorry, no matches found.")
    else:
        for res in possible_lessons:
            if (teacher_details[3] == res[3]) and (res[4] == teacher_details[4]) and (res[6] == '0'):
                possible_lessons_filtered.append([res[-3], res[1], res[2]])

        print(str(len(possible_lessons_filtered)) + " Results")
        if (len(possible_lessons_filtered)) == 1:
            print(possible_lessons_filtered[0])
        else:
            print("\n".join([" ".join(i) for i in possible_lessons_filtered]))
        l_name = input("Choose learner name for schedule: ")
        cursor.execute("UPDATE Links SET Scheduled = '1', Teacher = %s, Teacher_id = %s WHERE Learner = %s", (teacher_details[0], teacher_details[-1], l_name))
        users_ls.commit()
        print("[Scheduled Successfully!]...")
        #zoom_schudeule_request()

def main():
    print(SCREEN)
    #zoom_schudeule_request()
    purpose = input("sign in / sign up: \n").lower()
    if purpose == "sign in":
        details = sign_in()
        if details:
            if "Teacher" in details:
                Schedule_meeting(details)
            else:
                Add_lesson_reqest(details)
    elif purpose == "sign up":
        sign_up()
    input()
if __name__ == "__main__":
    main()

