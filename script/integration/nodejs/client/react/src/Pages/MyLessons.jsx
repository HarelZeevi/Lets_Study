import React, { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
// import Pagination from '../Components/Pagination';
import FirstLoginCta from '../Components/FirstLoginCta';
import "../Styles/mylessons.css"
import { AiFillStar } from 'react-icons/ai';
import { useRouteMatch } from 'react-router';
import { GiConsoleController } from 'react-icons/gi';


async function fetchTeachers(callback) {
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/lessons/';

    xhr.open("POST", url);
    let token = localStorage.getItem("token");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }

    xhr.setRequestHeader("authorization", token);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.send(null);
}

function MyLessons() {
    const [teachersData, setTeachersData] = useState([]);
    useEffect(() => {
        let mount = true;
        const renderTeachers = async () => {
            const data = await axios.get(`/TeacherService.json`);
            setTeachersData(data.data);
        }
        fetchTeachers(teachersData)
        if (mount) renderTeachers();
        return () => { mount = false }

    }, [])
    let objData;
    let upcomming = [];
    let tookPlace = [];
        fetchTeachers((res) => {

            objData = JSON.parse(res);
            objData.forEach((item) => {
                let current = new Date();
                if (new Date(item.availabledate.substring(0, 10)) > current || (item.availabledate === current && current.getTime() > item.endtime))
                    upcomming.push(item);
                else
                    tookPlace.push(item);
            })
            if (res != null) {
                console.log(objData);
                console.log(upcomming);
                console.log(tookPlace);
            }
        })

    return (

        <div dir="rtl">
            <FirstLoginCta />
            {
                upcomming.map
                (
                    lesson => (
                        <div className='teacher-container'>
                          <img className='tc_teacherimage' alt="the teacher's profile picture" src="https://upload.wikimedia.org/wikipedia/commons/f/f4/%D7%92%27_%D7%99%D7%A4%D7%99%D7%AA.jpg"/>  
                        <h1 className='tc_name'> {lesson.fullname}</h1>
                        <div dir='rtl' className=''>{lesson.subjectname}</div>
                        <div className='teacher_infofields tc_grade'>{lesson.grade}</div>
                        <button className='lessons_deeplinker' onClick={()=>{}}/*HAREL*/> עריכת שיעור </button>
                        </div>
                    ))
                    }
            {
                tookPlace.map
                (
                    lesson => (
                        <div className='teacher-container'>
                          <img className='tc_teacherimage' alt="the teacher's profile picture" src="https://upload.wikimedia.org/wikipedia/commons/f/f4/%D7%92%27_%D7%99%D7%A4%D7%99%D7%AA.jpg"/>  
                        <h1 className='tc_name'> {lesson.fullname}</h1>
                        <div dir='rtl' className=''>{lesson.subkectname}</div>
                        <div className='teacher_infofields tc_grade'>{lesson.grade}</div>
                        <button className='lessons_deeplinker' onClick={()=>{}}/*HAREL*/> עריכת שיעור </button>
                        </div>
                    ))
            }
        </div>
    )
}

export default MyLessons;