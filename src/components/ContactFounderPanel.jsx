import React from 'react';
import { Check, Calendar } from 'lucide-react';
import Ab2 from '../assets/img/contact/9e6ae.png';
import Linkedin from '../assets/img/contact/52917.svg';
import Google from '../assets/img/contact/5874c.svg';
import MailIcon from '../assets/img/contact/c3170.svg';
import WhatsappIcon from '../assets/img/contact/cd979.svg';

const BENEFITS = [
  'A direct conversation with our founder',
  'Clear scope, timeline & next steps',
  'One team for design, code & motion'
];

const ContactFounderPanel = () => (
  <aside className="founder-panel" aria-label="Meet your creative partner">
    <div className="founder">
      <a
        className="portrait"
        href="https://www.upwork.com/freelancers/rajnandan"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Rajnandan’s Upwork profile"
      >
        <span className="portrait-images">
          <img className="portrait-photo" src={Ab2} alt="Rajnandan Soni, Strix founder" />
        </span>
        <span aria-hidden="true">↗</span>
      </a>
      <div>
        <h2>Rajnandan Soni</h2>
        <p>Founder &amp; Creative Director</p>
      </div>
    </div>

    <div className="founder-message">
      <p className="eyebrow">GOOD THINGS START WITH A HELLO</p>
      <h2>Your vision.<br />Our next great project.</h2>
    </div>

    <ul className="benefits">
      {BENEFITS.map(benefit => (
        <li key={benefit}>
          <span className="check"><Check size={13} strokeWidth={2.5} /></span>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>

    <div className="founder-socials" aria-label="Contact Strix">
      <div>
        <a
          className="contact-tile contact-tile-button"
          href="https://www.linkedin.com/in/rajnandan-soni/"
          aria-label="Strix on LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={Linkedin} alt="" />
        </a>
        <a
          className="contact-tile contact-gmail"
          href="https://share.google/aimode/t4ueuL3GOZlNme5lE"
          aria-label="Email Strix using Gmail"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="contact-tile-google" src={Google} alt="" />
        </a>
        <a className="contact-tile contact-tile-button"
        target="_blank"
        href="https://mail.google.com/mail/?view=cm&fs=1&to=info%40strixproduction.com"
        >
          <img src={MailIcon} alt="" />
        </a>
      </div>
    </div>

    <div className="track-record">
      <div><strong>200<span>+</span></strong><span>Projects delivered</span></div>
      <div><strong>3<span>+</span></strong><span>Years of creating</span></div>
    </div>

    <div className="direct-contact">
      <p className="eyebrow">LET’S MAKE IT HAPPEN</p>
      <a className="contact-link" href="https://calendly.com/strix-ryvon/raj-consultation" target="_blank" rel="noopener noreferrer">
        <span className="contact-icon"><Calendar size={15} /></span>
        <span>Book a discovery call</span>
        <span className="end-arrow" aria-hidden="true">↗</span>
      </a>
      <a className="whatsapp-link" href="https://wa.me/919958844094" target="_blank" rel="noopener noreferrer">
        <img src={WhatsappIcon} alt="" width={14} height={14} />
        Prefer WhatsApp? Let’s chat <span aria-hidden="true">↗</span>
      </a>
    </div>
  </aside>
);

export default ContactFounderPanel;
