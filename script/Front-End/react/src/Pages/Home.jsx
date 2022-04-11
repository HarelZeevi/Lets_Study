import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../Styles/home.css';
import Footer from '../Components/Footer.jsx';
export default function Home() {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return(
        <div className="homepage" dir="rtl">
            <div className="homepage_header">
                <div data-aos='zoom-in' className='homepage_header_textfield' dir='rtl'>
                    <h1 className='header_title'>נמאס לכם לשלם על שיעורים פרטיים?</h1>
                    <h3 className='header_text'>
                        ב-LetsStudy תוכלו להירשם ולהיכנס לשיעורים
                        <br></br>
                        פרטיים בקלות ובמהירות, דרך בית הספר,
                        <br></br>
                        מכל מקום ולגמרי בחינם!
                    </h3>
                </div>
                <div className='homepage_header_1' >
                    <img className='homepage_header_illustrations' alt="checkmark icon" src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Eo_circle_green_white_checkmark.svg/2048px-Eo_circle_green_white_checkmark.svg.png'></img>
                    <h1>מצליחים</h1>
                    <hr className='header_box_hr'></hr>
                    <p>
                        לומדים ביחד ומצליחים בבחינות
                    </p>
                </div>
                <div className='homepage_header_2'>
                    <img className='homepage_header_illustrations' alt="calendar icon" src='https://image.flaticon.com/icons/png/512/470/470326.png'></img>
                    <h1>קובעים שיעור</h1>
                    <hr className='header_box_hr'></hr>
                    <p>
                        בוחרים מורה ומתאמים שיעור
                    </p>
                </div>
                <div className='homepage_header_3'>
                    <img className='homepage_header_illustrations' alt="envelope icon" src='https://www.freeiconspng.com/images/calendar-image-png'></img>
                    <h1>נרשמים</h1>
                    <hr className='header_box_hr'></hr>
                    <p>
                        נרשמים למערכת 
                        <br></br>
                        דרך בית הספר
                    </p>
                </div>
            </div>
            <div className='home_midbanner'>
                <img className='home_midbanner_illustration' alt="girl working on a laptop illustration" src='https://cdni.iconscout.com/illustration/free/thumb/girl-work-on-laptop-1792788-1519329.png'></img>
                <div className='home_midbanner_textfield' dir='rtl'>
                    <h1>אצלנו כולם מרוויחים!</h1>
                    <p>
                    בית הספר נותן לתלמידיו כלי נוסף להצלחה ובמחיר מועט, התלמידים לומדים בשיעורים
                    <br></br>
                     פרטיים לגמרי בחינם, ותהיה לתלמידי בית הספר אפשרות להתנדב ולקבל 
                    <br></br>
                      שעות מחויבות אישית במקום הכי מתאים להם!
                    </p>
                    <Link className='home_midbanner_readmore' to='/404'>קרא עוד...</Link> {/*add link to about us page */ }
                </div>
                <div>
                <Link className='home_midbanner_ctalink' to='/sign-up-authentication'><button className='home_midbanner_cta'>להרשמה</button></Link>
                </div>
            </div>
            <div className='home_reviewsection'>
                <div data-aos='fade' data-aos-delay='600' className='home_reviews home_review1'>
                    <img className='review_user_logos' alt="a reviewer's profile picture" src='https://pbs.twimg.com/profile_images/3478244961/01ebfc40ecc194a2abc81e82ab877af4_400x400.jpeg'></img>
                    <br></br>
                    <FaQuoteRight className='reviews_quotes_top'></FaQuoteRight>
                    <p className='reviews_text'>
                        בזכות השיעורים שיפרתי 
                        <br></br>את הציונים שלי והמשכתי 
                        <br></br>במסלול 5 יח"ל במתמטיקה 
                    </p>
                    <FaQuoteLeft className='reviews_quotes_bottom'></FaQuoteLeft>
                </div>
                <div data-aos='fade' data-aos-delay='300' className='home_reviews home_review2'>
                    <img className='review_user_logos' alt="a reviewer's profile picture" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLsA425kPvBBTmuQ89VQmq_sRih5hCb8sokg'></img>
                    <br></br>
                    <FaQuoteRight className='reviews_quotes_top'></FaQuoteRight>
                    <p className='reviews_text'>העובדה שהמורים הם תלמידים בדיוק
                        <br></br>
                         כמוני עזרה לי להבין את החומר
                         <br></br> טוב יותר מהשיעור בבית הספר</p>
                    <FaQuoteLeft className='reviews_quotes_bottom'></FaQuoteLeft>
                </div>
                <div data-aos='fade' className='home_reviews home_review3'>
                    <img className='review_user_logos' alt="a reviewer's profile picture" src='https://d.newsweek.com/en/full/1092536/gal-gadot.jpg?w=1600&h=1600&q=88&f=b33ab1a921459769ef5a5d7afccaa103'></img>
                    <br></br>
                    <FaQuoteRight className='reviews_quotes_top'></FaQuoteRight>
                         <p className='reviews_text'>
                        המנוי שבית הספר הביא לי
                        <br></br>
                         עזר לי מאוד וקידם אותי 
                         <br></br>לימודית לקראת הבגרויות 
                        </p> 
                    <FaQuoteLeft className='reviews_quotes_bottom'></FaQuoteLeft>
                </div>
            </div>
            <Footer footertop='1150'/>
        </div>
    )
    
}
