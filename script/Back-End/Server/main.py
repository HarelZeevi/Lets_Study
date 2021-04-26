from bottle import route, run, template, error, request, redirect, static_file, response
import os
import json
import time


class User:
    def __init__(self, email, username, password, type, id, info={}):
        self.email = email
        self.username = username
        self.password = password
        self.type = type
        self.id = id
        self.lessons = []
        self.info = info

    def __repr__(self):
        return f"<User:username:{self.username}, password:{self.password}, type:{self.type}, id:{self.id}>"

    def __str__(self):
        return f"<User:username:{self.username}, password:{self.password}, type:{self.type}, id:{self.id}>"


class Lesson:
    def __init__(self, lessonId, hour, subject, learner, learnerId, teacher=None, teacherId=None):
        self.lessonId = lessonId
        self.learnerId = learnerId
        self.learner = learner
        self.teacher = teacher
        self.teacherId = teacherId
        self.hour = hour
        self.subject = subject

    def __repr__(self):
        return f"<User:learner:{self.learner}, teacher:{self.teacher}, hour:{self.hour}, subject:{self.subject}, lessonId:{self.lessonId}, learnerId:{self.learnerId}, teacherId:{self.teacherId}>"

    def __str__(self):
        return f"<User:learner:{self.learner}, teacher:{self.teacher}, hour:{self.hour}, subject:{self.subject}, lessonId:{self.lessonId}, learnerId:{self.learnerId}, teacherId:{self.teacherId}>"


path = os.path.abspath(__file__)
dir_path = os.path.dirname(path)
users = []
teacherlessLessons = []


def getUserIndexByNameAndPassword(username, password):
    for i in users:
        if i.username == username and i.password == password:
            return users.index(i)
    return -1


def getUserIndexById(id):
    for i in users:
        if i.id == id:
            return users.index(i)
    return -1


@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root=dir_path)


@error(404)
def error_404_page(error):
    return "<h1>Page Not Found</h1>"

# Pages


@route("/")
def mainpage():
    return template("html/main_page.html")


@route("/signin")
def signinPage():
    return template("html/sign_in_page.html")


@route("/loggedIn")
def logginPage():
    items = {
        "id": request.get_cookie("id")
    }
    index = getUserIndexById(int(items["id"]))
    return template("html/logged_in_page.html", user=users[index].username, sub=users[index].type, lessons=teacherlessLessons)


@route("/lessonsList")
def lessonsListPage():
    items = {
        "id": request.get_cookie("id")
    }
    index = getUserIndexById(int(items["id"]))
    print(users[index])
    return template("html/lessons_list.html", lessons=users[index].lessons)

# Functional Things


@route("/createNewUser", method="POST")
def createNewUser():
    items = {
        "email": request.forms["email"],
        "username": request.forms["username"],
        "password": request.forms["password"],
        "tOrL": request.forms["tOrL"]
    }
    try:
        info = {
            "grade": request.forms["grade"],
            "age": request.forms["age"],
            "gender": request.forms["gender"],
            # gender of his mate (the one who tech him or he teach)
            "mateG": request.forms["mateG"],
            "IDnumber": request.forms["IDnumber"],
            "city": request.forms["city"],
            "phoneNumber": request.forms["phoneNumber"],
            "isAccelerated": request.forms["isAccelerated"],
            "isSpacelEducation": request.forms["isAccelerated"]
        }
        print(info)
    except:
        info = {}
    if not("@" in items["email"]):
        return "Failed1"
    if len(items["username"]) < 2:
        return "Failed2"
    if len(items["password"]) < 2:
        return "Failed3"
    for i in users:
        if i.email == items["email"] or i.password == items["password"]:
            return "Failed4"
    NewUser = User(items["email"], items["username"],
                   items["password"], items["tOrL"], len(users), info=info)
    users.append(NewUser)
    print(NewUser)
    return "everything is ok"


@route("/logUserIn", method="POST")
def logUserIn():
    items = {
        "username": request.forms["username"],
        "password": request.forms["password"]
    }
    index = getUserIndexByNameAndPassword(items["username"], items["password"])
    if index == -1:
        return "username or password are invalid"
    else:
        response.set_cookie("id", str(index))
        print("id:", index)
    return "everything is ok"


@route("/postHelp", method="POST")
def postHelp():
    items = {
        "id": request.get_cookie("id"),
        "hour": request.forms["hour"],
        "subject": request.forms["subject"]
    }
    index = getUserIndexById(int(items["id"]))
    newLesson = Lesson(len(teacherlessLessons), items["hour"], items["subject"],
                       users[index].username, items["id"], None)
    teacherlessLessons.append(newLesson)
    print(teacherlessLessons)
    return "posted"


@route("/determineClass", method="POST")
def determineClass():
    items = {
        "id": request.get_cookie("id"),
        "lessonId": request.forms["lessonId"],
        "learner": request.forms["learner"],
        "hour": request.forms["hour"],
        "subject": request.forms["subject"]
    }
    print(items)
    print(teacherlessLessons)
    learnerId = teacherlessLessons[int(items["lessonId"])].learnerId
    learnerIndex = getUserIndexById(int(learnerId))
    teacherId = items["id"]
    teacherIndex = getUserIndexById(int(teacherId))
    teacherlessLessons[int(items["lessonId"])
                       ].teacher = users[teacherIndex].username
    teacherlessLessons[int(items["lessonId"])
                       ].teacherId = users[teacherIndex].id

    users[learnerIndex].lessons.append(
        teacherlessLessons[int(items["lessonId"])])
    users[teacherIndex].lessons.append(
        teacherlessLessons[int(items["lessonId"])])

    teacherlessLessons.remove(teacherlessLessons[int(items["lessonId"])])

    print(users[learnerIndex].lessons, "\n",
          users[teacherIndex].lessons, "\n", teacherlessLessons)
    for i in teacherlessLessons:
        i.lessonId = teacherlessLessons.index(i)


run(debug=True, reloader=True, host="localhost")
