import React, { useEffect, useState } from 'react';
import "../Styles/FAQ.css";
import "../Components/SingleFAQ";
import SingleFAQ from "../Components/SingleFAQ";
import axios from 'axios';




function FAQ() {
  const [faqs, setFaqs] = useState({});

  useEffect(() => { 
    const data = axios.get('<url>'); //TODO: fetch an api call from the server (Harel)
    setFaqs(data);
  }, [faqs])
  return (
    <div className="faq-page">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <h1 className="page-title">FAQ's:</h1>

      <ul className="faq-list">
        <li key={faqs.faq1.id}>
          <SingleFAQ faq={faqs.faq1} />
        </li>

        <li key={faqs.faq2.id}>
          <SingleFAQ faq={faqs.faq2} />
        </li>
      </ul>
    </div>
  );
}

export default FAQ;
