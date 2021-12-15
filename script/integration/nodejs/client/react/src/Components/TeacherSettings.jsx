import React, { useRef, useState, useEffect } from 'react';
//import '../Styles/TeacherSettings.css';
import { FaRegFileAlt } from 'react-icons/fa';
import { IoLogoFacebook } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import '../Styles/TeacherSettings.css';
import '../Styles/teachersettings_sublist.css';

//let subjects = [1, 2, null, 6];

function updateTeachingSubjects(params, callback) {
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/tutors/updateTeachingSubjects';
    let token = localStorage.getItem("token");
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("authorization", token);
    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }

    // CONVERTING OBJECT PARAMS TO ENCODED STRING
    let urlEncodedData = "", urlEncodedDataPairs = [], name;
    for (name in params) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]));
    }
    alert(urlEncodedDataPairs.join("&"));
    xhr.send(urlEncodedDataPairs.join("&"));
}

function getTeachingSubjects(callback) {
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/tutors/getTeachingSubjects';

    xhr.open('POST', url, true);
    let token = localStorage.getItem("token");
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("authorization", token);
    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }
    xhr.send(null);
}
let subjects = [null, null, null, null];
function TeacherSettings(props) {
     // "LetsStudy_biology_194z72d83D72DF"
    const subjectNames = [
        '',
        'אזרחות',
        'אנגלית',
        'ביולוגיה',
        'דינים',
        'היסטוריה',
        'הנדסת תוכנה - אנדרואיד',
        'הנדסת תוכנה - סייבר',
        'הנדסת תוכנה - שירותי רשת',
        'כימיה',
        'לשון',
        'מדעי המחשב',
        'מחשבת ישראל',
        'מתמטיקה',
        'ספרות',
        'ערבית',
        'פיזיקה',
        'תלמוד',
        'תנ"ך'
    ]
    const [sub1_visiblity, set_sub1_visiblity] = useState('block');
    const [sub2_visiblity, set_sub2_visiblity] = useState('block');
    const [sub3_visiblity, set_sub3_visiblity] = useState('block');
    const [sub4_visiblity, set_sub4_visiblity] = useState('block');
    const [addSubTitle, setSubTitle] = useState('none');
    const [sub1_name, setSub1_name] = useState(subjectNames[subjects[0]]);
    const [sub2_name, setSub2_name] = useState(subjectNames[subjects[1]]);
    const [sub3_name, setSub3_name] = useState(subjectNames[subjects[2]]);
    const [sub4_name, setSub4_name] = useState(subjectNames[subjects[3]]);
    const [subMenu_visibility, setSubMenu_visibility] = useState('none');
    
    useEffect(() => {
        // Get the subject array here and update it! Example: subject = [1,2,3,null];
        getTeachingSubjects((res) => {
            let nsubjects = [null, null, null, null]
            if (!(res == "Not found")) {
                console.log("Found")
                let resObject = JSON.parse(res)[0];
                //console.log(resObject.subject1, resObject.subject2, resObject.subject3, resObject.subject4);
                let subjects = new Array(resObject.subject1, resObject.subject2, resObject.subject3, resObject.subject4);
                //console.log("in function: ");
                //console.log(subjects);  
                updateSubjects(subjects); 
                //setSubjects(nsubjects);
                
            }
        })   
        }
    , []);
    
    function updateSubjects(subjects)
    {
        let subIndex = 0;
        let isIncludingNull = false;
        console.log("in map: ");
        console.log(subjects);
        subjects.map(sub => {
            switch(subIndex)
            {
                case 0:
                    if(sub===null)
                    {
                        isIncludingNull = true;
                        set_sub1_visiblity('none');
                    }
                    else
                    {
                        setSub1_name(subjectNames[sub]);
                        set_sub1_visiblity('block');
                    }
                    break;
                case 1:
                    if(sub===null)
                    {
                        isIncludingNull = true;
                        set_sub2_visiblity('none');
                    }
                    else {
                        setSub2_name(subjectNames[sub]);
                        set_sub2_visiblity('block');
                    }
                    break;
                case 2:
                    if(sub===null)
                    {
                        isIncludingNull = true;
                        set_sub3_visiblity('none');
                    }
                    else
                    {
                        setSub3_name(subjectNames[sub]);
                        set_sub3_visiblity('block');
                    }
                    break;
                case 3:
                    if(sub===null)
                    {
                        isIncludingNull = true;
                        set_sub4_visiblity('none');
                    }
                    else
                    {
                        setSub4_name(subjectNames[sub]);
                        set_sub4_visiblity('block');
                    }
                    break;
            }
            subIndex++;
        })
        if(isIncludingNull)
            setSubTitle('block');
        console.log('finished updating');
        // Harel - update the subjects in your database. (The array "subject" is updated at this point)
        console.log("Updating...");
        console.log(subjects);
        updateTeachingSubjects({subjects: [1, 2, null , 6]}, (res) => {
            console.log(subjects);
            alert(res);
        })
    }
    function closeSubject(e) {
        const sub_closed_index = parseInt(e.currentTarget.id[8]);
        switch (sub_closed_index) {
            case 1:
                subjects[0] = null;
                set_sub1_visiblity('none');
                break;
            case 2:
                subjects[1] = null;
                set_sub2_visiblity('none');
                break;
            case 3:
                subjects[2] = null;
                set_sub3_visiblity('none');
                break;
            case 4:
                subjects[3] = null;
                set_sub4_visiblity('none');
                break;
        }
        setSubTitle('block');
        // HAREL - UPDATE AFTER THE REMOVAL OF A SPECIFIC SUBJECT HERE (the array's name is subjects[])
    }
    const searchSubjects = () => {
        
    }
    const SubMenuToggle = () => {
        if(subMenu_visibility==='none')
            setSubMenu_visibility('block');
        else
            setSubMenu_visibility('none');
    }
    const OnSubChoice = event => {
        let newSub = null;
        if(event.target.id[12]==0)
            newSub = parseInt(event.target.id[13]+event.target.id[14]);
        else
            newSub = parseInt(event.target.id[12]);
        if(!subjects.includes(newSub))
        {
            subjects[subjects.indexOf(null)] = newSub;
            updateSubjects();
            // Harel - here you update the subject array in the DB.
        }
        SubMenuToggle();
    }
        props.setPSHeight(550)
        let currentSubjectIndex = -1; 
        return (
            <div>
                <h3 dir='rtl'>מקצועות לימוד:</h3>
                <div className='subjectLabels'>
                    <div style={{ display: sub1_visiblity }} className='TeacherSettings_CurrentSubDivs'>
                        <div id='TS_Cell_1' onClick={closeSubject}>
                            <MdClose className='TeacherSettings_SubDiv_Close'/>
                        </div>
                        {sub1_name}
                        <FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                    </div>
                    <div style={{ display: sub2_visiblity }} className='TeacherSettings_CurrentSubDivs'>
                        <div id='TS_Cell_2' onClick={closeSubject}>
                            <MdClose className='TeacherSettings_SubDiv_Close'/>
                        </div>
                        {sub2_name}
                        <FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                    </div>
                    <div style={{ display: sub3_visiblity }} className='TeacherSettings_CurrentSubDivs'>
                        <div id='TS_Cell_3' onClick={closeSubject}>
                            <MdClose className='TeacherSettings_SubDiv_Close'/>
                        </div>
                        {sub3_name}
                        <FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                    </div>
                    <div style={{ display: sub4_visiblity }} className='TeacherSettings_CurrentSubDivs'>
                        <div id='TS_Cell_4' onClick={closeSubject}>
                            <MdClose className='TeacherSettings_SubDiv_Close'/>
                        </div>
                        {sub4_name}
                        <FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon' />
                    </div>
                <p style={{ display: addSubTitle }} dir='rtl' className='TeacherSettings_AddSubjectButton' onClick={SubMenuToggle}>הוסף מקצוע...</p>
                </div>
                <div style={{display: subMenu_visibility}} className='SubList_Box' dir='rtl'>
                    <div className='subMenu_closeIcon_wrapper' onClick={SubMenuToggle}>
                        <MdClose className='subMenu_closeIcon'/>
                    </div>
                    <input type='text' className='subList_searchBar' maxLength="22" placeholder="חפש מקצוע..."></input>
                    <AiOutlineSearch className='subList_searchIcon'></AiOutlineSearch>
                    <div className='subList' dir='rtl'>
                        <button className='subList_btns' id='subList_btn_1' onClick={OnSubChoice}>אזרחות</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_2' onClick={OnSubChoice}>אנגלית</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_3' onClick={OnSubChoice}>ביולוגיה</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_4' onClick={OnSubChoice}>דינים</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_5' onClick={OnSubChoice}>היסטוריה</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_6' onClick={OnSubChoice}>הנדסת תוכנה - אנדרואיד</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_7' onClick={OnSubChoice}>הנדסת תוכנה - סייבר</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_8' onClick={OnSubChoice}>הנדסת תוכנה - שירותי רשת</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_9' onClick={OnSubChoice}>כימיה</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_010' onClick={OnSubChoice}>לשון</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_011' onClick={OnSubChoice}>מדעי המחשב</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_012' onClick={OnSubChoice}>מחשבת ישראל</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_013' onClick={OnSubChoice}>מתמטיקה</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_014' onClick={OnSubChoice}>ספרות</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_015' onClick={OnSubChoice}>ערבית</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_016' onClick={OnSubChoice}>פיזיקה</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_017' onClick={OnSubChoice}>תלמוד</button>
                        <br></br>
                        <button className='subList_btns' id='subList_btn_018' onClick={OnSubChoice}>תנ"ך</button>
                    </div>
                </div>
            </div>
        )
}
export default TeacherSettings;