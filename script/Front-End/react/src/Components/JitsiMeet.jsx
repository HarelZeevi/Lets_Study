import React, { useEffect, useState } from 'react';
import '../Styles/JitsiMeet.css';
import { Jutsu } from 'react-jutsu';
import { BiWindows } from 'react-icons/bi';




const JitsiMeet = () => {

  const [room, setRoom] = useState('[ROOM ID]') // "LetsStudy_biology_194z72d83D72DF"
  const [name, setName] = useState('הכנס שם') // "Ido Abrahami"
  const [password, setPassword] = useState('') // "1928"
  const [call, setCall] = useState(false) // the code "setCall(true) to start the meeting (ONLY AFTER ROOM, NAME AND PASSWORD ARE UPDATED!)"

  async function getJitsiDetails(params, callback) {
    var xhr = new XMLHttpRequest();
    const url = 'http://localhost:1234/api/getJitsiDetails/';
  
    xhr.open('POST', url, true);
    let token = localStorage.getItem("token");
    xhr.setRequestHeader("authorization", token);
    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        callback(xhr.responseText)
      }
    }
  
    // CONVERTING OBJECT PARAMS TO ENCODED STRING
    let urlEncodedData = "", urlEncodedDataPairs = [], name;
    for (name in params) {
      urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]));
    }
    alert(urlEncodedDataPairs.join("&"));
    xhr.send(urlEncodedDataPairs.join("&"));
  }
  
  function setDetails(res){
    let resObj = JSON.parse(res)[0];
    console.log("room: " + resObj.room + ", name: " + resObj.fullname + ", pswd: " + resObj.roomPswd);
    console.log(resObj.room);
    setRoom(resObj.room)
    setName(resObj.fullname);
    setPassword(resObj.roomPswd);
    console.log("room: " + resObj.room + ", name: " + resObj.fullname + ", pswd: " + resObj.roomPswd);
    //console.log("Params inside of function:");

  }
 
  useEffect(() => {
    getJitsiDetails({ lessonId: 27}, (res) => {
      if (res === "Not found") {
        alert("No lesson was found for this user...")
      }
      else {
        setDetails(res);
        setCall(true);
      }
    });
  }, []);

  //console.log("Params out of function:")
  //console.log("room: " + room + ", name: " + name + ", pswd: " + password);
  /*

  Example:
    setRoom("idoAbrahamiRoom");
    setName("HarelZeevi");
    setPassword("1234567");
    setCall(true);
  */

  /* Harel - here you add the integration function that
  receives the room name (should be a random 20+ letter name or maybe the teacher's id or something),
  the room password (which will also be showed on the screen for the user's comfortability)
  and also the display name which is the full name or the username of the user.

  IMPORTANT:
  Both teacher and student need to have the SAME roomName and password. This is like a zoom link and a password to that zoom meeting.
  each one of them should have THEIR OWN displayName - which is their username or full name.

  SUPER IMPORTANT:
  In order to update the roomName, password and displayName, use the usestates from lines 6-8.
  AFTER YOU FINISH UPDATING THE USESTATES, CALL THE FUNCTION startMeeting() !!!!!!
  */
  return (
    <div className='JitsiFrame'>
      {call ? (<Jutsu id='JitsiMeeting'
        roomName={room}
        password={password}
        displayName={name}
        width={window.innerWidth - 100}
        height={window.innerHeight - 200}
        onMeetingEnd={() => console.log('Meeting has ended')}
        loadingComponent={<p dir='rtl'>הפגישה בטעינה...</p>} />) :
        (
          <div></div>
        )}
    </div>
  )
}

export default JitsiMeet
