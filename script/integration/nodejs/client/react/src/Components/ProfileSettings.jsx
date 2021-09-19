import '../Styles/ProfileSettings.css';

// The request function
function changeProperty(propNum, params, callback)
{
    let url;
    switch(propNum)
    {
        case 1:  // change username 
            url = 'http://localhost:1234/api/students/changeUsername';
            break;
        case 2: // change Email
            url = 'http://localhost:1234/api/students/changeEmail';
            break;
        case 3: // change phone number
            url = 'http://localhost:1234/api/students/changePhone';
            break;
        case 4: // change tutor's bio information
            url = 'http://localhost:1234/api/students/changeBio';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }

    // CONVERTING OBJECT PARAMS TO ENCODED STRING
    let urlEncodedData = "", urlEncodedDataPairs = [],name;
    for( name in params ) {
    urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
    }
    alert(urlEncodedDataPairs.join("&"));
    xhr.send(urlEncodedDataPairs.join("&"));
}



function ProfileSettings() {
    
    const sbmtChangeUsername   = () => {
        const newUsername =  "Ori23"; // Ido here you put the input form the user
        changeProperty(1, {newUsername :newUsername})
    }  
    const sbmtChangEmail = () => {
        const newEmail = "sdfjsndf@gmail.com"; // Ido here you put the input form the user
        changeProperty(2, {newUsername :newEmail})
    }
    const sbmtChangePhone = () => {
        const newPhone = "0562856382"; // Ido here you put the input form the user
        changeProperty(3, {newUsername :newPhone})
    }
    const sbmtChangeBio = () => {
        const newBio = "Hi this is my new Bio"; // Ido here you put the input form the user
        changeProperty(4, {newUsername :newBio})
    }

    // needed another request function
    const sbmtChangeImg = () => {
        const newImg = "image"; // Ido here you put the input form the user
    }  
    return (
        <div className='ProfileSettings'>
            <form className='SettingsForm' dir='rtl' enctype="multipart/form-data">
                <label>תמונת פרופיל:</label>
                <input type='file' name='Profile_img' className='settings_input_pfp'></input>
                <br></br><br></br>
                <input type='text' name='Username' placeholder='שם משתמש'></input>
                <br></br><br></br>
                <input type='email' name='Mail' placeholder='כתובת אימייל'></input>
                <br></br><br></br>
                <input type='text' name='Phone' placeholder='מספר טלפון' pattern='[0][5][0-9]{8}|[0][5][0-9][-][0-9]{4}[-][0-9]{3}|[0][5][0-9][-][0-9]{3}[-][0-9]{4}|[0][5][0-9]{2}[-][0-9]{4}[-][0-9]{2}|[0][5][0-9]{2}[-][0-9]{3}[-][0-9]{3}|[0][3][0-9]{7}|[0][3][-][0-9]{4}[-][0-9]{3}|[0][3][-][0-9]{3}[-][0-9]{4}'></input>
                <br></br><br></br>
                <input type='text' name='TeacherBio' className='Settings_input_teacherBio' placeholder='ביו של מורה'></input>
                <br></br><br></br>
                <button type='submit'>עדכון פרטים</button>
            </form>
        </div>
    )
}

export default ProfileSettings;