import React, { useState, useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { FaGraduationCap, FaBook } from "react-icons/fa";
import "../Styles/lessons.css";
export function LessonsList(props) {
  const [foundTeacher, setFoundTeacher] = useState(false);
  const [notFoundTeacher, setNotFoundTeacher] = useState(false);
  const [teacherCard, setteacherCard] = useState({});

  const numberToGrade = { 10: `י'`, 11: `י"א`, 12: `י"ב` }; // translates numbers to hebrew grades.

  const subjectNames = [
    "",
    "אזרחות",
    "אנגלית",
    "ביולוגיה",
    "דינים",
    "היסטוריה",
    "הנדסת תוכנה - אנדרואיד",
    "הנדסת תוכנה - סייבר",
    "הנדסת תוכנה - שירותי רשת",
    "כימיה",
    "לשון",
    "מדעי המחשב",
    "מחשבת ישראל",
    "מתמטיקה",
    "ספרות",
    "ערבית",
    "פיזיקה",
    "תלמוד",
    'תנ"ך',
  ];

  function createSubjectList(teacher) {
    let subjects = [teacher.subject1, teacher.subject2, teacher.subject3, teacher.subject4];
    subjects = subjects.filter(subject => subject != null);
    return subjects;
  }

  useEffect(() => {
    let mount = true;
    if (mount) {
      if (props.teachersData !== [] || props.teacher !== null) {
        setFoundTeacher(true);
      }
    }
    //console.log(props.teacher);
    console.table(props.teachersData);

    return () => {
      mount = false;
    };
  }, [props.teacher, props.teachersData, foundTeacher, notFoundTeacher]);

  const getTeacherById = (id) => {
    let result = null;
    try {
      props.teachersData.map((teacher) => {
        if (teacher.teacherid === id) {
          result = teacher;
        }
      });
      setteacherCard(result);
      document.getElementById("tc_reveal").style.display = "block";
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div>
      <div className="teachersTable">
        {foundTeacher && (
          <div className="teacher-container">
            <img
              className="tc_teacherimage"
              alt="the teacher's profile picture"
              src="https://www.uidownload.com/files/634/21/261/student-illustration.jpg"
            />
            <div>
              <h1 className="tc_name"> {props.teacher.fullname}</h1>
              <p dir="rtl" className="tc_bio">
                {props.teacher.bio}
              </p>
              <div>
                <div className="teacher_infofields tc_rate">
                  <AiFillStar className="tc_ratestar" />
                  {props.teacher.rate}
                </div>
                <div className="teacher_infofields tc_grade">
                  <FaGraduationCap className="tc_gradhat" />
                  {numberToGrade[props.teacher.grade]}
                </div>
                <div className="teacher_infofields tc_subject">
                  <FaBook className="tc_subjectbook" />
                  {/* {subjectNames[parseInt(props.teacher.subject1)]} */}
                  <ul id="teacher-subject-list">
                    {createSubjectList(props.teacher).map(subject => <li>{subjectNames[parseInt(subject)]}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <button
              className="lessons_deeplinker"
              onClick={() => getTeacherById(props.teacher.teacherid)} /*HAREL*/
            >
              קבע שיעור
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
