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

    const registerForm = () => {
        var params = new Object();
        params.id = "546987321";
        params.studentCode = "83812";
        params.fullname = "Jojg Referene";
        params.username = "usero123";
        params.gender = "M";
        params.phone = "0506435356"
        params.email = "harel@gmail.com"
        params.pswd = "1234";

        /*
        var params = {
            id:"546987321",
            studentCode:"83812",
            fullname:"JojoReferene",
            username:"usero123",
            gender:"M",
            phone:"05064353566", 
            email:"g@gmail.com",
            pswd:"1234"
        };
        */
        register(params, (resp) => {alert(resp)})
    }

    const malegender = () => {
        malebtn.current.style = 'background-color: rgb(86, 89, 235); transition: 0.3s all; color: #fff;';
        femalebtn.current.style = 'background-color: #fff; color: rgb(86, 89, 235);';
    }
    const femalegender = () => {
        femalebtn.current.style = 'background-color: rgb(86, 89, 235); transition: 0.3s all; color: #fff;';
        malebtn.current.style = 'background-color: #fff; color: rgb(86, 89, 235);';
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
                <IoMdPerson className="form_input_logos" id="MdPersonTop"></IoMdPerson><input required className="signup_form_inputs" id="signup_form_topinput" title="" type="text" placeholder="שם מלא" pattern="[א-ת]{2,15}[ ]{1}[א-ת]{2,15}"></input>
                <br></br><br></br>
                <IoMdPerson className="form_input_logos"></IoMdPerson><input required className="signup_form_inputs" type="text" placeholder="שם משתמש" pattern="[a-z0-9]{3,12}"></input>
                <br></br><br></br>
                <IoMdCall className="form_input_logos"></IoMdCall><input required className="signup_form_inputs" type="text" placeholder="מספר טלפון" pattern="[0][5][0-9]{8}|[0][5][0-9][-][0-9]{4}[-][0-9]{3}|[0][5][0-9][-][0-9]{3}[-][0-9]{4}|[0][5][0-9]{2}[-][0-9]{4}[-][0-9]{2}|[0][5][0-9]{2}[-][0-9]{3}[-][0-9]{3}|[0][3][0-9]{7}|[0][3][-][0-9]{4}[-][0-9]{3}|[0][3][-][0-9]{3}[-][0-9]{4}"></input>
                <br></br><br></br>
                <button ref={malebtn} onClick={malegender} type="button" className="form_genderbox" id="genderbutton_male"  value="male">זכר</button>
                <button ref={femalebtn} onClick={femalegender} type="button" className="form_genderbox" id="genderbutton_female"  value="female">נקבה</button>
                <br></br><br></br><br></br>
                <hr id="form_hrsep"></hr><br></br><br></br>
                <IoMdMail className="form_input_logos"></IoMdMail><input required className="signup_form_inputs" type="email" placeholder="כתובת מייל"></input>
                <br></br><br></br>
                <IoIosEye onClick={p1_display} className="form_input_eyes" id="PasswordEyes1_on"></IoIosEye>
                <IoIosEyeOff onClick={p1_hide} className="form_input_eyes" id="PasswordEyes1_off"></IoIosEyeOff>
                <IoIosLock className="form_input_logos"></IoIosLock><input ref={ps1} required className="signup_form_inputs" id="form_p1" type="password" placeholder="סיסמה"></input><br></br><br></br>
                <IoIosEye  onClick={p2_display} className="form_input_eyes" id="PasswordEyes2_on"></IoIosEye>
                <IoIosEyeOff onClick={p2_hide} className="form_input_eyes" id="PasswordEyes2_off"></IoIosEyeOff>
                <IoIosLock className="form_input_logos"></IoIosLock><input ref={ps2} required className="signup_form_inputs" id="form_p2" type="password" placeholder="סיסמה בשנית"></input>
                <br></br><br></br>
                <button className="form_submitbtn">הרשמה</button>
            </form>
        </div>
    )
}

export default Signup;