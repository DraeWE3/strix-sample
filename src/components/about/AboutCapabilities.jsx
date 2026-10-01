const AboutCapabilities = () => {
  return (
    <section className="about-content-width about-capabilities" id="capabilities" aria-labelledby="about-capabilities-title">
      <h2 id="about-capabilities-title" data-reveal>Three disciplines.<br />One connected process.</h2>
      <div className="about-capability-divider"></div>
      <article className="about-capability-row" data-reveal>
        <span className="about-capability-number">01</span>
        <h3>Design</h3>
        <div>
          <p>Make the right first impression.</p>
          <p className="about-capability-detail">Product &amp; MVP design &middot; UX/UI &middot; SaaS dashboards &middot; Design systems &middot; Brand identity</p>
        </div>
      </article>
      <div className="about-capability-divider"></div>
      <article className="about-capability-row" data-reveal>
        <span className="about-capability-number">02</span>
        <h3>Development</h3>
        <div>
          <p>Turn the experience into a product.</p>
          <p className="about-capability-detail">Web &amp; mobile apps &middot; SaaS platforms &middot; API integrations &middot; Ecommerce &middot; Websites</p>
        </div>
      </article>
      <div className="about-capability-divider"></div>
      <article className="about-capability-row" data-reveal>
        <span className="about-capability-number">03</span>
        <h3>Production</h3>
        <div>
          <p>Give your product a story people remember.</p>
          <p className="about-capability-detail">Motion design &middot; 3D &amp; animation &middot; SaaS explainers &middot; Launch films &middot; Video editing</p>
        </div>
      </article>
      <a className="about-text-link" href="/services" target="_blank" rel="noopener noreferrer">
        Explore all services &#8599;
      </a>
    </section>
  );
};

export default AboutCapabilities;
