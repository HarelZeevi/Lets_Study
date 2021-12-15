import React, { useState } from 'react';
import '../Styles/JitsiMeet.css';
import { Jutsu } from 'react-jutsu';
import { BiWindows } from 'react-icons/bi';
const JitsiMeet = () => {
  const [room, setRoom] = useState('') // "LetsStudy_biology_194z72d83D72DF"
  const [name, setName] = useState('') // "Ido Abrahami"
  const [password, setPassword] = useState('') // "1928"
  const [call, setCall] = useState(false) // the code "setCall(true) to start the meeting (ONLY AFTER ROOM, NAME AND PASSWORD ARE UPDATED!)"

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
        width= {window.innerWidth-100}
        height = {window.innerHeight-200}
        onMeetingEnd={() => console.log('Meeting has ended')}
        loadingComponent={<p dir='rtl'>הפגישה בטעינה...</p>} />) :
        (
            <div></div>
        )}
    </div>
  )
}

export default JitsiMeet
