import React from 'react';
import { Switch, Route} from 'react-router-dom';
import ForgotPassword1 from './Components/ForgotPassword1.jsx';
import ForgotPassword2 from './Components/ForgotPassword2.jsx';
import ForgotPassword3 from './Components/ForgotPassword3.jsx';
import Login from './Components/Login.jsx';
import Home from './Pages/Home.jsx';
import Signup from './Components/Signup.jsx';
// import Navbar from './Components/Navbar.jsx';
import SignupAuth from './Components/SignupAuth.jsx';
import Lessons from './Pages/Lessons.jsx';
import Footer from './Components/Footer.jsx';
// import ProfileSettings from './Components/ProfileSettings.jsx';
import "../src/Styles/app.css";
import NavLogin from './Components/NavLogin.jsx';
import TeacherFilters from './Components/TeacherFilters.jsx';
import ProtectedRoute from './Components/ProtectedRoutes.jsx';
export function App() {
  return (
    <div className="app">
    <NavLogin />
    <Switch>
    <Route component={Login} path="/login" />
    <Route component={SignupAuth} path="/sign-up-authentication" />
    <Route component={Signup} path="/sign-up" />
    <Route component={ForgotPassword1} path="/forgot-password-email" /> {/*1*/ }
    <Route component={ForgotPassword2} path="/forgot-password-verify" />{/*2*/ }
    <Route component={ForgotPassword3} path="/forgot-password-new-password" /> {/*3*/ }
    {/* <ProtectedRoute component={Lessons} path="/lessons" /> */}
    <Route component={Home} exact path="/"/>
    <Route component={Lessons} path="/lessons" />

    {/*TEST SECTION*/}
    <Route component={TeacherFilters} path="/filter1"/>
    </Switch>
    {/* <Footer /> */}
    </div>
  )
}