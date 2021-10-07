import React, { useState, useRef,useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
// import Pagination from '../Components/Pagination';
// import FirstLoginCta from '../Components/FirstLoginCta';
import "../Styles/lessons.css"
import { AiFillStar } from 'react-icons/ai';
import TeacherFilters from '../Components/TeacherFilters';
// BsArrowLeft
// BsArrowRight

export default function Lessons() {
    const [currentPage, setCurrentPage] = useState(1);
    const [teachersData,setTeachersData] = useState([]);
   
    useEffect(() => {
      let mount = true;
        const renderTeachers = async ()=>{
            const data=await axios.get(`/resultExample.json`);
            console.log(data);
            setTeachersData(data.data);
            console.log(data);
         }
         if(mount) renderTeachers();
         return ()=>{mount = false}
    
    }, [])

    const increase = async ()=>{
      // const data=await axios.get(`/resultExample.json/${currentPage+1}`);
      setCurrentPage(currentPage+1);
      // setTeachersData(data.data);
    }

    const reduce = async ()=>{
      // const data=await axios.get(`/resultExample.json/${currentPage-1}`);
      setCurrentPage(currentPage-1);
      // setTeachersData(data.data);
    }

    return (
    <div dir="rtl">
      {/* <FirstLoginCta/> */}
     <TeacherFilters/>
          <div className="filterLine">ddd</div>
          <div className="teachersTable">
            {
            teachersData.map
            (
                teacher=>(
             <div className="teacher-container">
            <img className='tc_teacherimage' alt="cc" src="https://i.stack.imgur.com/34AD2.jpg"/>
            <div>
            <h1 className='tc_name'> {teacher.fullname}</h1>
            <p dir='rtl' className='tc_bio'>{teacher.bio}</p>
          <div>
            <div className='teacher_infofields tc_rate'><AiFillStar className='tc_ratestar'/>{teacher.points}</div>
            <div className='teacher_infofields tc_grade'>{teacher.grade}</div>
           <div className='teacher_infofields tc_subject'>{teacher.subjectname}</div>
              </div>
          </div>
          <button className='lessons_deeplinker'>קבע שיעור</button>

            </div>
            ))}
        
          </div>
        <div className="Pagination-container">
        <button onClick={increase}>---)</button>
        <p>{currentPage}</p>
            <button onClick={reduce}>(---</button>
              </div>
    </div>

    )
}