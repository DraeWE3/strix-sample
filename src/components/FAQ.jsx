import { useState } from "react";
import FaqIcon from "../assets/img/about/d583e.svg";
import "../style/faq.css";

// Shared FAQ section. Items are { question, answer } (also accepts { q, a }).
const FAQ = ({ faqData = [], title = "Frequently Asked Questions", id = "faq", className = "" }) => {
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  if (!faqData.length) return null;

  return (
    <section className={`faq ${className}`.trim()} id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{title}</h2>
      <div className="faq-list">
        {faqData.map((item, index) => {
          const question = item.question ?? item.q;
          const answer = item.answer ?? item.a;
          return (
            <details key={question} open={activeFaqIndex === index}>
              <summary
                onClick={(event) => {
                  event.preventDefault();
                  setActiveFaqIndex(activeFaqIndex === index ? null : index);
                }}
              >
                {question}
                <img src={FaqIcon} alt="" aria-hidden="true" />
              </summary>
              {typeof answer === "string" ? <p>{answer}</p> : answer}
            </details>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
