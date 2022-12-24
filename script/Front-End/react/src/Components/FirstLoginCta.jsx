import React, { useRef } from 'react';
// import {Link} from 'react-router-dom';
import "../Styles/loginCTA.css"
import loginillu from '../Images/firstlogincta.png';
import { useNavigate } from 'react-router';
export default function FirstLoginCta() {
    const modalDarkBG = useRef();
    const modal = useRef();
    const navigate = useNavigate();

    const OnClose = ()=>{
        modal.current.style.display = "none";
        modalDarkBG.current.style.display = 'none';
    }

    const directToLessons = () => {
        OnClose();
        navigate('/lessons');
    };

    return (
        <div className="FirstLoginCTA">
            <div className="dark-background-display" ref={modalDarkBG}></div>
            <div dir="rtl" className="Welcome-Container" ref={modal} onClick={OnClose}>
                <div className="Container-Content">
                    <span className="close" onClick={OnClose}>&times;</span>
                    <br/>
                    <h1 className='loginCTA_title'> שמחים שהצטרפת אלינו! </h1>
                    <img className='loginCTA_illu' src={loginillu} alt="illustration" width='550' height='450'/>
                    <br/>
                    <button className='loginCTA_button' onClick={directToLessons}><h1>קבע שיעור ראשון</h1></button>
                </div>
            </div>
        </div>
    )
}