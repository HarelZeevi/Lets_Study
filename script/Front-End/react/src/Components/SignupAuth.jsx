import '../Styles/SignupAuth.css';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLock } from 'react-icons/io';


async function registerAuth(id, studentCode, callback){
    const url = 'http://localhost:1234/api/students/registerAuth/' + id + '/' + studentCode; 
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function SignupAuth()
{
    const form_id = useRef();
    const form_signupCode = useRef();
    const formErrorSpan = useRef();
    const formSubmitBtn = useRef();
    const IdError = "תעודת הזהות שהכנסת לא תקינה.";
    const CodeError = "קוד ההרשמה שהכנסת לא תקין.";
    let signupauth_history = useNavigate();
    const formSubmit = () => {
        alert(5);
        const id = form_id.current.value;
        const studentCode = form_signupCode.current.value;
        alert("id: " + id);
        alert("stucode" + studentCode);
        registerAuth(id, studentCode, (resp => {
            alert(resp);
            if (resp === "User Exists!")
            {
                localStorage.setItem("id", id);
                localStorage.setItem("studentCode",studentCode);
            }
        }));
        signupauth_history('/sign-up');
    }
    const formIdValidation = (event) => { // CHANGE THE LENGTH OF THE SIGNUP CODE IF NEEDED!
        if(form_id.current.value.length === 9) 
        {
            if(form_signupCode.current.value.length < 5)
            {
                formSubmitBtn.current.style.transition = "0.3s";
                formSubmitBtn.current.style.opacity = "0.7";
                formSubmitBtn.current.disabled = "true";
                formSubmitBtn.current.style.cursor = "not-allowed";
            }
            else if (form_signupCode.current.value.length > 5)
            {
                formErrorSpan.current.textContent = CodeError;
                formSubmitBtn.current.style.transition = "0.3s";
                formSubmitBtn.current.style.opacity = "0.7";
                formSubmitBtn.current.disabled = "true";
                formSubmitBtn.current.style.cursor = "not-allowed";
            }
            else if(form_signupCode.current.value.length === 5)
            {
                formSubmitBtn.current.style.transition = "0.3s";
                formSubmitBtn.current.style.opacity = "1";
                formSubmitBtn.current.disabled = "";
                formSubmitBtn.current.style.cursor = "default";
                formErrorSpan.current.textContent = "";
            }
            if(formErrorSpan.current.textContent === IdError)
            {
                if(form_signupCode.current.value.length > 5 || form_signupCode.current.value.length < 5)
                formErrorSpan.current.textContent = CodeError;
            }
        }
        else if (form_id.current.value.length > 9)
        {
            formErrorSpan.current.textContent = IdError;
            formSubmitBtn.current.style.transition = "0.3s";
            formSubmitBtn.current.style.opacity = "0.7";
            formSubmitBtn.current.disabled = "true";
            formSubmitBtn.current.style.cursor = "not-allowed";
        }
        else if (form_id.current.value.length < 9)
        {
            formSubmitBtn.current.style.transition = "0.3s";
            formSubmitBtn.current.style.opacity = "0.7";
            formSubmitBtn.current.disabled = "true";
            formSubmitBtn.current.style.cursor = "not-allowed";
        }
        if(form_signupCode.current.value.length === 5)
        {
            if(formErrorSpan.current.textContent === CodeError)
            {
                if(form_id.current.value.length > 9 || form_id.current.value.length < 9)
                formErrorSpan.current.textContent = IdError;
            }
        }
        if(form_signupCode.current.value.length > 5)
        {
            formErrorSpan.current.textContent = CodeError;
            formSubmitBtn.current.style.transition = "0.3s";
            formSubmitBtn.current.style.opacity = "0.7";
            formSubmitBtn.current.disabled = "true";
            formSubmitBtn.current.style.cursor = "not-allowed";
        }
    }
    document.title="אימות חשבון";
    return (
        <div className="signup cred_pages_topmargin">
            <span className="title">אימות חשבון</span>
            <form className="auth_form" dir="rtl" onSubmit={formSubmit}>
                <FaUserCircle class="signup_userid"></FaUserCircle>
                <input ref={form_id} onChange={formIdValidation} className="signup_inputs" pattern="[0-9]{9}" type="number" name="id" autocomplete="off" required placeholder="תעודת זהות"></input>
                <IoMdLock className="signup_usercode"></IoMdLock>
                <input ref={form_signupCode} onChange={formIdValidation} id="signupCode" className="signup_inputs" type="text" autocomplete="off" name="username" required placeholder="קוד הרשמה"></input>
                <span className="auth_alert">כבר יש לך חשבון? <Link to="/login" className="auth_alert_span">להתחברות</Link></span>     
                <span ref={formErrorSpan} className="form_redError"></span>
                <button disabled ref={formSubmitBtn} className="signup_submit" type="submit"><p>הירשם</p></button>
            </form>
        </div>
    )
}

export default SignupAuth;