/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Pagination from '../Components/Pagination';
import FirstLoginCta from "../Components/FirstLoginCta";
import "../Styles/mylessons.css";
import { AiFillStar } from "react-icons/ai";
// import { useRouteMatch } from 'react-router';
// import { GiConsoleController } from 'react-icons/gi';
import { allLessons } from "../localdb/allLessons";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { chartColors } from "../localdb/color";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);
// this function doesn't get ny parameters. it will change the two arrays:
// upcoming - contain the upcoming lessons of the user
// tookPlace - contain the lessons of the user which have already took place in the past.
async function fetchLessons(callback) {
  var xhr = new XMLHttpRequest();
  const url = "http://localhost:1234/api/lessons/";

  xhr.open("POST", url);
  let token = localStorage.getItem("token");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callback(xhr.responseText);
    }
  };
  //harel
  xhr.setRequestHeader("authorization", token);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(null);
}

function MyLessons() {
  //const [teachersData, setTeachersData] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [tookPlace, setTookPlace] = useState([]);

  useEffect(() => {
    let mount = true;

    if (mount) sortingLessons();
    return () => {
      mount = false;
    };
  }, []);
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };
  const data = {
    labels: ["subjectA", "subjectB", "subjectC", "subjectD"],
    datasets: [
      {
        data: [300, 50, 100, 50],
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors,
      },
    ],
  };
  const sortingLessons = () => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      //true is untill the local storage will work
      fetchLessons((res) => {
        // initialize 2 arrays
        var upcomingLocal = [];
        var tookPlaceLocal = [];
        const objData = JSON.parse(res);
        console.table(objData);

        // splitting the data between the arrays according to the 'availableDate'
        let current = new Date();

        objData.forEach((item) => {
          if (
            new Date(item.availabledate.substring(0, 10)) > current ||
            (item.availabledate === current && current.getTime() > item.endtime)
          )
            upcomingLocal.push(item);
          else tookPlaceLocal.push(item);
        });

        console.log(upcomingLocal);
        console.log(tookPlaceLocal);

        // set the use state variables
        setUpcoming(upcomingLocal);
        setTookPlace(tookPlaceLocal);

        console.table(upcoming);
        console.table(tookPlace);
      });
      /*
      const date = new Date();
      allLessons.map((lesson) => {
        let test = lesson.availabledate;
        var TodayBeforeLesson = moment(date).isBefore(test); // false
        TodayBeforeLesson ? upcoming1.push(lesson) : tookPlace1.push(lesson);
      });
      setTookPlace(tookPlace1);
      setUpcoming(upcoming1);
      console.log(upcoming);
      console.log(tookPlace);
    }
    */
    } else console.error("User not authenticated..");
  };

  return (
    <div dir="rtl">
      <FirstLoginCta />
      {upcoming.map((lesson) => (
        <div className="myteacher-container">
          <img
            className="tc_teacherimage"
            alt="the teacher's profile picture"
            src="data:image/png;base64,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"
          />
          <h1 className="tc_name"> {lesson.fullname}</h1>
          <div dir="rtl" className="">
            {lesson.subjectname}
          </div>
          <div className="myteacher_infofields">
            {lesson.starttime.replace("00:00", "00")} <br />
            {new Date(lesson.availabledate)
              .toLocaleString("he", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(",", "")
              .replaceAll(".", "/")}
          </div>
          <button className="mylessons_deeplinker" onClick={() => { }}>
            {" "}
            עריכת שיעור{" "}
          </button>
        </div>
      ))}

      <br />
      <br />
      <br />
      <br />

      {tookPlace.map((lesson) => (
        <div className="myteacher-container">
          <img
            className="tc_teacherimage"
            alt="the teacher's profile picture"
            src="data:image/png;base64,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"
          />
          <h1 className="tc_name"> {lesson.fullname}</h1>
          <div dir="rtl" className="">
            {lesson.subjectname}
          </div>
          <div className="myteacher_infofields">
            {lesson.starttime.replace("00:00", "00")} <br />
            {new Date(lesson.availabledate)
              .toLocaleString("he", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(",", "")
              .replaceAll(".", "/")}
          </div>
          <button className="mylessons_deeplinker2" onClick={() => { }}>
            {" "}
            קבע שיעור נוסף{" "}
          </button>
        </div>
      ))}
      <div className="mylessons-left-side">
        <div className="mylessons-button">
          <button className="new-lessons-button">קבע שיעור חדש</button>
        </div>
        <div className="mylessons-chart-container"></div>
        <Doughnut data={data} options={options} className="mylessons-chart" />
        <div id="legend" />
      </div>
    </div>
  );
}

export default MyLessons;
