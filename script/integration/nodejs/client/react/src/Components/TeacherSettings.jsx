import React, {useRef, useState, useEffect} from 'react';
import '../Styles/TeacherSettings.css';
import { FaRegFileAlt } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
function TeacherSettings(props) {

    const [sub1_visiblity, set_sub1_visiblity] = useState('block');
    const [sub2_visiblity, set_sub2_visiblity] = useState('block');
    const [sub3_visiblity, set_sub3_visiblity] = useState('block');
    const [sub4_visiblity, set_sub4_visiblity] = useState('block');
    const [addSubTitle, setSubTitle] = useState('none');

    const isTeacher = props.isTeacher;
    const subjectNames = [
        '',
        'אזרחות',
        'אנגלית',
        'ביולוגיה',
        'דינים',
        'היסטוריה',
        'הנדסת תוכנה - אנדרואיד',
        'הנדסת תוכנה - סייבר',
        'הנדסת תוכנה - שירותי רשת',
        'כימיה',
        'לשון',
        'מדעי המחשב',
        'מחשבת ישראל',
        'מתמטיקה',
        'ספרות',
        'ערבית',
        'פיזיקה',
        'תלמוד',
        'תנ"ך'
    ]
    // Add a function that receives the object with the subjects array here (you said its called "getsubject")
    let subjects = [3,2,null, null];
    useEffect(() => {
        let currentIndex = 0;
        subjects.map(
            subject => {
            currentIndex++;
            if(subject===null)
            {
                setSubTitle('block');
                switch(currentIndex)
                {
                    case 1:
                        set_sub1_visiblity('none');
                        break;
                    case 2:
                        set_sub2_visiblity('none');
                        break;
                    case 3: 
                        set_sub3_visiblity('none');
                        break;
                    case 4: 
                        set_sub4_visiblity('none');
                        break;
                }

            }
        }
    )   
    }, []);
    let currentSubjectIndex = 0;
    function closeSubject(e)
    {
        const index = parseInt(e.target.id[8]);
        switch(index)
        {
            case 1:
                subjects[0]=null;
                set_sub1_visiblity('none');
                break;
            case 2:
                subjects[1]=null;
                set_sub2_visiblity('none');
                break;
            case 3:
                subjects[2]=null;
                set_sub3_visiblity('none');
                break;
            case 4:
                subjects[3]=null;
                set_sub4_visiblity('none');
                break;
        }
        // HAREL - UPDATE AFTER THE REMOVAL OF A SPECIFIC SUBJECT HERE (the array's name is subjects[])
    }

    if(isTeacher) // isTeacher
    {
        props.setPSHeight(550)
        return(
            <div>
                <h3 dir='rtl'>מקצועות לימוד:</h3>
                {
                    subjects.map(
                        subject=> {
                            currentSubjectIndex++;
                            switch(currentSubjectIndex)
                            {
                                case 1:
                                    return(
                                        <div style={{display: sub1_visiblity}}className='TeacherSettings_CurrentSubDivs'>
                                            <MdClose id='TS_Cell_1' onClick={closeSubject} className='TeacherSettings_SubDiv_Close'/>{subjectNames[subject]}<FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                                        </div>
                                    )
                                case 2:
                                    return(
                                        <div style={{display: sub2_visiblity}} className='TeacherSettings_CurrentSubDivs'>
                                            <MdClose id='TS_Cell_2' onClick={closeSubject} className='TeacherSettings_SubDiv_Close'/>{subjectNames[subject]}<FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                                        </div>
                                    )
                                case 3:
                                    return(
                                        <div style={{display: sub3_visiblity}} className='TeacherSettings_CurrentSubDivs'>
                                            <MdClose id='TS_Cell_3' onClick={closeSubject} className='TeacherSettings_SubDiv_Close'/>{subjectNames[subject]}<FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                                        </div>
                                    )
                                case 4:
                                    return(
                                        <div>
                                            <div style={{display: sub4_visiblity}} className='TeacherSettings_CurrentSubDivs'>
                                                <MdClose id='TS_Cell_4' onClick={closeSubject} className='TeacherSettings_SubDiv_Close'/>{subjectNames[subject]}<FaRegFileAlt className='TeacherSettings_SubDiv_SubIcon'/>
                                            </div>
                                            <p style={{display: addSubTitle}} dir='rtl' className='TeacherSettings_AddSubjectButton'>הוסף מקצוע...</p>
                                        </div>
                                    )
                            }

                        }
                    )
                }
                {/* <input list='subject1_list'/>
                <datalist id='subject1_list'>
                    <option value='בחר מקצוע...' dir='rtl'></option>
                    <option value='מתמטיקה' dir='rtl'></option>
                    <option value='אנגלית' dir='rtl'></option>
                    <option value='תנ"ך' dir='rtl'></option>
                    <option value='ספרות' dir='rtl'></option>
                    <option value='מדעי המחשב' dir='rtl'></option>
                    <option value='היסטוריה' dir='rtl'></option>
                    <option value='לשון' dir='rtl'></option>
                    <option value='כימיה' dir='rtl'></option>
                    <option value='פיזיקה' dir='rtl'></option>
                    <option value='ביולוגיה' dir='rtl'></option>
                    <option value='הנדסת תוכנה - סייבר' dir='rtl'></option>
                    <option value='הנדסת תוכנה - אנדרואיד' dir='rtl'></option>
                    <option value='הנדסת תוכנה - שירותי רשת' dir='rtl'></option>
                    <option value='ערבית' dir='rtl'></option>
                </datalist> */}
            </div>

        )
        
    }
    else {
        return(
            <div></div>
        )
    }
}
export default TeacherSettings;