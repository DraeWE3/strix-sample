import Button from '../components/Button'
import React from 'react'
import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { pageMeta } from '../data/pageMeta'
import { ArrowLeft } from 'lucide-react';
import Circleblur from '../assets/img/shared/sr-img.webp'
import RotateCardsScroll from '../animations/RotateCardsScroll'
import ScrollSlideAnimations from '../animations/slideins'
import Stagger from '../animations/stagger'
import ScrollAnimation from '../animations/scrollReveal'
import SlideInFramerOnLoad from '../animations/SlideInFramerOnLoad'
import "../style/note.css"

const Policy = () => {
  return (
    <div>
      <SEO
        {...pageMeta['/policy']}
        canonical="https://www.strixproduction.com/policy"
      />
            <Nav />
            <SlideInFramerOnLoad />
            <ScrollAnimation />
            <RotateCardsScroll />
            <ScrollSlideAnimations />
            <Stagger />



        <div className="blog-top note-return">
               <Button to='/blog'><ArrowLeft size={16} /> Return to Blog</Button>
             </div>


              <div className="sh-top uiux-hero note-hero">
                       <img src={Circleblur} alt="" width="3103" height="3336" />
                       <h1 className="slideinLoad mvp-hero-h1">Privacy Policy</h1>
                     </div>


              <section className="privacy-policy">
        <div className="privacy-header">
          <p className="date-info">Last Updated: 28.10.2026</p>
        </div>

        <div className="privacy-section">
          <h2>1. Who is responsible for your information</h2>
          <p>
            Strix Production is operated by <strong>Rajnandan soni</strong>, a sole proprietor, at{' '}
            <strong>New Delhi, India</strong>.
          </p>
          <p>
            For privacy questions, requests or complaints, contact the proprietor at{' '}
            <a href="mailto:info@strixproduction.com"><strong>info@strixproduction.com</strong></a>.
          </p>
          <p>
            This policy covers our website, enquiries and business communications. Personal information
            processed on a client’s behalf is governed by the relevant service and data-processing
            arrangements.
          </p>
        </div>

        <div className="privacy-section">
          <h2>2. Information we collect</h2>
          <p>Depending on your interaction with us, we collect:</p>
          <ul>
            <li>Your name, work email and other contact details you provide.</li>
            <li>Requested services, budget, project description and reference links.</li>
            <li>Booking details, correspondence and information shared during project discussions.</li>
            <li>Contract, billing and project records when you become a client.</li>
            <li>Technical information processed by our website and service providers, such as IP address,
            browser information, request times and security logs.</li>
          </ul>
          <p>
            Please avoid including passwords, financial credentials or unnecessary sensitive information
            in enquiries.
          </p>
        </div>

        <div className="privacy-section">
          <h2>3. Why we use your information</h2>
          <p>
            We use information to respond to enquiries, arrange meetings, prepare proposals, deliver
            services, maintain business records, protect our systems and meet legal obligations.
          </p>
          <p>An enquiry does not automatically subscribe you to marketing emails.</p>
          <p>
            Where applicable law requires a legal basis, we rely on steps requested before entering a
            contract, contractual necessity, legal obligations, consent, or legitimate interests where
            permitted. These interests include handling business communications and protecting our
            services. Optional tracking requires consent where applicable.
          </p>
        </div>

        <div className="privacy-section">
          <h2>4. Services that process information</h2>
          <p>We use the following providers for relevant interactions:</p>
          <ul>
            <li><strong>EmailJS:</strong> processes contact-form submissions for email delivery. See its{' '}
            <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
            <li><strong>Google Workspace:</strong> supports business email, document storage and
            collaboration under applicable{' '}
            <a href="https://cloud.google.com/terms/data-processing-addendum/" target="_blank" rel="noopener noreferrer">Google data-processing terms</a>.</li>
            <li><strong>Calendly:</strong> processes booking details when you schedule a meeting. See its{' '}
            <a href="https://calendly.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">Privacy Notice</a>.</li>
            <li><strong>YouTube:</strong> provides embedded videos and may process device, connection and
            viewing information when its player loads or is used. See{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s Privacy Policy</a>.</li>
            <li><strong>Google Analytics:</strong> measures website traffic and usage only if you accept
            analytics cookies in our cookie banner. You can change your choice at any time using Cookie
            Settings in the website footer. See{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s Privacy Policy</a>.</li>
          </ul>
          <p>
            Information may also be accessed by authorised team members, infrastructure providers and
            professional advisers where needed, or disclosed when legally required.
          </p>
          <p>
            Providers may process information outside your country. Where required, international
            transfers must be covered by appropriate contractual or other legally recognised safeguards.
            Contact us for details relevant to your information.
          </p>
        </div>

        <div className="privacy-section">
          <h2>5. Retention and security</h2>
          <p>
            We retain enquiry information while evaluating and following up on your request. If you
            become a client, relevant information becomes part of your project records.
          </p>
          <p>
            Retention depends on the ongoing business relationship, contractual commitments, applicable
            record-keeping obligations and any disputes. Information is deleted or anonymised when no
            longer needed.
          </p>
          <p>
            We use reasonable technical and organisational safeguards, although no system can guarantee
            absolute security.
          </p>
        </div>

        <div className="privacy-section">
          <h2>6. Your choices and rights</h2>
          <p>
            Depending on applicable law, you may request access, correction, deletion, portability or
            restrictions on the use of your information, and may object to certain processing.
          </p>
          <p>
            You may withdraw consent where processing relies on it. Withdrawal does not affect earlier
            lawful processing. We may verify your identity and retain information where legally required.
          </p>
          <p>
            Contact <a href="mailto:info@strixproduction.com"><strong>info@strixproduction.com</strong></a>.
            We respond within applicable legal time limits. You may also complain to the relevant
            data-protection authority where that right applies.
          </p>
        </div>

        <div className="privacy-section">
          <h2>7. Children and policy updates</h2>
          <p>
            Our services are intended for business customers and adults. Contact us if you believe a
            child has provided personal information.
          </p>
          <p>We publish changes on this page and provide additional notice where required.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Policy
