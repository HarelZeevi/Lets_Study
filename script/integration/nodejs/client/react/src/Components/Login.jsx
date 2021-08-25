import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/login.css';

export default function Login() {

    /*
    ----ERRORS-----
    Error #1 - Inputs dont match an account from the database (wrong inputs)
            Do: small alert- * פרטי המשתמש שהכנסת שגויים.
    Error #2 - ID doesn’t fit the format (9 digits, last one is ביקורת)
            Do: small alert - * תעודת הזהות שהכנסת לא תקינה.

    */
    return (
        <div>
         
            <div className="LoginContainer" dir="rtl">
                <span className="Title">התחברות</span>
                <form>
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
