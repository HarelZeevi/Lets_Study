import React, { useRef } from 'react';
import { IoMdLock } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
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
    for(name in params) {
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
    let forgotpassword2_history = useNavigate();
    const forgotPswdSubmit2 = () =>
    {
        alert('hi');
        const params = {
            token: form_signupCode.current.value
        };
        
        forgotPswd2(params, (res) => {
            if (res === "1")
            {
                alert("Invalid or expired Token.")
            }
            else
            {
                let token = JSON.parse(res).accessToken;
                alert(token);
                localStorage.setItem("token", "Bearer " + token);

            }
        });
        forgotpassword2_history('/forgot-password-new-password');
    }
    
    const form_signupCode = useRef();
    const submitFormButton = useRef();
    const formValidation = ()=>{
        
        if(form_signupCode.current.value.length === 6){
            submitFormButton.current.style.transition = "0.3s";
            submitFormButton.current.style.opacity = "1";
            submitFormButton.current.disabled = null;
            submitFormButton.current.style.cursor = "default"; 
        }
        else{
            submitFormButton.current.style.transition = "0.3s";
            submitFormButton.current.style.opacity = "0.7";
            submitFormButton.current.disabled = "true";
            submitFormButton.current.style.cursor = "not-allowed"; 
        }
    }
    document.title="איפוס סיסמה";
    return (
                <div>
                <div className="fp2_container cred_pages_topmargin" dir="rtl">
                        <span className="title">איפוס סיסמה</span>
                        <IoMdLock id="fp2lock"></IoMdLock>
                        <form className="SendMailForm" onSubmit={forgotPswdSubmit2}>
                        <input className="verificationCode"
                        onChange={formValidation}
                         type="password"
                         ref={form_signupCode}
                          placeholder="קוד אימות..."
                          title="קוד האימות נשלח למייל שהזנת בדף הקודם."
                          >
                          </input>
                        <span className="fp_2alert">  * הקוד נשלח לכתובת המייל שלך <Link to="" className="SendAgain">שלח שוב</Link></span>                 
                        <button disabled className="fp2_submitbtn" ref={submitFormButton}>אישור קוד</button>
                        </form>
                    </div>
                </div>
            )
}
