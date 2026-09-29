const STEPS = [
  {
    label: "01 / DISCOVER",
    title: "Start with the right questions.",
    body: "We align on your users, business goals and what the product needs to achieve.",
  },
  {
    label: "02 / DEFINE",
    title: "Make the plan clear.",
    body: "We agree on scope, deliverables and timing before moving into execution.",
  },
  {
    label: "03 / CREATE",
    title: "Build in conversation.",
    body: "Design, development and production move together, with room for feedback.",
  },
  {
    label: "04 / LAUNCH",
    title: "Learn from the real world.",
    body: "We prepare the work for release and shape the next iteration around real use.",
  },
];

const AboutProcess = () => {
  return (
    <section className="about-content-width about-process-section" aria-labelledby="about-process-title">
      <p className="about-section-label" data-reveal>HOW WE WORK</p>
      <h2 id="about-process-title" data-reveal>Clarity at every step.</h2>
      <p className="about-process-intro" data-reveal>
        A collaborative process that keeps the brief, the team and the next decision in view.
      </p>
      <div className="about-process-grid">
        {STEPS.map((step) => (
          <article key={step.label} data-reveal>
            <div className="about-process-line"></div>
            <p className="about-section-label">{step.label}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutProcess;
