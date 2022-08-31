import React from "react";
import { Routes, Route } from "react-router-dom";
import ForgotPassword1 from "./Components/ForgotPassword1.jsx";
import ForgotPassword2 from "./Components/ForgotPassword2.jsx";
import ForgotPassword3 from "./Components/ForgotPassword3.jsx";
import Login from "./Components/Login.jsx";
import Home from "./Pages/Home.jsx";
import Signup from "./Components/Signup.jsx";
// import Navbar from './Components/Navbar.jsx';
import SignupAuth from "./Components/SignupAuth.jsx";
import Lessons from "./Pages/Lessons.jsx";
import MyLessons from "./Pages/MyLessons";
// import Footer from "./Components/Footer.jsx";
// import ProfileSettings from './Components/ProfileSettings.jsx';
import "../src/Styles/app.css";
import NavLogin from "./Components/NavLogin.jsx";
// import ProtectedRoute from "./Components/ProtectedRoutes.jsx";
import NotFound from "./Pages/NotFound.jsx";
import JitsiMeet from "./Components/JitsiMeet.jsx";
export function App() {
  return (
    <div className="app">
      <NavLogin />
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<SignupAuth />} path="/sign-up-authentication" />
        <Route element={<Signup />} path="/sign-up" />
        <Route
          element={<ForgotPassword1 />}
          path="/forgot-password-email"
        />{" "}
        {/*1*/}
        <Route element={<ForgotPassword2 />} path="/forgot-password-verify" />
        {/*2*/}
        <Route
          element={<ForgotPassword3 />}
          path="/forgot-password-new-password"
        />{" "}
        {/*3*/}
        {/* <ProtectedRoute element={Lessons} path="/lessons" /> */}
        <Route element={<Lessons />} path="/lessons" />
        <Route element={<MyLessons />} path="/my-lessons" />
        <Route element={<Home />} exact path="/" />
        {/*TEST SECTION*/}
        <Route element={<JitsiMeet />} path="/meeting" />
        <Route element={<NotFound />} path="/*" /> 
      </Routes>
    </div>
  );
}
