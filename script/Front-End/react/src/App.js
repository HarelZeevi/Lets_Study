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
import ProtectedRoute from "./Components/ProtectedRoutes.jsx";
import NotFound from "./Pages/NotFound.jsx";
import Help from "./Pages/Help";
import ContactUs from "./Pages/ContactUs.jsx";
import JitsiMeet from "./Components/JitsiMeet.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import FAQ from "./Pages/FAQ.jsx";

export function App() {
  return (
    <div className="app">
      <NavLogin />
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<SignupAuth />} path="/sign-up-authentication" />
        <Route element={<Signup />} path="/sign-up" />
        <Route element={<ForgotPassword1 />} path="/forgot-password-email" />
        <Route element={<ForgotPassword2 />} path="/forgot-password-verify" />
        <Route element={<ForgotPassword3 />} path="/forgot-password-new-password"/>
        <Route element={<Help />} path="/help" />
        <Route element={<ContactUs />} path="/contact" />
        <Route element={<AboutUs />} path="/about" />
        <Route element={<FAQ />} path="/faq" />


        {/* PROTECTED ROUTES */}
        <Route
          path="/lessons"
          element={
            <ProtectedRoute element={<Lessons/>} path="/lessons">
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-lessons"
          element={
            <ProtectedRoute element={<MyLessons/>} path="/my-lessons">
              <MyLessons/>
            </ProtectedRoute>
          }
        />
        <Route element={<Home />} exact path="/" />
        <Route
          path="/meeting"
          element={
            <ProtectedRoute element={<JitsiMeet/>} path="/meeting">
              <JitsiMeet/>
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route element={<NotFound pathname={window.location.pathname} />} path="/*"/>
      </Routes>
    </div>
  );
}
