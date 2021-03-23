import pymongo
import getpass
from pymongo import MongoClient
from validate_email import validate_email
import http.client

conn = http.client.HTTPSConnection("api.zoom.us")

headers = {
    'content-type': "application/json",
    'authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Im5UQVgxS0xPVGtDY3AxWVB1NEJNbWciLCJleHAiOjE2MDM5MDY1ODUsImlhdCI6MTYwMzI5ODE4Nn0.ZNFPFm6nZzI9OxgtYLupYS48O4GjaUVul5HpvBu9e3M"
    }

#sending request for schedule meeting
def Zoom_schudeule_request(start_time):
    payload = "{\"topic\":\"TeachMe\",\"type\":2,\"start_time\":\"2020-10-24T18:00:00Z\",\"duration\":\"60\",\"timezone\":\"Asia/Jerusalem\",\"password\":\"12qwer123\"}"

    conn.request("POST", "/v2/users/zUZRppYtTpGJk7jlHeTTiA/meetings", payload, headers)

    res = conn.getresponse()
    data = res.read()

    print(data.decode("utf-8"))

#connecting to pymongo DB
cluster = pymongo.MongoClient("mongodb+srv://philip12:158200hz@cluster0.c30fz.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority")



#loading app database
db = cluster["TeachMe"]

#loading collections
Users = db["Users"]
Lesson_requests = db["Lesson_requests"]


#insert post (entry) with id
#Users.insert_one({"_id":0, "FirstName":"Harel", "LastName": "Zeevi", "Type":"Teacher", "Subjects":["English", "Math", "History"], "Age": 15, "Grade":10})


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




def name_check(name, Users, purpose):
    pass

def age_check(age):
    if  19 >= age >= 6:
        return True
    else:
        print(f"Age is not between 6 to 19")
        return False
def email_check(email, users, purpose):
    return True if validate_email(email) and not(Users.find_one({email})) else False    
def subject_check(grade):
    pass

def password_check(password):
    # passwords = password_crack(i) for i in passwords_data_base
    password_len = False
    is_one_capital = False
    is_one_special = False
    is_one_number = False
    """
    if password in passwords:
        return False
    """
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

print(password_check("Aa123456%"))

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

def sign_up():
    name = input("Enter Full name: ")
    gender = input("Enter youre gender(Male / Female): ")
    password = input("Enter Password: ")
    email = input("Enter Email address: ")
    age = int(input("Enter your Age: "))
    grade = int(input("Enter the grade you are in: "))
    if grade >= 9:
        user_type = "Teacher"
        subjects = input("Which subjects would you like to teach? ")
        Users.insert_one({"Gender":gender, "Name":name, "Password":password, "Email":email, "Age": age, "Grade":grade, "Type":user_type, "Subjects":subjects.split(", ")})
        return (name, gender, password, email, age, grade, user_type, subjects)
    else:
        user_type = "Learner"
        Users.insert_one({"Gender":gender, "Name":name, "Password":password, "Email":email, "Age": age, "Grade":grade, "Type":user_type})
        print(user_type)
        print("[User Successfully Created]...")
        return (name, gender, password, email, age, grade, user_type)    
    

def sign_in(Users):
    name = input("Enter Full name: ")
    password = getpass.getpass("Password: ")
    print(password)
    result = Users.find_one({"Name":name, "Password":password})
    if result:
        print ("[signed in DONE]...")
        return result
    else:
        print("[Name or Password DOESN'T EXIST]...")
        return False

def Add_lesson_reqest(learner_details):
    subject = input("Which subject would you like to LEARN? ")
    lesson_date = input("Enter the date you want to learn: ")
    lesson_hour = input("Enter starting hour: ")
    teacher_grade = input("Enter teacher grade(10-12) range: ")
    teacher_gender = input("Enter teacher gender: ") 
    Lesson_requests.insert_one({"Name":learner_details["Name"], "Grade":learner_details["Grade"], "Gender":learner_details["Gender"] ,"Subject":subject, "Lesson_date":lesson_date, "Lesson_hour": lesson_hour, "Teacher_gender": teacher_gender , "Teacher_grade":teacher_grade.split(", "), "Status": "Not Scheduled"})
    print("A request for " + subject + " lesson at: " + lesson_date +"; " + lesson_hour + " was sent!")
    
def Schedule_meeting(teacher_details):
    subject = input("Which subject would you like to TEACH? ")
    possible_lessons = list(Lesson_requests.find({"Subject":subject}))
    possible_lessons_filtered = []
    if not(possible_lessons):
        print("Sorry, no matches found.")
    else:
        for res in possible_lessons:
            if (str(teacher_details["Grade"]) in res["Teacher_grade"]) and (res["Teacher_gender"] == teacher_details["Gender"]) and (res["Status"] == "Not Scheduled"):
                possible_lessons_filtered.append([res["Name"], res["Lesson_date"], res["Lesson_hour"]])

        print(str(len(possible_lessons_filtered)) + " Results")
        if (len(possible_lessons_filtered)) == 1:
            print(f"Name: {possible_lessons[0]['Name']}, Gender: {possible_lessons[0]['Gender']}, Grade: {possible_lessons[0]['Grade']};")
        else:
            print("\n".join([" ".join(i) for i in possible_lessons_filtered]))
        l_name = input("Choose learner name for schedule: ")
        Lesson_requests.update_one({"Name":l_name}, {"$set":{"Status":"Scheduled"}})
        Lesson_requests.update_one({"Name":l_name}, {"$set":{"Teacher_name":teacher_details["Name"]}})
        Lesson_requests.update_one({"Name":l_name}, {"$set":{"Teacher_age":teacher_details["Age"]}})
        print("[Scheduled Successfully!]...")
        Zoom_schudeule_request()
        
def main():
    global SCREEN
    #connecting to pymongo DB
    cluster = MongoClient("mongodb+srv://philip12:158200hz@cluster0.c30fz.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority")

    #loading app database
    db = cluster["TeachMe"]

    #loading collections
    Users = db["Users"]
    Links = db["Links"]
    print(SCREEN)
    purpose = input("sign in / sign up: \n").lower()
    if purpose == "sign in":
        details = sign_in(Users)
        if details:
            if details["Type"] == "Teacher":
                Schedule_meeting(details)
            else:
                Add_lesson_reqest(details)
    elif purpose == "sign up":
        sign_up()
    input()
if __name__ == "__main__":
    main()

