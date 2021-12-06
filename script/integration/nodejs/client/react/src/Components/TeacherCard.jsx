import React, {useState, useRef } from 'react';
import '../Styles/teachercard.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function TeacherCard(teacher) {
    console.log('from teacherCard: ',teacher);
    const modalDarkBG = useRef();
    const modal = useRef();
    const OnClose = ()=>{
        modal.current.style.display = "none";
        modalDarkBG.current.style.display = 'none';
    }
        const [startDate, setStartDate] = useState(new Date());

    return (
        <div dir="rtl"> 
        <div className="dark-background-display" ref={modalDarkBG}></div>
           <div className="tc_container" ref={modal} >
           <div className="fc-Container-Content">
           <span className="close" onClick={OnClose}>&times;</span>
           <h1>{teacher.fullname}</h1>
           <p>{teacher.bio}</p>
           <div className='teacher_infofields tc_grade'>{teacher.grade}</div>
         <div className='teacher_infofields tc_subject'>{teacher.subjectname}</div>
         <p>{teacher.phoneNumber}</p>
         <p>{teacher.email}</p>
        <div><DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="MMMM d, yyyy h:mm aa"
    />
    </div>
        <div>לאחר קביעת השיעור מספר הטלפון שלך יישלח למורה לקביעת נושא ופרטי השיעור</div>
           <button className='fc_button' onClick={OnClose}><h1>קבע שיעור</h1></button>
               </div>
           </div>
        </div>
    )
}
