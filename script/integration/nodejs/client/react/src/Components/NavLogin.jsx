import '../Styles/NavLogin.css';
import '../Styles/Navbar.css';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaAngleUp, FaRegEnvelope } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { FiLogOut, FiSettings, FiHelpCircle, FiX } from 'react-icons/fi';
import ProfileSettings from './ProfileSettings.jsx';

let result;


function navGetDetails(callback){
    var xhr = new XMLHttpRequest();
    const url = "http://localhost:1234/api/students/isSignedIn"; 
    
    xhr.open('POST', url, true);
    let token = localStorage.getItem("token");
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("authorization", token);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr)
        }
    }
    xhr.send(null);

}

//const [userPicture, setUserPicture] = useState();
//const [userName, setUserName] = useState();



function NavLogin() {
    const profile_username = useRef();
    const profile_arrow = useRef();
    const profile_popup = useRef();
    let popup_revealed = false;
    const ps_wrapper = useRef();
    // i = icon, t = title
    const popup_i1 = useRef(); 
    const popup_t1 = useRef(); 
    const popup_i2 = useRef();
    const popup_t2 = useRef();
    const popup_i3 = useRef();
    const popup_t3 = useRef();
    const popup_i4 = useRef();
    const popup_t4 = useRef();
    let Navlogin_arrowup = 'none';
    let Navlogin_arrowdown = 'initial';
    const [isloggedin, setisloggedin] = useState(false);
    const [ud_username,setUserName] = useState('ori');
    const [ud_picture,setPicture] = useState('base64');
    const [ud_isTeacher, setTeacher] = useState(false);
    const [ud_phone,setPhone]=useState('0544972955');
    const [ud_email,setEmail]=useState('blah@gmail.com');
    // IDO here you add the integration details. Here we call the function and know weather the user is loggedIn or not.
    function navbarSubmit() {
        navGetDetails((res) => {
            //alert(res.responseText);
            if (res.status === 403 || res.responseText === "unauthorized")
                {

                    setisloggedin(false); 
                }
            else
                {
                    let resObj = JSON.parse(res.responseText);
                    //alert("Username: " + resObj.username);
                    setUserName(resObj.username);
                    //setPicture(resObj.profile_img)
                    //console.log(resObj.profile_img);
                    setPhone(resObj.phone)
                    setPicture(resObj.profile_img)
                    setEmail(resObj.email)
                    setisloggedin(true); 
                    setTeacher(resObj.isTeacher);
                }
        });
            

    }
    
    function profile_hover() {
        profile_username.current.style.color = 'rgb(66, 168, 66)';
        profile_arrow.current.style.color = 'rgb(66, 168, 66)';
        document.getElementById('navlogin_username').style.color = 'rgb(66,168,66)';
        document.getElementById('nav_profile_arrow_down').style.color = 'rgb(66,168,66)';   
    }
    function profile_outhover() {
        profile_username.current.style.color = '#000';
        profile_arrow.current.style.color = '#000';
        if(!popup_revealed)
            document.getElementById('navlogin_username').style.color = '#000';
        document.getElementById('nav_profile_arrow_down').style.color = '#000';
    }
    function profile_popup_reveal() {
        if(popup_revealed) {
            document.getElementById('nav_profile_arrow_up').style.display = 'none';
            document.getElementById('nav_profile_arrow_down').style.display = 'initial';
            document.getElementById('navlogin_username').style.color = '#000';
            profile_popup.current.style.display = 'none';
            ps_wrapper.current.style.display = 'none';
            popup_revealed = false;
        }
        else {
            profile_popup.current.style.display = 'block';
            ps_wrapper.current.style.display = 'block';
            popup_revealed = true;
            document.getElementById('nav_profile_arrow_up').style.display = 'initial';
            document.getElementById('nav_profile_arrow_down').style.display = 'none';
            document.getElementById('navlogin_username').style.color = 'rgb(66,168,66)';
        }
    }
    function popup_highlight_1() {
        popup_i1.current.style.color = 'rgb(66,168,66)';
        popup_t1.current.style.color = 'rgb(66,168,66)';
    }
    function popup_unhighlight_1() {
        popup_i1.current.style.color = '#000';
        popup_t1.current.style.color = '#000';
    }
    function popup_highlight_2() {
        popup_i2.current.style.color = 'rgb(66,168,66)';
        popup_t2.current.style.color = 'rgb(66,168,66)';
    }
    function popup_unhighlight_2() {
        popup_i2.current.style.color = '#000';
        popup_t2.current.style.color = '#000';
    }
    function popup_highlight_3() {
        popup_i3.current.style.color = 'rgb(66,168,66)';
        popup_t3.current.style.color = 'rgb(66,168,66)';
    }
    function popup_unhighlight_3() {
        popup_i3.current.style.color = '#000';
        popup_t3.current.style.color = '#000';
    }
    function popup_highlight_4() {
        popup_i4.current.style.color = 'rgb(66,168,66)';
        popup_t4.current.style.color = 'rgb(66,168,66)';
    }
    function popup_unhighlight_4() {
        popup_i4.current.style.color = '#000';
        popup_t4.current.style.color = '#000';
    }
    const disconnect = () => {
        localStorage.setItem("token", "");
        window.location.reload();
    }
    const showPS = () => {
        document.getElementById('ProfileSettings_Wrapper').style.display= 'block';
        document.getElementById('ProfileSettings_DivBox').style.display = 'block';
        document.getElementById('nav_profile_arrow_up').style.display = 'none';
        document.getElementById('nav_profile_arrow_down').style.display = 'initial';
        document.getElementById('navlogin_username').style.color = '#000';
        document.getElementById('nav_profile_arrow_down').style.color = '#000';
        profile_popup.current.style.display = 'none';
        ps_wrapper.current.style.display = 'none';
        popup_revealed = false;
    }
    navbarSubmit()
    //setisloggedin = navbarSubmit(); 
    if(isloggedin) {
        return (
            <div className="navbar">
            <ul className='nav_profile' onMouseOver={profile_hover} onMouseOut={profile_outhover}>
                <li><img src={ud_picture} onClick={profile_popup_reveal} className='nav_pfp' alt="profile picture"></img></li>
                <li ref={profile_username} className='nav_profile_username_li' onClick={profile_popup_reveal}><span className='nonselective nav_username' id='navlogin_username'>{ud_username}</span></li>
                <li ref={profile_arrow} className='nav_profile_arrow_li' onClick={profile_popup_reveal}>
                    <FaAngleDown style={{display: Navlogin_arrowdown}} className='nav_profile_arrow' id='nav_profile_arrow_down'></FaAngleDown>
                    <FaAngleUp style={{display: Navlogin_arrowup}} className='nav_profile_arrow' id='nav_profile_arrow_up'/>
                </li>
            </ul>
            <div ref={ps_wrapper} className='nav_profile_popup_wrapper' onClick={profile_popup_reveal}></div>
            <div ref={profile_popup} className='nav_profile_popup'>
                <FiX onClick={profile_popup_reveal} className='profile_popup_close'></FiX>
                <table className='profile_popup_menu'>
                    <tr>
                        <td className='profile_title'>פרופיל</td>
                    </tr>
                    <hr className='profile_hr'></hr>
                    <tr className='navlogin_profile_popup'>
                        <td><Link ref={popup_t1} onMouseOver={popup_highlight_1} onMouseOut={popup_unhighlight_1} className='profile_popup_titles' to='/404'>עזרה</Link></td>
                        <td ref={popup_i1} onMouseOver={popup_highlight_1} onMouseOut={popup_unhighlight_1}><FiHelpCircle className='profile_popup_icons'></FiHelpCircle></td>
                    </tr>
                    <tr className='navlogin_profile_popup'>
                        <td ref={popup_t2} onMouseOver={popup_highlight_2} onMouseOut={popup_unhighlight_2} className='profile_popup_titles' onClick={showPS} >הגדרות</td>
                        <td ref={popup_i2} onMouseOver={popup_highlight_2} onMouseOut={popup_unhighlight_2} onClick={showPS}><FiSettings className='profile_popup_icons'></FiSettings></td>
                    </tr>
                    <tr className='navlogin_profile_popup'>
                        <td><Link ref={popup_t3} onMouseOver={popup_highlight_3} onMouseOut={popup_unhighlight_3} className='profile_popup_titles' to='/404'>צור קשר</Link></td>
                        <td ref={popup_i3} onMouseOver={popup_highlight_3} onMouseOut={popup_unhighlight_3}><FaRegEnvelope className='profile_popup_icons'></FaRegEnvelope></td>
                    </tr>
                    <tr >
                        <td ref={popup_t4} onMouseOver={popup_highlight_4} onMouseOut={popup_unhighlight_4} className='profile_popup_titles' onClick={disconnect}>התנתקות</td>
                        <td ref={popup_i4} onMouseOver={popup_highlight_4} onMouseOut={popup_unhighlight_4}><FiLogOut className='profile_popup_icons'></FiLogOut></td>
                    </tr>
                </table>
            </div>
            <ul className="nav_list">
                <li><Link to="/my-lessons" className="nav_list_pc">השיעורים שלי</Link></li>
                <li className='navlogin_secondfield'><Link to="/404" className="nav_list_pc">עזרה</Link></li>
            </ul>
            <Link to='/'><img width={200} height={75} className="nav_logo" alt="logo" src="https://cdn.logojoy.com/wp-content/uploads/2017/08/freelogodesign2@2x.png"></img></Link>
            <ProfileSettings placeholder_username={ud_username} placeholder_phone={ud_phone} placeholder_email={ud_email} user_image={ud_picture} isTeacher={ud_isTeacher}/>
        </div>
        )
    }
    else {
        return (
            <div className="navbar">
                <Link to="/login"><button className="nav_login">התחברות</button></Link>
                <Link to="/sign-up-authentication"><button className="nav_signup"> הרשמה</button></Link>
                <ul className="nav_list">
                    <li><Link to='/404' className="nav_list_pc">עזרה</Link></li>
                </ul>
                <Link to='/'><img width={200} height={75} className="nav_logo" alt="logo" src="https://cdn.logojoy.com/wp-content/uploads/2017/08/freelogodesign2@2x.png"></img></Link>
            </div>
        )
    }
}

export default NavLogin