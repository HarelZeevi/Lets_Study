/* eslint-disable default-case */
/*eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import React, { useState, useRef,useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
// import Pagination from '../Components/Pagination';
import "../Styles/lessons.css"
import { AiFillStar } from 'react-icons/ai';
import { FaAngleDown, FaGraduationCap, FaAngleUp, FaSearch } from 'react-icons/fa';
import FirstLoginCta from '../Components/FirstLoginCta';
import { FiX } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import TeacherCard from '../Components/TeacherCard';
import Footer from '../Components/Footer.jsx';
import "../Styles/teacherFilter.css"; 
// BsArrowLeft
// BsArrowRight


async function fetchTeachers(params, callback){
  var xhr = new XMLHttpRequest();
  const url = 'http://localhost:1234/api/findTutors/'; 
      
  xhr.open("POST", url);
  let token = localStorage.getItem("token");
  
  xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          callback(xhr.responseText)
      }
  }
  

  // CONVERTING OBJECT PARAMS TO ENCODED STRING
  let urlEncodedData = "", urlEncodedDataPairs = [], name;
  for(name in params) {
  urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
  }
  xhr.setRequestHeader("authorization", token);
  xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
  xhr.send(urlEncodedDataPairs.join("&"));
}

async function fetchAcvailability(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/findTutors/'; 
        
    xhr.open("POST", url);
    let token = localStorage.getItem("token");
    
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }
    
  
    // CONVERTING OBJECT PARAMS TO ENCODED STRING
    let urlEncodedData = "", urlEncodedDataPairs = [], name;
    for(name in params) {
    urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
    }
    xhr.setRequestHeader("authorization", token);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.send(urlEncodedDataPairs.join("&"));
  }
 function Lessons() {
    const [currentPage, setCurrentPage] = useState(1);
    const [teachersData,setTeachersData] = useState([]);
    const school_subs = useRef();
    const angelDown = useRef();
    const angelUp = useRef();
    let tf_gradeYud = true;
    let tf_gradeYudAleph = true;
    let tf_gradeYudBeit = true;
    let isOpen1 = false;
    const [resReturn, setResReturn] = useState([])
    const [res,setRes] =  useState([]);
    const renderTeachers = async ()=>{
        setRes(await axios.get(`/MatchedTeachers.json`));
        setTeachersData(res.data);
     }
    useEffect(() => {
      let mount = true;

         if(mount) renderTeachers();
         return ()=>{mount = false}

    
    }, [teachersData])



    const getTeacherById = (id)=>{
      document.getElementById('tc_div').style.display = 'block';
      let result;

      teachersData.map(teacher => {
        if (teacher.teacherid === id) result = teacher;
        return teacher; 
      })
      setResReturn(result);
      if (result !== undefined) return result;
      return console.error("NO TEACHER IN DB");
    }
    
    const onFilter1Click = ()=>{
        if(isOpen1){

            document.getElementById("filter-angle-down").style.display="none";
            document.getElementById("filter-angle-up").style.display="block";
            document.getElementById('teacherfilters_bgdiv1').style.display = 'none';
            school_subs.current.style.display = "none"
            isOpen1 = false;
        }
        else{
            document.getElementById("filter-angle-up").style.display="none";
            document.getElementById("filter-angle-down").style.display="block";
            document.getElementById('sort-form-container').style.display = 'none'
            document.getElementById('teacherfilters_bgdiv1').style.display="block";
            school_subs.current.style.display = "block"
            isOpen1 = true;
        }
    }
    let isOpen2 = false;
    const onFilter2Click = ()=>{
        if(isOpen2){
            document.getElementById('sort-form-container').style.display = 'none';
            document.getElementById("hamburger-sort").style.display="block";
            document.getElementById('FiX-sort').style.display="none";
            document.getElementById('teacherfilters_bgdiv2').style.display = 'none';
            isOpen2 = false;
        }
        else {
            document.getElementById('sort-form-container').style.display = 'block';
            document.getElementById('FiX-sort').style.display="block";
            document.getElementById("hamburger-sort").style.display="none";
            document.getElementById('teacherfilters_bgdiv2').style.display="block";
            isOpen2 = true;
        }
    }
    let tf_current_gender = 1;
    const updateGender = (event)=>{
        switch(event.target.id) {
            case 'tf_gender1':
                tf_current_gender = 1;
                break;
            case 'tf_gender2':
                tf_current_gender = 2;
                break;
            case 'tf_gender3':
                tf_current_gender = 3;
                break;
        }
    }
    
    const updateGrade = (event)=> {
        switch(event.target.id) {
            case 'tf_grade1':
                if(event.target.checked) {
                    tf_gradeYud = true;
                    tf_gradeYudAleph = true;
                    tf_gradeYudBeit = true;
                    document.getElementById('tf_grade1').checked = true;
                    document.getElementById('tf_grade2').checked = true;
                    document.getElementById('tf_grade3').checked = true;
                    document.getElementById('tf_grade4').checked = true;
                }
                else {
                    tf_gradeYud = false;
                    tf_gradeYudAleph = false;
                    tf_gradeYudBeit = false;
                    document.getElementById('tf_grade1').checked = false;
                    document.getElementById('tf_grade2').checked = false;
                    document.getElementById('tf_grade3').checked = false;
                    document.getElementById('tf_grade4').checked = false;
                }
                break;
            case 'tf_grade2':
                if(event.target.checked) {
                    tf_gradeYud = true;
                    document.getElementById('tf_grade2').checked = true;
                }
                else {
                    tf_gradeYud = false;
                    document.getElementById('tf_grade2').checked = false;
                }
                break;
            case 'tf_grade3':
                if(event.target.checked) {
                    tf_gradeYudAleph = true;
                    document.getElementById('tf_grade3').checked = true;
                }
                else {
                    tf_gradeYudAleph = false;
                    document.getElementById('tf_grade3').checked = false;
                }
                break;
            case 'tf_grade4':
                if(event.target.checked) {
                    tf_gradeYudBeit = true;
                    document.getElementById('tf_grade4').checked = true;
                }
                else {
                    tf_gradeYudBeit = false;
                    document.getElementById('tf_grade4').checked = false;
                }
                break;
        }
    }
    const confirm_filter_submit = () => {
        // current_gender is a variable that holds the current value of the gender section in the filters the user inputs.
        // current_gender = 1 means both genders (hakol)
        // current_gender = 2 means the user only wants male teachers
        // current_gender = 3 means the user only wants female teachers.
        // if you want to change it from numbers to strings (for example "both", "female", "male") tell me and I can change it within 15 seconds.


        // tf_gradeYud, tf_gradeYudAleph and tf_gradeYudBeit are boolean variables that represent the grades the user WANTED to be his/her teachers.
    }
    const filter_subject = (event) => {
        // event.target.value is the value of the subject the user chose.
        // for example, if the user chose מתמטיקה, event.target.value will be the string "מתמטיקה".
        /* example function for your integration:
        var newteachers = localhost.send(event.target.value) beeep boop port 1234;
        jsonfile.update(newteachers);
        */
        console.log('res: ', resReturn);
        let subject;
        alert(event.target.value)
        switch (event.target.value)
        {
            case 1: subject = "math";
            // Add here more cases for each Hebrew subject
            // The idea is to use the English subjects Instead
            default: subject =  null
        }

        // IMPORTANT!!! The format of the Date String match this pattern: "YYYY/MM/DD" (YEAR/Month/DAY)
        fetchTeachers(
            {
                "subject": "1",
                "date":"2022-09-04",
                "tutorGender": "M",
                "rate": 5
            },
            (res) => 
            {
                setResReturn(JSON.parse(res))
                console.log('res: ',JSON.parse(res));
                setTeachersData(JSON.parse(res));
                console.log(teachersData);
                if (res != "Not found")
                {
                    console.error('NO DATA')
                }
            }
       )
    }
    const increase = async ()=>{
      // const data=await axios.get(`/resultExample.json/${currentPage+1}`);
      setCurrentPage(currentPage+1);
      // setTeachersData(data.data);
    }

    const reduce = async ()=>{
      setCurrentPage(currentPage-1);
    }

    return (
    <div dir="rtl">
    <TeacherCard teacher={resReturn}/>
     <div id="teacherfilters_bgdiv1" onClick={onFilter1Click}></div>
        <div id="teacherfilters_bgdiv2" onClick={onFilter2Click}></div>

        <div className="subject-filter-container" >
            <div className="filter1-containter nonselective" onClick={onFilter1Click}>
       <FaAngleUp className="filter-angle-up" id="filter-angle-up" useRef={angelUp}>	
           </FaAngleUp><FaAngleDown className="filter-angle-down"id="filter-angle-down" useRef={angelDown}></FaAngleDown> מקצוע  <FaGraduationCap className="sort-icons"> </FaGraduationCap>
        </div>
        <div className="subject-filter-popup">
            <input className="subject-input"list="school-subjects"ref={school_subs} onChange={filter_subject}/>
                <datalist id="school-subjects">
                    <option value="מתמטיקה" className="tf-option-subject-fields"></option>
                    <option value="אנגלית" className="tf-option-subject-fields"></option>
                    <option value="מדעי המחשב" className="tf-option-subject-fields"></option>
                    <option value="מדעי החברה" className="tf-option-subject-fields"></option>
                </datalist>  	
                </div>
        </div>
        <div className="sort-filter-container">
        <div className="filter2-containter nonselective" onClick={onFilter2Click}>
            <FiX id='FiX-sort' className='sort-icons'/>
            <GiHamburgerMenu id="hamburger-sort" className="sort-icons"></GiHamburgerMenu>סינון</div>
            <div id="sort-form-container">
                <form className="sort-form">
                    <h3 className="filter2-paragraph-container"> מגדר: </h3>
                    <div className='tf_genderDiv'>
                        <input type="radio" name="gender" id='tf_gender1' defaultChecked onChange={updateGender}/>
                        <label htmlFor='tf_gender1'>הכל</label>
                        <br/>
                        <input type="radio" name="gender" id='tf_gender2' onChange={updateGender}/>
                        <label htmlFor='tf_gender2'>זכר</label>
                        <br/>
                        <input type="radio" name="gender" id='tf_gender3' onChange={updateGender}/>
                        <label htmlFor='tf_gender3'>נקבה</label>
                    </div>
                    <h3 className="filter2-paragraph-container2">כיתה:</h3> 
                    <div className="filter2-paragraph-container-inputs2">
                        
                        <input type="checkbox" name="grade" id="tf_grade1" onChange={updateGrade}/>
                        <label htmlFor='tf_grade1'>הכל</label>
                        <br/>
                        <input type="checkbox" name="grade" id="tf_grade2" onChange={updateGrade}/>
                        <label htmlFor='tf_grade2'>י</label>
                        <br/>
                        <input type="checkbox" name="grade" id="tf_grade3" onChange={updateGrade}/>
                        <label htmlFor='tf_grade3'>יא</label>
                        <br/>
                        <input type="checkbox" name="grade" id="tf_grade4" onChange={updateGrade}/>
                        <label htmlFor='tf_grade4'>יב</label>
                        <br/>
                    </div>
                    <h3 className="filter2-paragraph-container3">תאריך:</h3> 
                    <div className="date-time-continer-sort">
                        <input type="datetime-local"/>
                    </div>
                    <br/><hr/>
                    <button type='button' onClick={confirm_filter_submit} className='TF_FilterSubmitBtn'>סינון</button>
                </form>
            </div>
        </div>
        <div className="teachersTable">
          {
          teachersData.map
          (
              teacher=>(
           <div className="teacher-container">
          <img className='tc_teacherimage' alt="the teacher's profile picture" src="https://i.stack.imgur.com/34AD2.jpg"/>
          <div>
          <h1 className='tc_name'> {teacher.fullname}</h1>
          <p dir='rtl' className='tc_bio'>{teacher.bio}</p>
        <div>
          <div className='teacher_infofields tc_rate'><AiFillStar className='tc_ratestar'/>{teacher.rate}</div>
          <div className='teacher_infofields tc_grade'>{teacher.grade}</div>
         <div className='teacher_infofields tc_subject'>{teacher.subjectname}</div>
            </div>
        </div>
        <button className='lessons_deeplinker' onClick={()=>getTeacherById(teacher.teacherid)}/*HAREL*/>

            קבע שיעור</button>
          </div>
          ))}
      
      </div>
      <div className="Pagination-container">
        <button onClick={increase}>---)</button>
        <p>{currentPage}</p>
        <button onClick={reduce}>(---</button>
      </div>
      <Footer footertop='1350'/>
    </div>

    )
}
export default Lessons;