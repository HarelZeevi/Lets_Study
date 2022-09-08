
import React, {useState, useRef, useEffect } from 'react';
import '../Styles/teachercard.css'
import "@progress/kendo-theme-default/dist/all.css";
import {IoMdMail, IoMdCall } from 'react-icons/io';
import ScheduleTime from './ScheduleTime';
import TimePicker from 'react-time-picker';


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
                    return 0;
                }
                let temp = '';
                let count = 0;
                let countScores = 0;
                for(let i = 0; i  < phoneNumber.length; i++){
                    count++;
                    temp += phoneNumber[i];
                    if (count % 3 === 0 && countScores < 2) {
                        countScores++;
                        temp += '-'
                    }
                }
                return temp;
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
                   <p className="tc_user-details_bio"><h4>{props.teacher.bio}</h4></p> 
                   <div className="tc_user-details_grade">{props.teacher.grade}</div>
                 <div className="tc_user-details_subject">{props.teacher.subjectname}</div>

                    </div>

                   
                    <div className="tc_email-phonenumber">
                    <IoMdCall  className="tc_icons tc_mdphone"></IoMdCall><p className="tc_phone"><h4>{FormatPhoneNumber(props.teacher.phoneNumber)}</h4></p>
                        <IoMdMail className="tc_icons tc_mdmail"></IoMdMail> <p className="tc_email"><h4>{props.teacher.email}</h4></p>
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