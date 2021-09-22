import React, { useState, useRef,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FirstLoginCta from '../Components/FirstLoginCta';
import "../Styles/lessons.css"



export default function Lessons() {

    const [teachersData,setTeachersData] = useState([]);

    

    useEffect(() => {
        const renderTeachers = async ()=>{
            const data=await axios.get('/resultExample.json');
            console.log(data);
            setTeachersData(data.data);
         }
    renderTeachers();
    // <FirstLoginCta/>
    }, [])
    return (
    <div dir="rtl">
          <div className="filterLine">ddd</div>
          <div className="teachersTable">
            {
            teachersData.map
            (
                teacher=>(
             <div className="teacher-container">
            <img alt="cc" src="https://i.stack.imgur.com/34AD2.jpg"/>
            <div>
            <h1> {teacher.fullname}</h1>
            <p>{teacher.bio}</p>
          <div>
            <button>{teacher.points}</button>
            <button>{teacher.grade}</button>
           <button>{teacher.subjectname}</button>
              </div>
              </div>
<button>קבע שיעור</button>

            </div>
            ))}
        
          </div>
    </div>
    )
}