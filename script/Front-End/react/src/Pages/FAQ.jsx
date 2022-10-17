import React from "react";
import "../Styles/FAQ.css";
import "../Components/SingleFAQ";
import SingleFAQ from "../Components/SingleFAQ";

const faqs = {
  faq1: { id: 1, question: "What is Let's Study For?", answer: "Its for..." },
  faq2: {
    id: 2,
    question: "Who Created Let's Study?",
    answer: "The Creators Are: ...",
  },
}; // TODO: put this data in the backend, and send it over to this component.

function FAQ() {
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
