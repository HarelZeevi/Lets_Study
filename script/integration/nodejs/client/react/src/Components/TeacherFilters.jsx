import React, { useState, useRef,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaAngleDown, FaGraduationCap, FaAngleUp, FaSearch } from 'react-icons/fa';
import FirstLoginCta from '../Components/FirstLoginCta';
// import FiX from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import "../Styles/teacherFilter.css"; 

export default function TeacherFilters() {
    const school_subs = useRef();
    const angelDown = useRef();
    const angelUp = useRef();
    const [isOpened1,setOpened1] = useState(false);
    const [isOpened2,setOpened2] = useState(false);
    const onFilter1Click = ()=>{
        if(!isOpened1){
            document.getElementById("filter-angle-up").style.display="none";
            document.getElementById("filter-angle-down").style.display="block";
            document.getElementById('sort-form-container').style.display = 'none'
            document.getElementById('demo-background-clip').style.display = 'none'
            school_subs.current.style.display = "block"
            setOpened2(false)
            setOpened1(true)
        }
        else{
            document.getElementById("filter-angle-down").style.display="none";
            document.getElementById("filter-angle-up").style.display="block";
            
            school_subs.current.style.display = "none"
            setOpened1(false)
        }
    }
    const onFilter2Click = ()=>{
        if(!isOpened2){
            document.getElementById('sort-form-container').style.display = 'block'
            document.getElementById('demo-background-clip').style.display = 'block'
            document.getElementById("filter-angle-down").style.display="none";
            document.getElementById("filter-angle-up").style.display="block";
            // document.getElementById('FiX-sort').style.display="block";
            // document.getElementById("hamburger-sort").style.display="none";
            school_subs.current.style.display = "none"
            setOpened1(false)
            setOpened2(true)
        }
        else{
            document.getElementById('sort-form-container').style.display = 'none'
            document.getElementById('demo-background-clip').style.display = 'none'
            
            setOpened2(false)
        }
            

    }

    const onBackGroundClick = ()=>{
        if(isOpened1){
            document.getElementById("filter-angle-down").style.display="none";
            document.getElementById("filter-angle-up").style.display="block";
            
            school_subs.current.style.display = "none"
            setOpened1(false)
        }
        if(isOpened2){
            document.getElementById('sort-form-container').style.display = 'none'
            document.getElementById('demo-background-clip').style.display = 'none'
            
            setOpened2(false)
        }
        let isClicked = false;
        if(!isClicked){
            document.getElementById('invisible-div-for-background').style.display = 'block';
            isClicked= true;
        }
        else{
            document.getElementById('invisible-div-for-background').style.display = 'none';
            isClicked = false;
        }

    }

    return (
    <div dir="rtl">
        <div className="invisible-div-for-background" id="invisible-div-for-background" onClick={onBackGroundClick}></div>
        <div className="subject-filter-container">
            <div className="filter1-containter nonselective" onClick={onFilter1Click}>
       <FaAngleUp onClick={onFilter1Click} className="filter-angle-up" id="filter-angle-up" useRef={angelUp}>
           </FaAngleUp><FaAngleDown onClick={onFilter1Click} className="filter-angle-down"id="filter-angle-down" useRef={angelDown}></FaAngleDown> מקצוע  <FaGraduationCap className="filter-graduation-cup"> </FaGraduationCap>
        </div>
        <div className="subject-filter-popup">
            <input className="subject-input"list="school-subjects"ref={school_subs}/>
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
            {/* <FiX id="FiX-sort" className="sort-hamburger" onClick={onFilter2Click}></FiX> */}<GiHamburgerMenu id="hamburger-sort" className="sort-hamburger" onClick={onFilter2Click}></GiHamburgerMenu>סינון</div>
            <div className="demo-background-clip" id="demo-background-clip"></div>
            <div className="sort-form-container" id="sort-form-container">
                <form className="sort-form">
                <p className="filter2-paragraph-container">
                    <br />
                             <h3> מין: </h3>
                             </p>
                             <div className="filter2-paragraph-container-inputs">
                <input type="radio" name="gender" value="all" id="gender1"/>
                <label htmlFor="gender1">הכל</label>
                <input type="radio" name="gender" value="male" id="gender2"/>
                <label htmlFor="gender2">זכר</label>
                <input type="radio" name="gender" value="female" id="gender3"/>
                <label htmlFor="gender3">נקבה</label>
                </div>
                
                <br />
                {/* דירוג
                <input type="range" min="1" max="5" step="0.5"/> */}

                <p className="filter2-paragraph-container2">
                    <h3>כיתה:</h3> 
                </p>
                <div className="filter2-paragraph-container-inputs2">
                <select name="class" id="">
                    <option value="הכל">הכל</option>
                    <option value="י'">י</option>
                    <option value="יא'">יא</option>
                    <option value="יב'">יב</option>
                </select>
                </div>

                <div className="date-time-continer-sort">

                    <input type="datetime-local"/>
                    
                </div>
                </form>
            </div>
        </div>

    </div>
    )
}