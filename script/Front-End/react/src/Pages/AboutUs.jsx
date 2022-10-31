import React from "react";
import '../Styles/about.css';

function AboutUs() {
  return (
    <div className="about-page">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
      <h2>מי אנחנו</h2>
      <div className="step">
        <p>
          .אנחנו תלמידים מבתי הספר <b>אהל שם</b> - רמת גן, <b>אמי"ת בר אילן</b> - גבעת שמואל ו<b>אור ברנקו וייס</b> - צור הדסה
          <br />
          .פיתחנו את הפרויקט מרעיון למוצר שימושי ויעיל בעזרת ייעוץ מצוות מנטורים ,Let's Study הכרנו דרך פיתוח הפרויקט
          <br />
          .פיתוח האתר לקח כשנה, תוך שיתוף פעולה בין גורמים רבים - יחד עם עזרתם של אנשים חשובים במהלך הדרך
        </p>
      </div>

      <div className="step gray-bcg">
        <h2>2019</h2>
      </div>

      <div className="step">
        <h2>2020</h2>
      </div>

      <div className="step gray-bcg">
        <h2>2021</h2>
      </div>

      <div className="step">
        <h2>היום</h2>
      </div>
    </div>
  );
}

export default AboutUs;
