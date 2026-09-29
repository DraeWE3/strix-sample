import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import LogoLoop from '../components/Loop';
import ContactFounderPanel from '../components/ContactFounderPanel';
import ContactForm from '../components/ContactForm';
import Upwork from '../assets/img/contact/1c94a.svg';
import TopRatedBadge from '../assets/img/contact/1fe78.svg';
import TopRatedText from '../assets/img/contact/f2654.svg';
import '../style/contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <SEO
        title="Contact Strix for Design & Development Services"
        description="Ready to start your next project? Connect with the Strix team for tailored design, development, and production solutions that align with your brand objectives."
        canonical="https://www.strixproduction.com/contact"
      />
      <a className="skip-link" href="#contact-form">Skip to project form</a>
      <Nav />

      <div className="contact-utility">
        <Link className="return-home" to="/">
          <span aria-hidden="true">←</span>
          <span>Return to Homepage</span>
        </Link>
        <a
          className="review-badge"
          href="https://www.upwork.com/agencies/1799430219619033088/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Top Rated on Upwork, 5 out of 5 stars. View our agency profile"
        >
          <span className="review-top">
            <span className="top-rated">
              <img src={TopRatedBadge} alt="" width="12" height="12" />
              <img src={TopRatedText} alt="Top Rated" className="top-rated-text" />
            </span>
            <span className="stars" aria-hidden="true">★★★★★</span>
          </span>
          <span className="review-bottom">
            <img src={Upwork} alt="Upwork" />
            <span>100% JOB SUCCESS</span>
          </span>
        </a>
      </div>

      <main>
        <div className="contact-grid">
          <ContactFounderPanel />
          <div id="contact-form">
            <ContactForm />
          </div>
        </div>
      </main>

      <section className="clients" aria-labelledby="clients-title">
        <div className="clients-heading">
          <h2 id="clients-title">IN GOOD COMPANY / SELECTED CLIENTS</h2>
        </div>
        <LogoLoop />
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
