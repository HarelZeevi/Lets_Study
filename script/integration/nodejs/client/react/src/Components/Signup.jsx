import '../Styles/Signup.css';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';
import { IoIosLock } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { IoMdCall } from 'react-icons/io';
import { IoMdPerson } from 'react-icons/io';
import { useRef } from 'react';


async function register(params, callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/students/register'; 
    
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

function Signup() { //  fullname, username, gender, phone, email, pswd
    const malebtn = useRef();
    const femalebtn = useRef();
    const ps1 = useRef();
    const ps2 = useRef();
    const submit_fullname = useRef();
    const submit_username = useRef();
    const submit_phone = useRef();
    const submit_mail = useRef();
    let submit_gender = null;
    const errorSpan = useRef();
    const formSubmitBtn = useRef();

    function disable_submit() {
        formSubmitBtn.current.style.transition = "0.3s";
        formSubmitBtn.current.style.opacity = "0.7";
        formSubmitBtn.current.disabled = "true";
        formSubmitBtn.current.style.cursor = "not-allowed";
    }
    const form_validation = () => {
        if(ps2.current.value==ps1.current.value) {
            if(ps1.current.value.length>5) {
               if(submit_mail.current.value.includes('@')) {
                   if(submit_gender != null) {
                       if(submit_phone.current.value.length <= 12 && submit_phone.current.value.length > 8) {
                           if(submit_username.current.value.length>3 && submit_username.current.value.length<13) {
                               if(submit_fullname.current.value.length>4 && submit_fullname.current.value.length<26 && submit_fullname.current.value.includes(' ')) {
                                    formSubmitBtn.current.style.transition = "0.3s";
                                    formSubmitBtn.current.style.opacity = "1";
                                    formSubmitBtn.current.disabled= null;
                                    formSubmitBtn.current.style.cursor = "default";
                               }
                               else
                                    disable_submit();
                           }
                           else
                                disable_submit();
                       }
                       else
                            disable_submit();
                   }
                   else 
                        disable_submit();
               }
               else
                    disable_submit();
            }
            else
                disable_submit();
        }
        else
            disable_submit();
    }
    const registerForm = () => {
        var params = {
            id: "546987321",
            studentCode: "83812",
            fullname: submit_fullname.current.value,
            username: submit_username.current.value,
            gender: submit_gender,
            phone: submit_phone.current.value,
            email: submit_mail.current.value,
            pswd: ps1.current.value
        };
        register(params, (res) => {
            alert(res)
            let token = JSON.parse(res).accessToken;
            localStorage.setItem("token", "Bearer " + token);
        })
    }

    const malegender = () => {
        malebtn.current.style = 'background-color: rgb(86, 89, 235); transition: 0.3s all; color: #fff;';
        femalebtn.current.style = 'background-color: #fff; color: rgb(86, 89, 235);';
        submit_gender = "M";
        form_validation();
    }
    const femalegender = () => {
        femalebtn.current.style = 'background-color: rgb(86, 89, 235); transition: 0.3s all; color: #fff;';
        malebtn.current.style = 'background-color: #fff; color: rgb(86, 89, 235);';
        submit_gender="F";
        form_validation();
    }
    const p1_display = () => {
        document.getElementById('PasswordEyes1_on').style.display = 'none';
        document.getElementById('PasswordEyes1_off').style.display = 'block';
        ps1.current.type = 'text';
    }
    const p1_hide = () => {
        document.getElementById('PasswordEyes1_on').style.display = 'block';
        document.getElementById('PasswordEyes1_off').style.display = 'none';
        ps1.current.type = 'password';
    }
    const p2_display = () => {
        document.getElementById('PasswordEyes2_on').style.display = 'none';
        document.getElementById('PasswordEyes2_off').style.display = 'block';
        ps2.current.type = 'text';
    }
    const p2_hide = () => {
        document.getElementById('PasswordEyes2_on').style.display = 'block';
        document.getElementById('PasswordEyes2_off').style.display = 'none';
        ps2.current.type = 'password';
    }
    return (
        <div className="signup_box">
            <form className="signup_form" dir="rtl" onSubmit={registerForm}>
                <IoMdPerson className="form_input_logos" id="MdPersonTop"></IoMdPerson><input onChange={form_validation} ref={submit_fullname} required className="signup_form_inputs" id="signup_form_topinput" title="יש להכניס שם מלא בעברית" type="text" placeholder="שם מלא" pattern="[א-ת]{2,12}[ ]{1}[א-ת]{2,12}"></input>
                <br></br><br></br>
                <IoMdPerson className="form_input_logos"></IoMdPerson><input onChange={form_validation} ref={submit_username} required className="signup_form_inputs" title="שם משתמש יכול להכיל אותיות באנגלית ומספרים בלבד" type="text" placeholder="שם משתמש" pattern="[A-Za-z0-9]{4,12}"></input>
                <br></br><br></br>
                <IoMdCall className="form_input_logos"></IoMdCall><input onChange={form_validation} ref={submit_phone} required className="signup_form_inputs" type="text" placeholder="מספר טלפון" title="בדקו שמספר הטלפון תקין" pattern="[0][5][0-9]{8}|[0][5][0-9][-][0-9]{4}[-][0-9]{3}|[0][5][0-9][-][0-9]{3}[-][0-9]{4}|[0][5][0-9]{2}[-][0-9]{4}[-][0-9]{2}|[0][5][0-9]{2}[-][0-9]{3}[-][0-9]{3}|[0][3][0-9]{7}|[0][3][-][0-9]{4}[-][0-9]{3}|[0][3][-][0-9]{3}[-][0-9]{4}"></input>
                <br></br><br></br>
                <button ref={malebtn} onChange={form_validation} onClick={malegender} type="button" className="form_genderbox" id="genderbutton_male"  value="male">זכר</button>
                <button ref={femalebtn} onChange={form_validation} onClick={femalegender} type="button" className="form_genderbox" id="genderbutton_female"  value="female">נקבה</button>
                <br></br><br></br><br></br>
                <hr id="form_hrsep"></hr><br></br><br></br>
                <IoMdMail className="form_input_logos"></IoMdMail><input onChange={form_validation} ref={submit_mail} required className="signup_form_inputs" type="email" placeholder="כתובת מייל"></input>
                <br></br><br></br>
                <IoIosEye onClick={p1_display} className="form_input_eyes" id="PasswordEyes1_on"></IoIosEye>
                <IoIosEyeOff onClick={p1_hide} className="form_input_eyes" id="PasswordEyes1_off"></IoIosEyeOff>
                <IoIosLock className="form_input_logos"></IoIosLock><input onChange={form_validation} ref={ps1} required className="signup_form_inputs" id="form_p1" type="password" placeholder="סיסמה"></input><br></br><br></br>
                <IoIosEye  onClick={p2_display} className="form_input_eyes" id="PasswordEyes2_on"></IoIosEye>
                <IoIosEyeOff onClick={p2_hide} className="form_input_eyes" id="PasswordEyes2_off"></IoIosEyeOff>
                <IoIosLock className="form_input_logos"></IoIosLock><input onChange={form_validation} ref={ps2} title="שים לב ששתי הסיסמאות תואמות ותקינות" required className="signup_form_inputs" id="form_p2" type="password" placeholder="סיסמה בשנית"></input>
                <br></br><br></br>
                <span ref={errorSpan}></span>
                <button ref={formSubmitBtn} disabled className="form_submitbtn">הרשמה</button>
            </form>
        </div>
    )
}

export default Signup;