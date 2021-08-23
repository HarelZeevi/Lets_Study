import './Navbar.css';
//import { GiHamburgerMenu } from 'react-icons/gi';

function Navbar()
{
    return (
        <div className="navbar">
            <button className="nav_login">התחברות</button>
            <button className="nav_signup">הרשמה</button>
            <ul className="nav_list">
              <li><a className="nav_list_pc">עזרה</a></li>
            </ul>
            <img width={200} height={75} className="nav_logo" src="https://cdn.logojoy.com/wp-content/uploads/2017/08/freelogodesign2@2x.png"></img>
        </div>
    )
}
export default Navbar