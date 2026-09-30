import MinusIcon from "../../assets/img/about/d583e.svg";
import { mvpFaqs } from "./mvpFaqs";

const MvpFAQ = () => (
  <section className="mvp-faq" id="faq" aria-labelledby="mvp-faq-heading">
    <h2 id="mvp-faq-heading" data-reveal>Frequently Asked<br />Questions</h2>
    <div className="mvp-faq-list" data-reveal>
      {mvpFaqs.map(({ q, a, icon }, index) => (
        <details className="mvp-faq-item" name="mvp-faq" key={q} open={index === 0}>
          <summary>
            <span>{q}</span>
            <span className="mvp-faq-icon">
              <img className="mvp-faq-icon-closed" src={icon} alt="" loading="lazy" />
              <img className="mvp-faq-icon-open" src={MinusIcon} alt="" loading="lazy" />
            </span>
          </summary>
          <div className="mvp-faq-answer"><p>{a}</p></div>
        </details>
      ))}
    </div>
  </section>
);

export default MvpFAQ;
