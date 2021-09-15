import '../Styles/NavLogin.css';
import '../Styles/Navbar.css';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaRegEnvelope } from 'react-icons/fa';
import { useRef } from 'react';
import { FiLogOut, FiSettings, FiHelpCircle, FiX } from 'react-icons/fi';


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


function NavLogin() {
    const profile_username = useRef();
    const profile_arrow = useRef();
    const profile_popup = useRef();
    let popup_revealed = false;

    // i = icon, t = title
    const popup_i1 = useRef(); 
    const popup_t1 = useRef(); 
    const popup_i2 = useRef();
    const popup_t2 = useRef();
    const popup_i3 = useRef();
    const popup_t3 = useRef();
    const popup_i4 = useRef();
    const popup_t4 = useRef();

    // IDO here you add the integration details. Here we call the function and know weather the user is loggedIn or not.
    function navbarSubmit()
    {
        navGetDetails((res) => {
            if (res.status === 403)
                {
                console.log('Not logged In') // replace with navber real reaction
                }
            else    
                {
                    console.log(JSON.parse(res.responseText)) // username and image json obj                    
                }
        })
    }

    function profile_hover() {
        profile_username.current.style.color = 'rgb(66, 168, 66)';
        profile_arrow.current.style.color = 'rgb(66, 168, 66)';
    }
    function profile_outhover() {
        profile_username.current.style.color = '#000';
        profile_arrow.current.style.color = '#000';
    }
    function profile_popup_reveal() {
        if(popup_revealed) {
            profile_popup.current.style.display = 'none';
            popup_revealed = false;
        }
        else {
            profile_popup.current.style.display = 'block';
            popup_revealed = true;
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
    return (
        <div className="navbar">
            <ul className='nav_profile' onMouseOver={profile_hover} onMouseOut={profile_outhover}>
                <li><img src="https://images.squarespace-cdn.com/content/v1/559b2478e4b05d22b1e75b2d/1545073697675-3728MXUJFYMLYOT2SKAA/Nesbit.jpg" onClick={profile_popup_reveal} className='nav_pfp'></img></li>
                <li ref={profile_username} className='nav_profile_username_li' onClick={profile_popup_reveal}><span className='nav_username'>Idoabr</span></li>
                <li ref={profile_arrow} className='nav_profile_arrow_li' onClick={profile_popup_reveal}><FaAngleDown className='nav_profile_arrow'></FaAngleDown></li>
            </ul>
            <div ref={profile_popup} className='nav_profile_popup'>
                <FiX onClick={profile_popup_reveal} className='profile_popup_close'></FiX>
                <table className='profile_popup_menu'>
                    <tr>
                        <td className='profile_title'>פרופיל</td>
                    </tr>
                    <hr className='profile_hr'></hr>
                    <tr>
                        <td ref={popup_t1} onMouseOver={popup_highlight_1} onMouseOut={popup_unhighlight_1} className='profile_popup_titles'>עזרה</td>
                        <td ref={popup_i1} onMouseOver={popup_highlight_1} onMouseOut={popup_unhighlight_1}><FiHelpCircle className='profile_popup_icons'></FiHelpCircle></td>
                    </tr>
                    <tr>
                        <td ref={popup_t2} onMouseOver={popup_highlight_2} onMouseOut={popup_unhighlight_2} className='profile_popup_titles'>הגדרות</td>
                        <td ref={popup_i2} onMouseOver={popup_highlight_2} onMouseOut={popup_unhighlight_2}><FiSettings className='profile_popup_icons'></FiSettings></td>
                    </tr>
                    <tr>
                        <td ref={popup_t3} onMouseOver={popup_highlight_3} onMouseOut={popup_unhighlight_3} className='profile_popup_titles'>צור קשר</td>
                        <td ref={popup_i3} onMouseOver={popup_highlight_3} onMouseOut={popup_unhighlight_3}><FaRegEnvelope className='profile_popup_icons'></FaRegEnvelope></td>
                    </tr>
                    <tr>
                        <td ref={popup_t4} onMouseOver={popup_highlight_4} onMouseOut={popup_unhighlight_4} className='profile_popup_titles'>התנתקות</td>
                        <td ref={popup_i4} onMouseOver={popup_highlight_4} onMouseOut={popup_unhighlight_4}><FiLogOut className='profile_popup_icons'></FiLogOut></td>
                    </tr>
                </table>
            </div>
            <ul className="nav_list">
                <li><Link to="/login" className="nav_list_pc">השיעורים שלי</Link></li>
                <li><Link to="/sign-up-authentication" className="nav_list_pc">עזרה</Link></li>
            </ul>
            <img width={200} height={75} className="nav_logo" src="https://cdn.logojoy.com/wp-content/uploads/2017/08/freelogodesign2@2x.png"></img>
        </div>
    )
}

export default NavLogin