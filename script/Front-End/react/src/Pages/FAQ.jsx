import React from 'react';
import "../Styles/FAQ.css";
import "../Components/SingleFAQ";
import SingleFAQ from "../Components/SingleFAQ";
import data from "../localdb/faqData.json";

const faqs = JSON.parse(JSON.stringify(data));

function FAQ() {
  function renderJsonItems() {
    let faqList = [];

    faqs.forEach(function (obj) {
      faqList.push(obj);
    });

    return faqList;
  }

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
        {renderJsonItems().map((item) => (
          <li key={item.id}>{<SingleFAQ faq={item} />} </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQ;
