import React, { useState, useRef } from 'react';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';
import '../Styles/forgotPass3.css';

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
            submitFormButton.current.disabled = "false";
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
            password: firstField.current.value
        };
        // HAREL - ADD YOUR INTEGRATION HERE! - something like forgotpass3(params, (res) => {)
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
    return (

        <div>
            <div className="fp3_container"
                dir="rtl" >
                <span className="title" > שחזור סיסמה </span>
                    <form className="ResetPasswordForm" onSubmit={fp3Submit}>
                        <input className="ResetPassword"
                            onChange={passwordsEqual}
                            ref={firstField}
                            type="password"
                            placeholder="סיסמה חדשה..." >
                        </input>
                        <IoIosEye onClick={p1_display} className="form_input_eyes" id="PaswordEyes1_on"></IoIosEye>
                        <IoIosEyeOff onClick={p1_hide} className="form_input_eyes" id="PaswordEyes1_off"></IoIosEyeOff>
                        <input className="ResetPassword2" onChange={passwordsEqual} ref={secondField} type="password" placeholder="אימות סיסמה חדשה..." ></input>
                        <IoIosEye onClick={p2_display} className="form_input_eyes" id="PaswordEyes2_on" ></IoIosEye>
                        <IoIosEyeOff onClick={p2_hide} className="form_input_eyes" id="PaswordEyes2_off" > </IoIosEyeOff> 
                        <button disabled className="fp3_submitbtn"ref={submitFormButton} > אישור סיסמה </button> 
                    </form> 

            </div>
        </div>
            )
}