import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import mainlogo from '../Images/LetsStudyLogo.png';
//import { GiHamburgerMenu } from 'react-icons/gi';

function Navbar() {
    return (
        <div className="navbar">
            <Link to="/login"><button className="nav_login">התחברות</button></Link>
            <Link to="/sign-up-authentication"><button className="nav_signup"> הרשמה</button></Link>
            
            <ul className="nav_list">
                <li><Link to='/help' className="nav_list_pc">עזרה</Link></li>
            </ul>
            
            <img height={125} className="nav_logo" src={mainlogo}></img>
        </div>
    )
}
export default Navbar