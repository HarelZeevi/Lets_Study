import { Link } from 'react-router-dom';
import '../Styles/footer.css';
import { BiCopyright } from 'react-icons/bi';
function Footer() {
    return (
        <div className='footer_box'>
            <img width={350} height={130} className="footer_logo" src="https://cdn.logojoy.com/wp-content/uploads/2017/08/freelogodesign2@2x.png"></img>
            <div className='footer_pagelist_wrapper'>
                <ul className='footer_pagelist' dir='rtl'>
                    <li>
                        <Link><button className='pagelist_titles'>צור קשר</button></Link>
                    </li>
                    <li>
                        <Link><button className='pagelist_titles'>מי אנחנו</button></Link>
                    </li>
                    <li>
                        <Link><button className='pagelist_titles'>קניית מנוי</button></Link>
                    </li>
                    <li>
                        <Link><button className='pagelist_titles'>שאלות נפוצות</button></Link>
                    </li>
                </ul>
            </div>
            <div className='footer_socials'>
                <div className='footer_social1'>
                    <a href='#' target='_blank'>{/* Facebook Logo*/}</a>
                </div>
                <div className='footer_social2'>
                    <a href='#' target='_blank'>{/* YoutubeLogo*/}</a>
                </div>
                <div className='footer_social3'>
                    <a href='#' target='_blank'>{/* Instagram Logo*/}</a>
                </div>
            </div>
            <div className='footer_legalbox'>
                <ul dir='rtl'>
                    <li className='footer_legalfields'>
                        <Link><button className='legalfields_btn'>מדיניות פרטיות</button></Link>
                    </li>
                    <li className='footer_legalfields'>
                        <Link><button className='legalfields_btn'>2021 <BiCopyright></BiCopyright></button></Link>
                    </li>
                    <li className='footer_legalfields'>
                        <Link><button className='legalfields_btn'>תנאי שירות</button></Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Footer;