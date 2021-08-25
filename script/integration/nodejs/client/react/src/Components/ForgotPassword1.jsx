import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';
import { IoIosLock } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { IoMdCall } from 'react-icons/io';
import { IoMdPerson } from 'react-icons/io';
import '../Styles/forgotPass1.css';
function ForgotPassword1() {

    /*
    ----ERRORS-----
    Error #1 - Email doesn’t exist in the DB
            Do: small alert- *כתובת המייל שהכנסת לא תקינה.
    Error #2 - ID doesn’t exist in the DB
            Do: small alert- תעודת הזהות שהכנסת לא תקינה.

    */


    const submitFormButton = useRef();
    const form_id = useRef();
    const inputVal = useRef();
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const formMailValidation = () => {

        
        if (emailRegex.test(inputVal.current.value)){
            submitFormButton.current.style.transition = "0.3s";
            submitFormButton.current.style.opacity = "1";
            submitFormButton.current.disabled = "false";
            submitFormButton.current.style.cursor = "default"; 
        }
        else{
            submitFormButton.current.style.transition = "0.3s";
            submitFormButton.current.style.opacity = "0.7";
            submitFormButton.current.disabled = "true";
            submitFormButton.current.style.cursor = "not-allowed";
        }
        console.log(0);
    }
    return (
        <div>
            <div className="Container">
                    <span className="Title">שחזור סיסמה</span>
                    <form className="SendCodeVerification"  ref={form_id} dir="rtl">
                    <input id="EmailField"
                     ref={inputVal}
                    onChange={formMailValidation}
                    className="EmailField"
                     type="email" 
                    placeholder="כתובת מייל...">
                    </input>
                    <span className="Alert" dir="rtl">* ישלח אליך קוד במייל לשחזור סיסמה.</span>
                    <button className="form_submitbtn" ref={submitFormButton}> שלח לי מייל</button>
                    </form>
                </div>
            </div>
    )
}

export default ForgotPassword1;
