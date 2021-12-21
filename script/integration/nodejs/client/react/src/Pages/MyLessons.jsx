import React, { useState, useRef,useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
// import Pagination from '../Components/Pagination';
import FirstLoginCta from '../Components/FirstLoginCta';
import "../Styles/mylessons.css"
import { AiFillStar } from 'react-icons/ai';
import { useRouteMatch } from 'react-router';
import { GiConsoleController } from 'react-icons/gi';


async function fetchTeachers(callback){
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/lessons/'; 
        
    xhr.open("POST", url);
    let token = localStorage.getItem("token");
    
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(xhr.responseText)
        }
    }
    
    xhr.setRequestHeader("authorization", token);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.send(null);
}

function MyLessons()
{
    const [teachersData,setTeachersData] = useState([]);
    useEffect(() => {
        let mount = true;
          const renderTeachers = async ()=>{
              const data=await axios.get(`/TeacherService.json`);
              setTeachersData(data.data);
           }
           if(mount) renderTeachers();
           return ()=>{mount = false}
      
      }, [])
    let objData;
    let upcomming = [];
    let tookPlace = [];
    fetchTeachers((res) => {
        
        objData = JSON.parse(res);
        objData.forEach((item) => {
            let current = new Date();
            if (new Date(item.availabledate.substring(0, 10)) > current || (item.availabledate === current && current.getTime() > item.endtime))
                upcomming.push(item);
            else
                tookPlace.push(item);
        })
        if (res != null)       
        { 
            console.log(objData);
            console.log(upcomming);
            console.log(tookPlace);
        }
    });

    const isFuture = ()=>{
        let date = new Date(teachersData.map(teacher=>teacher.date));
        // (date.getFullYear() > )
    } 
    return (
        
        <div dir="rtl">
            <FirstLoginCta />
        </div>
    )
}

export default MyLessons;