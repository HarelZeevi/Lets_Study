import './SignupAccess.css';
import { useRef } from 'react';

function registerAuth(id, studentCode, callback){
    const url = 'http://localhost:1234/api/students/registerAuth/' + id + '/' + studentCode; 
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
            alert(2);
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send();
}
/*
function registerAuth2(id, studentCode){
    const url = 'https://jsonplaceholder.typicode.com/todos/1'//'http://localhost:1234/api/students/registerAuth/' + id + '/' + studentCode; 
    fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => alert(json))
}

const registerAuth2 = async (id, studentCode) => {
    const url = 'http://localhost:1234/api/students/registerAuth/' + id + '/' + studentCode; 
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
}
*/

function SignUpAccess()
{
    const form_id = useRef();
    const form_signupCode = useRef();
    const formErrorSpan = useRef();
    const formSubmitBtn = useRef();
    const IdError = "תעודת הזהות שהכנסת לא תקינה.";
    const CodeError = "קוד ההרשמה שהכנסת לא תקין.";
    const formSubmit = () => {
        const id = form_id.current.value;
        const studentCode = form_signupCode.current.value;
        registerAuth(id, studentCode, (resp) => {
            alert(5);
            alert(resp);
        });

        //registerAuth(id, studentCode, (resp => {alert(resp)}));
    }
    const formIdValidation = (event) => {
        if(form_id.current.value.length === 9) // CHANGE THE LENGTH OF THE SIGNUP CODE IF NEEDED!
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
    return (
        <div className="signup">
            <form className="signup_form" dir="rtl" onSubmit={formSubmit}>
                <input ref={form_id} onChange={formIdValidation} className="signup_inputs" type="number" name="id" autocomplete="off" required placeholder="תעודת זהות"></input>
                <br></br>
                <input ref={form_signupCode} onChange={formIdValidation} id="signupCode" className="signup_inputs" type="text" autocomplete="off" name="username" required placeholder="קוד הרשמה"></input>
                <span ref={formErrorSpan} className="form_redError"></span>
                <br></br><br></br>
                <button disabled ref={formSubmitBtn} className="signup_submit" type="submit"><p>אישור</p></button>
            </form>
        </div>
    )
}

export default SignUpAccess;