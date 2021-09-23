import '../Styles/ProfileSettings.css';
import { GoPencil } from 'react-icons/go';
import { FcCheckmark } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useRef } from 'react';
// The request function




function ProfileSettings() {
    const form_image_input = useRef();
    const ps_userImg = useRef();

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
            <div className='ProfileSettings_Box' id='ProfileSettings_DivBox'>
                <IoIosCloseCircleOutline className='ps_close_btn' onClick={closePS}/>
                <form className='SettingsForm'>
                    <label className='ps_form_label' dir='rtl'>שם משתמש:</label>
                    <br></br>
                    <GoPencil className='ps_input_pencil' id='pencilUsername' onClick={editUsername}/>
                    <FcCheckmark className='ps_input_checkmark' id='checkmarkUsername' onClick={editUsername}/>
                    <input id='inputField_username' className='ps_form_input' type='text' placeholder='idoabr' disabled></input>
                    <br></br><br></br>
                    <label className='ps_form_label' dir='rtl'>מספר טלפון:</label>
                    <br></br>
                    <GoPencil className='ps_input_pencil' id='pencilPhone' onClick={editPhone}/>
                    <FcCheckmark className='ps_input_checkmark' id='checkmarkPhone' onClick={editPhone}/>
                    <input id='inputField_phone' className='ps_form_input' type='text' placeholder='0501234567' pattern='[0][5][0-9]{8}|[0][5][0-9][-][0-9]{4}[-][0-9]{3}|[0][5][0-9][-][0-9]{3}[-][0-9]{4}|[0][5][0-9]{2}[-][0-9]{4}[-][0-9]{2}|[0][5][0-9]{2}[-][0-9]{3}[-][0-9]{3}|[0][3][0-9]{7}|[0][3][-][0-9]{4}[-][0-9]{3}|[0][3][-][0-9]{3}[-][0-9]{4}' disabled></input>
                    <br></br><br></br>
                    <label  className='ps_form_label' dir='rtl'>כתובת מייל:</label>
                    <br></br>
                    <GoPencil className='ps_input_pencil' id='pencilEmail' onClick={editEmail}/>
                    <FcCheckmark className='ps_input_checkmark' id='checkmarkEmail' onClick={editEmail}/>
                    <input id='inputField_email' className='ps_form_input' type='email' placeholder='user@gmail.com' disabled></input>
                    <div className='ps_img_field'>
                        <img ref={ps_userImg} className='ps_form_img' src='https://images.squarespace-cdn.com/content/v1/559b2478e4b05d22b1e75b2d/1545073697675-3728MXUJFYMLYOT2SKAA/Nesbit.jpg'></img>
                        <label className='ps_form_input_img_label'>
                            <GoPencil className='ps_form_input_img_pencil'/>
                            <input ref={form_image_input} className='ps_form_input_img' type='file'></input>
                        </label>
                        <div className='ps_img_un'>
                            Username
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileSettings;