import FaqIcon from "../../assets/img/about/d583e.svg";

const FAQS = [
  {
    q: "What does Strix Production do?",
    a: "Strix Production is a design, development and production studio. We create digital products, websites, brand identities and visual content for startups, SaaS businesses and technology teams.",
  },
  {
    q: "Can you handle both design and development?",
    a: "Yes. Our work spans product and UX/UI design, web and mobile development, and launch content. We can support a focused brief or connect those disciplines across one project.",
  },
  {
    q: "Where is your team based?",
    a: "We are based in New Delhi, India, and collaborate remotely with clients around the world. Working hours and communication are agreed at the start of the project.",
  },
  {
    q: "How long will my project take?",
    a: "Timing depends on the scope and complexity. We use discovery to understand the brief, then agree on deliverables, milestones and a realistic schedule in the proposal.",
  },
  {
    q: "How do we get started?",
    a: "Book a free 20-minute discovery call. We will discuss your product, goals and timeline, then decide whether Strix is the right fit and outline the next steps.",
  },
];

const AboutFAQ = () => {
  return (
    <section className="about-faq" id="faq" aria-labelledby="about-faq-heading">
      <h2 id="about-faq-heading" data-reveal>Frequently Asked Questions</h2>
      <div className="about-faq-list">
        {FAQS.map((faq) => (
          <details key={faq.q} open data-reveal>
            <summary>
              {faq.q}
              <img src={FaqIcon} alt="" aria-hidden="true" />
            </summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default AboutFAQ;
