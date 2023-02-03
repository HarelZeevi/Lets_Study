import React, { useState } from 'react';
import { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimePicker from './TimePicker';

const getAvailableTimes = (params, callback) => {
  var xhr = new XMLHttpRequest();
  const url = 'http://localhost:1234/api/getAvailability/';
    
  xhr.open("POST", url);
  let token = localStorage.getItem("token");
  
  xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          callback(xhr.responseText)
      }
  }
  
  // CONVERTING OBJECT PARAMS TO ENCODED STRING
  let urlEncodedData = "", urlEncodedDataPairs = [], name;
  for(name in params) {
  urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
  }
  xhr.setRequestHeader("authorization", token);
  xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
  xhr.send(urlEncodedDataPairs.join("&"));
}

export default function DatePicker() {
  const [date, setDate] = useState(new Date());
  const [times, setTimes] = useState([]);
	
  useEffect(()=> {
    let mount = true;
    if (mount){
      getAvailableTimes({tutorId:"123456789"}, (res)=>{
        setTimes(JSON.parse(res));
        console.log(times);
        // let selected = new Date(times[0].availabledate)
        // selected.setDate(selected.getDate() - 1)
        // setBookingDate(selected);
      })
    }
    return () => mount = false;
  }, [])
  


  const showTimes = (date) =>
  {
    setDate(date);
  }
  return (
    <div style={{display: 'flex'}, {flexDirection: 'row'}}>
      <TimePicker listTimes={times} pickedDate={date}/>

      <Calendar onChange={showTimes} value={date} />
    </div>
  );
}
