import React, { useState, useRef } from 'react';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';
import { IoIosLock } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { IoMdCall } from 'react-icons/io';
import { IoMdPerson } from 'react-icons/io';
import { Link } from 'react-router-dom';
import '../Styles/forgotPass2.css'; 

function forgotPswd2(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/checkToken/'; 
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }

    // CONVERTING OBJECT PARAMS TO ENCODED STRING
    let urlEncodedData = "", urlEncodedDataPairs = [], name;
    for( name in params ) {
    urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
    }
    alert(urlEncodedDataPairs.join("&"));
    xhr.send(urlEncodedDataPairs.join("&"));
}

export default function ForgotPassword2() {

    /*
    ----ERRORS-----
    Error #1 - Verification code is invalid
            Do: small alert - קוד האימות שהכנסת שגוי.

    */

    const forgotPswdSubmit2 = () =>
    {
        const params = {
            token:"TOKEN IN HERE"
        }
        forgotPswd2(params, (res) => {alert(res)});
    }
    
    const form_signupCode = useRef();
    const submitFormButton = useRef();
    const formValidation = ()=>{
        
        if(form_signupCode.current.value.length === 6){
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
    }
    
    return (
                <div>
                <div className="Container" dir="rtl">
                        <span className="Title">שחזור סיסמה</span>
                        <form className="SemdMailForm" onSubmit={forgotPswdSubmit2}>
                        <input className="VerificationCode"
                        onChange={formValidation}
                         type="password"
                         ref={form_signupCode}
                          placeholder="קוד אימות...">
                        
                          </input>
                        <span className="Alert">  * הקוד נשלח לכתובת המייל שלך <Link to="" className="SendAgain">שלח שוב</Link></span>
                        
                        <button className="form_submitbtn" ref={submitFormButton}>אישור קוד</button>
                        </form>
                    </div>
                </div>
            )
}
