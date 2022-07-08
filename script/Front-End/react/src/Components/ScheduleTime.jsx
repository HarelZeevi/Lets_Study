import { Calendar } from "@progress/kendo-react-dateinputs";
import { useEffect, useRef, useState } from "react";
import "../Styles/ScheduleTime.css"

// list of available time given from the server
// Fo this example they will be hard-coded



const mark = ["04-03-2020", "03-03-2020", "05-08-2022"];
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

const pickSlotTimes = (times, bookingDate) => {
  let timesPicked = [];

  bookingDate = new Date(bookingDate).setDate(
    new Date(bookingDate).getDate() + 1
  );

  bookingDate = new Date(bookingDate).toISOString().split("T")[0];
  console.log(bookingDate);

  times.map((timeSlot) => {
    // maping over each time slot

    // check if it's date matches the clicked date cube
    let tsDate = new Date(timeSlot.availabledate).toISOString().slice(0, 10);

    console.log(tsDate);
    //console.log(bookingDate.getUTCDate())
    if (tsDate == bookingDate) {
      // building a string for the time presented on screen
      let start = timeSlot.starttime.replace(":00:00", ":00");
      let stTime = start + " : " + timeSlot.endtime.replace(":00:00", ":00");
      timesPicked.push(stTime);
    }
  });

  // We need to sort the times, as they may not be in a correct order
  return timesPicked;
};



const ScheduleTime = (props) => {

  const [times, setTimes] = useState([]);
  const [bookingDate, setBookingDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingTimes, setBookingTimes] = useState([]);
  const timeSlotCacheRef = useRef(new Map());


  useEffect(()=> {
    let mount = true;
    if (mount){
      getAvailableTimes({tutorId:"254638563"}, (res)=>{
        setTimes(JSON.parse(res));
        console.log(times);
        // let selected = new Date(times[0].availabledate)
        // selected.setDate(selected.getDate() - 1)
        // setBookingDate(selected);
      })
    }
    return () => mount = false;
  }, [])



  useEffect(() => {
    // Bail out if there is no date selected
    console.log(bookingDate)
    if (bookingDate == null || times.length == 0) return;

      // Get time slots from cache
      let newBookingTimes = timeSlotCacheRef.current.get(
        bookingDate.toDateString()
      );
      // If we have no cached time slots then pick new ones
      if (!newBookingTimes) {
        newBookingTimes = pickSlotTimes(times, bookingDate);
        // Update cache with new time slots for the selected date
        timeSlotCacheRef.current.set(bookingDate.toDateString(), newBookingTimes);
      }

      setBookingTimes(newBookingTimes);
  }, [bookingDate]);

  
  const onDateChange = (e) => {
    setSelectedTimeSlot(null);
    setBookingDate(e.value); 
  };

    return (
        <div className="k-my-8">

          <div className="k-flex k-display-flex k-mb-4">
            {times.length != 0 ? (
            <Calendar
              focusedDate={new Date(times[0].availabledate)}
              style={{ height: 1500, backgroundColor: "red" }}
              value={bookingDate}
              onChange={onDateChange}

              tileDisabled={({ date }) => date.getDay() === 0}
              max={new Date(2025, 1, 0)}
              min={new Date()}
            />) : null}

            
            {times.length != 0 ? (
            <div className="k-ml-4 k-display-flex k-flex-col">
              {bookingTimes.map((time) => {
                return (
                  <button
                    key={time}
                    className="k-button k-mb-4"
                    onClick={(e) => setSelectedTimeSlot(time)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            ): null}
          </div>

          {bookingDate && selectedTimeSlot && times.length != 0 ? (
            <div>
              Selected slot: {bookingDate.toDateString()} at {selectedTimeSlot}
            </div>
          ) : null}
        </div>
      );
};

export default ScheduleTime;
