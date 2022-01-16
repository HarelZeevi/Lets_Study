import '../Styles/ProfileSettings.css';
import { GoPencil } from 'react-icons/go';
import { FcCheckmark } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useRef, useState } from 'react';
import TeacherSettings from './TeacherSettings';
// The request function
function changeProperty(propNum, params, callback)
{
    let reqURL;
    switch(propNum)
    {
        case 1:  // change username 
            reqURL = 'http://localhost:1234/api/students/changeUsername';
            break;
        case 2: // change Email
            reqURL = 'http://localhost:1234/api/students/changeEmail';
            break;
        case 3: // change phone number
            reqURL = 'http://localhost:1234/api/students/changePhone';
            break;
        case 4: // change tutor's bio information
            reqURL = 'http://localhost:1234/api/students/changeBio';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', reqURL, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    let token = localStorage.getItem("token");
    xhr.setRequestHeader("authorization", token);
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
    alert("Params: " + urlEncodedDataPairs.join("&"));
    xhr.send(urlEncodedDataPairs.join("&"));
}

function b64toBlob(dataURI) {
    
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

function uploadImage(image, callback)
{
    var data = new FormData();
    alert(image);
    data.append("profileImg", image);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:1234/api/students/uploadProfileImg/', true);
    let token = localStorage.getItem("token");
    xhr.setRequestHeader("Authorization", token);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }
    xhr.send(data);

}

function ProfileSettings(props) {
    const oldUsername = props.placeholder_username;
    const oldPhone = props.placeholder_phone;
    const oldEmail = props.placeholder_email;
    const oldPfp = props.user_image;
    const isTeacher = true;
    const form_image_input = useRef();
    const ps_userImg = useRef();
    const [ps_height, setPsHeight] = useState(300);

    // here are the function to call when submit the changed property IDO
    const sbmtChangeUsername = newUsername => {
        changeProperty(1, {newUsername :newUsername}, (res) => alert(res))
    }  
    const sbmtChangeEmail = newEmail => {
        changeProperty(2, {newEmail :newEmail}, (res) => alert(res))
    }
    const sbmtChangePhone = newPhone => {
        changeProperty(3, {newPhone :newPhone}, (res) => alert(res))
    }
    const sbmtChangeBio = () => {
        const newBio = "Hi this is my new Bio"; // Ido here you put the input form the user
        changeProperty(4, {newUsername :newBio}, (res) => alert(res))
    }
    const sbmtChangeImg = () => {
        let PS_oFReader = new FileReader();
        PS_oFReader.readAsDataURL(form_image_input.current.files[0]);
        PS_oFReader.onload = function (PS_oFReaderE) {
            ps_userImg.current.src = PS_oFReaderE.target.result;
            const newImg = PS_oFReaderE.target.result; // Ido here you put the input form the user
            alert(newImg);
            // Harel here you add the changeproperty function with the parameter newImg (newImg is the base64 of the received image)
            uploadImage(newImg, (res) => {
                alert(res); // response from the server
            });
        }
    }  

    const closePS = () => {
        document.getElementById('ProfileSettings_Wrapper').style.display= 'none';
        document.getElementById('ProfileSettings_DivBox').style.display = 'none';
    }
    
    let edit_username = false, edit_phone = false, edit_email = false, edit_bio = false;
    const editUsername = () => {
        if(edit_username) {
            document.getElementById('pencilUsername').style.display = 'block';
            document.getElementById('checkmarkUsername').style.display = 'none';
            document.getElementById('inputField_username').disabled= true;
            edit_username = false;
            if(document.getElementById('inputField_username').value!=oldUsername && document.getElementById('inputField_username').value.length>3 && document.getElementById('inputField_username').value.length<13)
                sbmtChangeUsername(document.getElementById('inputField_username').value);
        }
        else {
            document.getElementById('pencilUsername').style.display = 'none';
            document.getElementById('checkmarkUsername').style.display = 'block';
            document.getElementById('inputField_username').disabled= false;
            edit_username = true;
        }
    }
    const editPhone = () => {
        if(edit_phone) {
            document.getElementById('pencilPhone').style.display = 'block';
            document.getElementById('checkmarkPhone').style.display = 'none';
            document.getElementById('inputField_phone').disabled= true;
            edit_phone = false;
            if(document.getElementById('inputField_phone').value!=oldPhone && document.getElementById('inputField_phone').value.length>8 && document.getElementById('inputField_phone').value.length<11)
                sbmtChangePhone(document.getElementById('inputField_phone').value);
        }
        else {
            document.getElementById('pencilPhone').style.display = 'none';
            document.getElementById('checkmarkPhone').style.display = 'block';
            document.getElementById('inputField_phone').disabled= false;
            edit_phone = true;
        }
    }
    const editEmail = () => {
        if(edit_email) {
            document.getElementById('pencilEmail').style.display = 'block';
            document.getElementById('checkmarkEmail').style.display = 'none';
            document.getElementById('inputField_email').disabled= true;
            edit_email = false;
            if(document.getElementById('inputField_email').value!=oldEmail && document.getElementById('inputField_email').value.length > 7 && document.getElementById('inputField_email').value.length < 35)
                sbmtChangeEmail(document.getElementById('inputField_email').value);
        }
        else {
            document.getElementById('pencilEmail').style.display = 'none';
            document.getElementById('checkmarkEmail').style.display = 'block';
            document.getElementById('inputField_email').disabled= false;
            edit_email = true;
        }
    }
    return (
        <div className='ProfileSettings' id='ProfileSettings_Wrapper'>
            <div className='ProfileSettings_DarkBG' onClick={closePS}></div>
            <div className='ProfileSettings_Box' id='ProfileSettings_DivBox' style={{height: ps_height + "px"}}>
                <IoIosCloseCircleOutline className='ps_close_btn' onClick={closePS}/>
                <form className='SettingsForm'>
                    <label className='ps_form_label' dir='rtl'>שם משתמש:</label>
                    <br></br>
                    <GoPencil className='ps_input_pencil' id='pencilUsername' onClick={editUsername}/>
                    <FcCheckmark className='ps_input_checkmark' id='checkmarkUsername' onClick={editUsername}/>
                    <input id='inputField_username' className='ps_form_input' type='text' placeholder={oldUsername} disabled></input>
                    <br></br><br></br>
                    <label className='ps_form_label' dir='rtl'>מספר טלפון:</label>
                    <br></br>
                    <GoPencil className='ps_input_pencil' id='pencilPhone' onClick={editPhone}/>
                    <FcCheckmark className='ps_input_checkmark' id='checkmarkPhone' onClick={editPhone}/>
                    <input id='inputField_phone' className='ps_form_input' type='text' placeholder={oldPhone} pattern='[0][5][0-9]{8}|[0][5][0-9][-][0-9]{4}[-][0-9]{3}|[0][5][0-9][-][0-9]{3}[-][0-9]{4}|[0][5][0-9]{2}[-][0-9]{4}[-][0-9]{2}|[0][5][0-9]{2}[-][0-9]{3}[-][0-9]{3}|[0][3][0-9]{7}|[0][3][-][0-9]{4}[-][0-9]{3}|[0][3][-][0-9]{3}[-][0-9]{4}' disabled></input>
                    <br></br><br></br>
                    <label  className='ps_form_label' dir='rtl'>כתובת מייל:</label>
                    <br></br>
                    <GoPencil className='ps_input_pencil' id='pencilEmail' onClick={editEmail}/>
                    <FcCheckmark className='ps_input_checkmark' id='checkmarkEmail' onClick={editEmail}/>
                    <input id='inputField_email' className='ps_form_input' type='email' placeholder={oldEmail} disabled></input>
                    <div className='ps_img_field'>
                        <img ref={ps_userImg} className='ps_form_img' alt="profile picture" src={oldPfp}></img>
                        <label className='ps_form_input_img_label'>
                            <GoPencil className='ps_form_input_img_pencil'/>
                            <input ref={form_image_input} id='PS_form_image_input' onChange={sbmtChangeImg} className='ps_form_input_img' type='file'></input>
                        </label>
                        <div className='ps_img_un'>
                            {oldUsername}
                        </div>
                    </div>
                    {
                        isTeacher ? <TeacherSettings setPSHeight={setPsHeight}></TeacherSettings> : <div></div>
                    }
                </form>
            </div>
        </div>
    )
}

export default ProfileSettings;