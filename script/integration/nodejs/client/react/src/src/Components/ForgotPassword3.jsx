import React, { useState, useRef } from 'react';
import { IoIosEye, IoIosEyeOff, IoMdLock } from 'react-icons/io';
import '../Styles/forgotPass3.css';

function forgotPswd3(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/changePassword/'; 
    
      
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

export default function ForgotPass3() {
    const firstField = useRef();
    const secondField = useRef();
    const submitFormButton = useRef();
    const passwordsEqual = () => {
        if (firstField.current.value === secondField.current.value &&
            (firstField.current.value.length >= 6 &&
                secondField.current.value.length >= 6) &&
            (firstField.current.value.length <= 12 &&
                secondField.current.value.length <= 12)
        ) {
            submitFormButton.current.style.transition = "0.3s";
            submitFormButton.current.style.opacity = "1";
            submitFormButton.current.disabled = null;
            submitFormButton.current.style.cursor = "default";
        } else {
            submitFormButton.current.style.transition = "0.3s";
            submitFormButton.current.style.opacity = "0.7";
            submitFormButton.current.disabled = "true";
            submitFormButton.current.style.cursor = "not-allowed";
        }

    }
    const fp3Submit = () => {
        const params = {
            newPass: firstField.current.value
        };
        forgotPswd3(params, (res) => {
            alert(res);
        })
    }
    const p1_display = () => {
        document.getElementById('PaswordEyes1_on').style.display = 'none';
        document.getElementById('PaswordEyes1_off').style.display = 'block';
        secondField.current.type = 'text';

    }
    const p1_hide = () => {
        document.getElementById('PaswordEyes1_on').style.display = 'block';
        document.getElementById('PaswordEyes1_off').style.display = 'none';
        secondField.current.type = 'password';
    }
    const p2_display = () => {
        document.getElementById('PaswordEyes2_on').style.display = 'none';
        document.getElementById('PaswordEyes2_off').style.display = 'block';
        firstField.current.type = 'text';
    }
    const p2_hide = () => {
        document.getElementById('PaswordEyes2_on').style.display = 'block';
        document.getElementById('PaswordEyes2_off').style.display = 'none';
        firstField.current.type = 'password';
    }
    document.title="איפוס סיסמה";
    return (
        <div>
            <div className="fp3_container cred_pages_topmargin"
                dir="rtl" >
                <span className="title" >איפוס סיסמה</span>
                    <form className="ResetPasswordForm" onSubmit={fp3Submit}>
                        <IoMdLock className='fp3_lock'/>
                        <input className="ResetPassword"
                            onChange={passwordsEqual}
                            ref={firstField}
                            type="password"
                            placeholder="סיסמה חדשה..." >
                        </input>
                        <IoIosEye onClick={p1_display} className="form_input_eyes" id="PaswordEyes1_on"></IoIosEye>
                        <IoIosEyeOff onClick={p1_hide} className="form_input_eyes" id="PaswordEyes1_off"></IoIosEyeOff>
                        <IoMdLock className='fp3_lock2'/>
                        <input className="ResetPassword2" onChange={passwordsEqual} ref={secondField} type="password" placeholder="אימות סיסמה חדשה..." ></input>
                        <IoIosEye onClick={p2_display} className="form_input_eyes" id="PaswordEyes2_on" ></IoIosEye>
                        <IoIosEyeOff onClick={p2_hide} className="form_input_eyes" id="PaswordEyes2_off" > </IoIosEyeOff> 
                        <button disabled className="fp3_submitbtn"ref={submitFormButton} > אישור סיסמה </button> 
                    </form> 

            </div>
        </div>
            )
}