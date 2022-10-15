import React from "react";
import { Link } from 'react-router-dom';
import '../Styles/help.css';

function Help() {
  return (
    <div className="help-page">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <h1>We Currently Don't Support a Proper Help Service</h1>
      <h2>Please Contact Our Support Team</h2>
      
      <br />

      <h3><Link to='/contact' className="to-contact">Press Here to Contact Us</Link></h3>
    </div>
  );
}

export default Help;
