import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/login.css';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLock, IoIosEye, IoIosEyeOff } from 'react-icons/io';

async function signIn(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/students/signIn'; 
    
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

export default function Login() {

    /*
    ----ERRORS-----
    Error #1 - Inputs dont match an account from the database (wrong inputs)
            Do: small alert- * פרטי המשתמש שהכנסת שגויים.
    Error #2 - ID doesn’t fit the format (9 digits, last one is ביקורת)
            Do: small alert - * תעודת הזהות שהכנסת לא תקינה.

    */
   const login_submit_btn = useRef();
   const login_userid_handler = useRef();
   const login_password_handler = useRef();

   const signInForm = async(e) => {
    e.preventDefault();
       const params = {
           id: login_userid_handler.current.value,
           password: login_password_handler.current.value
       };
      signIn(params, (res) => {
            console.log(res)
            if (res === "1")
            {
                alert("Invalid user credentials")
            }
            else
            {
                let token = JSON.parse(res).accessToken;
                console.log(token)
                localStorage.setItem("token", "Bearer " + token);
                localStorage.setItem("isAuthenticated", "true");
                window.location.replace("/my-lessons");
            }
        });
   }
   const login_form_validation = () => {
       if(parseInt(login_userid_handler.current.value).toString().length==9 && login_password_handler.current.value.length>=6) {
            login_submit_btn.current.style.transition = "0.3s";
            login_submit_btn.current.style.opacity = "1";
            login_submit_btn.current.disabled= null;
            login_submit_btn.current.style.cursor = "default";
       }
       else {
            login_submit_btn.current.style.transition = "0.3s";
            login_submit_btn.current.style.opacity = "0.7";
            login_submit_btn.current.disabled = 'false';
            login_submit_btn.current.style.cursor = "not-allowed";
       }
   }
   const login_eyeopen = useRef();
   const login_eyeclose = useRef();
   const login_eyedisplay = () => {
        login_eyeopen.current.style.display = 'none';
        login_eyeclose.current.style.display = 'block';
        // login_pass_field.current.type = 'text';
        login_password_handler.current.type = 'text';
    }
    const login_eyehide = () => {
        login_eyeopen.current.style.display = 'block';
        login_eyeclose.current.style.display = 'none';
        // login_pass_field.current.type = 'password';
        login_password_handler.current.type = 'password'
    }
    document.title="התחברות לאתר";
    return (
        <div>
            <div className="LoginContainer cred_pages_topmargin" dir="rtl">
                <span className="title">התחברות</span>
                <form onSubmit={signInForm}>
                    <FaUserCircle className="login_userid"></FaUserCircle>
                    <input type="text" onChange={login_form_validation} ref={login_userid_handler} className="login_inputs IdArea" placeholder="תעודת זהות"></input>
                    <IoMdLock className="login_lock"></IoMdLock>
                    <input type="password" onChange={login_form_validation} ref={login_password_handler} className="login_inputs PasswordArea" placeholder="סיסמה"></input>
                    <button className='login_eyes_btns' type='button' ref={login_eyeopen}><IoIosEye className='login_eyes' onClick={login_eyedisplay}/></button>
                    <button className='login_eyes_btns' id='login_eye_closed' type='button' ref={login_eyeclose}><IoIosEyeOff className='login_eyes' onClick={login_eyehide}/></button>
                    <span className='fp_label'>שכחתם סיסמה?<Link to="/forgot-password-email" className="login_deeplinks">לחצו כאן</Link></span>
                    <button className="login_submitbtn" ref={login_submit_btn} disabled>התחבר</button>
                </form> 
            </div>
        </div>
    )
}
