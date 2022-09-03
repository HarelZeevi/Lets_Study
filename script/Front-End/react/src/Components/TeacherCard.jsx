
import React, {useState, useRef, useEffect } from 'react';
import '../Styles/teachercard.css'
import "@progress/kendo-theme-default/dist/all.css";
import {IoMdMail, IoMdCall } from 'react-icons/io';
import ScheduleTime from './ScheduleTime';
import TimePicker from 'react-time-picker';

const getAvailableTimes = (params, callback) => {
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

export default function TeacherCard(props) {
    const [times, setTimes] = useState([]);
    const [value, onChange] = useState('10:00');
    
    const OnClose = ()=>{
        document.getElementById('tc_reveal').style.display = 'none';
    }
        const [startDate, setStartDate] = useState(new Date());
        console.log(startDate);

        if (props.teacher === undefined || props.props === null || props.teacher.length == 0) {
            console.error('NO TEACHER TO INSPECT')
            return (
                <div></div>
            )
        }
        else {
            const FormatPhoneNumber = (phoneNumber)=>{
                if (phoneNumber === undefined || phoneNumber === null) {
                    return 0; // no phone number available
                }
                
                return phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3, 10); // prefix + dash + rest of phone number
            }
            return (
                <div dir="rtl"> 
                <div className="dark-background-display"></div>
                   <div className="tc_container">
                   <div className="fc-Container-Content">
                   <span className="close" onClick={OnClose}>&times;</span>

                    <div className="tc_user-details">

                   <img className="tc_user-details_img tc_teacherimage" alt="the teacher's profile pic" src="https://reactrouter.com/react-square.png"/>
                    <h1 className="tc_user-details_name">{props.teacher.fullname}</h1>
                   <h4><p className="tc_user-details_bio">{props.teacher.bio}</p></h4> 
                   <div className="tc_user-details_grade">{props.teacher.grade}</div>
                 <div className="tc_user-details_subject">{props.teacher.subjectname}</div>

                    </div>

                   
                    <div className="tc_email-phonenumber">
                    <IoMdCall  className="tc_icons tc_mdphone"></IoMdCall><h4><p className="tc_phone">{FormatPhoneNumber(props.teacher.phoneNumber)}</p></h4>
                        <IoMdMail className="tc_icons tc_mdmail"></IoMdMail> <h4><p className="tc_email">{props.teacher.email}</p></h4>
                    </div>


                    <div>
                    </div>





                <div>
                
            </div>
            <select>
                        <option>1Choose Time slot</option>
                    </select>
                {/* <div>לאחר קביעת השיעור מספר הטלפון שלך יישלח למורה לקביעת נושא ופרטי השיעור</div> */}
                   <button className='fc_button' onClick={OnClose}><h1>קבע שיעור</h1></button>
                       </div>
                   </div>
                </div>
            )
        }

    }
