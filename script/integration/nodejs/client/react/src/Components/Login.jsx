import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/login.css';

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
   const signInForm = () => {
       const params = {
            id:"123456789",
            password:"124"
       }
       signIn(params, (res) => alert(res));
   }
    return (
        <div>
         
            <div className="LoginContainer" dir="rtl">
                <span className="Title">התחברות</span>
                <form  onSubmit={signInForm}>
                    <input type="text" className="IdArea" placeholder="תעודת זהות"></input>
                    <input type="password" className="PasswordArea" placeholder="סיסמה"></input>
                    <Link to="/forgot-password-mail" className="AlertMessage">שכחתי סיסמה</Link>
                    <hr></hr>
                    <button className="login_submitbtn">התחבר</button>
                </form> 
            </div>
        </div>
    )
}
