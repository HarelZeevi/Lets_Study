/* eslint-disable default-case */
/*eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import React, { useState, useRef,useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Pagination from '../Components/Pagination';
import "../Styles/lessons.css"
import { AiFillStar } from 'react-icons/ai';
// import { FaAngleDown, FaGraduationCap, FaAngleUp, FaSearch } from 'react-icons/fa';
// import FirstLoginCta from '../Components/FirstLoginCta';
import { FiX } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import TeacherCard from '../Components/TeacherCard';
import Footer from '../Components/Footer.jsx';
import "../Styles/teacherFilter.css"; 
// BsArrowLeft
// BsArrowRight
import { LessonsList } from '../Components/LessonsList'

///// fetch list of teachers from the server
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


/// fetch  tutor's availability
async function fetchAvailability(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/getAvailability/'; 
        
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

///// fetch list of teachers from the server
async function scheduleLesson(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/addlesson/'; 
        
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
    const [warn, setWarn] = useState([]);
    const [offset, setOffset] = useState(0);
    const [teachersData,setTeachersData] = useState([]);
    const [g1, setG1] = useState(null);
    const [g2, setG2] = useState(null);
    const [subject, setSubject] = useState(null);
    
    // input variables for request to server 
    const date = null;
    let tutorGender = null;
    
    const school_subs = useRef();
    const angelUp = useRef();
    const [selectedDate, setSelectedDate] = useState(null);
    let tf_gradeYud = true;
    let tf_gradeYudAleph = true;
    let tf_gradeYudBeit = true;
    let isOpen1 = false;
    let tc_reveal = useRef();

    



    useEffect(() => {
        let mount = true;

        if(mount){

            document.getElementById('tc_reveal').style.display = 'none';    
            
            fetchTeachers({},
                (res) =>
                {
                    console.log(res);
                    setOffset(offset + 5); // setting s new offset
                    if(res === "unauthorized" || res === "Not found"){
                        setTeachersData([]);
                    } 
                    else {
                        console.log('jsonparse',JSON.parse(res));
                        setTeachersData(JSON.parse(res));
                    }
            })
        }
        return ()=>{
            mount = false;
        }
    }, [])

    

    const [teacherCard, setteacherCard] = useState({});
    
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

        let grade1 = null;
        let grade2 = null;

        alert(tf_gradeYud + ", " + tf_gradeYudAleph + ", " + tf_gradeYudBeit)
        // init grade1,

        if (tf_gradeYud == true)
        {
            grade1 = 10;
            
            if (tf_gradeYudAleph == true && tf_gradeYudBeit == true)
            {
                grade1 = null;
                grade2 = null;
            }
            else if (tf_gradeYudAleph == true)
            {
                grade2 = 11;
            }
            else if (tf_gradeYudBeit == true)
            {
                grade2 = 12;
            }
        }
        else if (tf_gradeYudAleph == true)
        {
            grade1 = 11;
            
            if (tf_gradeYudBeit == true)
            {
                grade2 = 12;
            }
        }
        else if(tf_gradeYudBeit == true){
            grade1 = 12;
        }
        // alert("grade1: " + grade1 + "grade2: " + grade2) ;
        setG1(grade1);
        setG2(grade2);
    }
    const confirm_filter_submit = (event) => {
        // current_gender is a variable that holds the current value of the gender section in the filters the user inputs.
        // current_gender = 1 means both genders (hakol)
        // current_gender = 2 means the user only wants male teachers
        // current_gender = 3 means the user only wants female teachers.
        // if you want to change it from numbers to strings (for example "both", "female", "male") tell me and I can change it within 15 seconds.
        event.preventDefault();

        let tutorGender; // inner scope variable 
        if (tf_current_gender == 1)
        {
            tutorGender = null;
        }
        else if (tf_current_gender == 2)
        {
            tutorGender = 'M';
        }
        else if (tf_current_gender == 3)
        {
            tutorGender = 'F'
        }
        
        let dataObj = {
            "subjectNum": subject,
            "grade1":g1,
            "grade2":g2, 
            "date": new Date(selectedDate).toISOString().split('T')[0],
            "tutorGender": tutorGender,
            "rate": 1,
            "offset": offset
        };
        fetchTeachers(dataObj,
            (res) =>
            {
                console.log(res);
                setOffset(offset + 5); // setting s new offset
                if(res === "unauthorized" || res === "Not found"){
                    setTeachersData([]);
                } 
                else {
                    console.log('jsonparse',JSON.parse(res));
                    setTeachersData(JSON.parse(res));
                }
        })
        // tf_gradeYud, tf_gradeYudAleph and tf_gradeYudBeit are boolean variables that represent the grades the user WANTED to be his/her teachers.
    }
        
        // here we schedule a lesson with a gotten calendar Id, tutorId, subject and points amount.
        /* scheduleLesson(
            {
                "tutorId":"254638563",
                "calendarId":42, 
                "subject": 1,
                "points": 5
            }, 
            (res) =>
            {
                console.log("Finished fetching availability");
                // Ori here you call the function that updates the availability of the teacher 
                // with res - the result object of the availability
                console.log(res);
            }
        ) */


    return (
    <div dir="rtl">
        <div id="tc_reveal" ref={tc_reveal}><TeacherCard teacher={teachersData}/></div>
        
        <div id="teacherfilters_bgdiv2" onClick={onFilter2Click}></div>
        <div className="sort-filter-container">
        <div className="filter2-containter nonselective" onClick={onFilter2Click}>
            <FiX id='FiX-sort' className='sort-icons'/>
            <GiHamburgerMenu id="hamburger-sort" className="sort-icons"></GiHamburgerMenu>סינון</div>
            <div id="sort-form-container">
                <form className="sort-form" onSubmit={confirm_filter_submit}>
                    <select onChange={(e) => setSubject(e.target.value)}>
                        <option value="0" className="tf-option-subject-fields">בחר מקצוע</option>
                        <option value="1" className="tf-option-subject-fields">אזרחות</option>
                        <option value="2" className="tf-option-subject-fields">ביולוגיה</option>
                        <option value="3" className="tf-option-subject-fields">דינים</option>
                        <option value="4" className="tf-option-subject-fields">היסטוריה</option>
                        <option value="5" className="tf-option-subject-fields">אנגלית</option>
                        <option value="6" className="tf-option-subject-fields">הנדסת תוכנה - אנדרואיד</option>
                        <option value="7" className="tf-option-subject-fields">הנדסת תוכנה - סייבר</option>
                        <option value="8" className="tf-option-subject-fields">הנדסת תוכנה - שירותי רשת</option>
                        <option value="9" className="tf-option-subject-fields">כימיה</option>
                        <option value="10" className="tf-option-subject-fields">לשון</option>
                        <option value="11" className="tf-option-subject-fields">מדעי המחשב</option>
                        <option value="12" className="tf-option-subject-fields">מחשבת ישראל</option>
                        <option value="13" className="tf-option-subject-fields">מתמטיקה</option>
                        <option value="14" className="tf-option-subject-fields">ספרות</option>
                        <option value="15" className="tf-option-subject-fields">ערבית</option>
                        <option value="16" className="tf-option-subject-fields">פיזיקה</option>
                        <option value="17" className="tf-option-subject-fields">תלמוד</option>
                        <option value="18" className="tf-option-subject-fields">תנ"ך</option>
                    </select>
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
                        <input type="date" onChange={(date)=>{setSelectedDate(date.target.valueAsDate);}}/>
                    </div>
                    <br/><hr/>
                    <button type='submit' className='TF_FilterSubmitBtn'>סינון</button>
                </form>
            </div>
        </div>
        {teachersData.length === 0 ? <h1><p>לא נמצאו תוצאות. נסה/י לסנן שנית!</p></h1> : teachersData.map(
            teacher=>(
                <LessonsList teacher={teacher} teachersData={teachersData} />
            )
            
        )}
        
      <Footer footertop='1350'/>
    </div>

    )
}
export default Lessons;
