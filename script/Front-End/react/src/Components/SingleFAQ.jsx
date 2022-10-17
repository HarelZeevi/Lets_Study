import React from "react";
import "../Styles/FAQ.css";

function SingleFAQ(props) {
  let faqClassNames = `faq faq-${props.faq.id}`; // general "faq" class + unique class ("faq" + id)

  return (
    <div className={faqClassNames}>
      <h1 className="question"> {props.faq.question} </h1>
      <p className="answer"> {props.faq.answer} </p>
    </div>
  );
}

export default SingleFAQ;
