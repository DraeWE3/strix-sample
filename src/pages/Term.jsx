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

const Term = () => {
  return (
    <div>
      <SEO
        {...pageMeta['/term']}
        canonical="https://www.strixproduction.com/term"
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
                       <h1 className="slideinLoad mvp-hero-h1">Terms of Service</h1>
                     </div>

      <section className="terms-of-service">
        <div className="terms-header">
          <p className="date-info">Last Updated: 28.10.2026</p>
        </div>

        <div className="terms-section">
          <h2>1. About Strix Production</h2>
          <p>
            Strix Production is operated by <strong>Rajnandan soni</strong>, a sole proprietor, from{' '}
            <em>New Delhi, India</em>. These terms govern your use of strixproduction.com.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. Our services and project agreements</h2>
          <p>
            We provide design, development, branding, MVP development, video production and related
            creative services.
          </p>
          <p>
            Submitting an enquiry does not create a service contract. Your accepted proposal or project
            agreement defines the scope, deliverables, fees, payment schedule, timelines, revisions,
            cancellations and refunds. That agreement takes priority over these website terms for the
            relevant project.
          </p>
        </div>

        <div className="terms-section">
          <h2>3. Your responsibilities</h2>
          <p>
            When engaging our services, you must be authorised to act for yourself or your organisation.
            You are responsible for providing accurate information, agreed materials and timely feedback,
            and for holding the necessary rights to materials you supply.
          </p>
          <p>
            Changes to the agreed scope may affect fees and timelines and must be agreed in writing.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. Intellectual property and confidentiality</h2>
          <p>
            Website content belongs to Strix Production or its respective owners. You may browse and share
            links, but may not reproduce or commercially exploit protected material without permission.
          </p>
          <p>
            Ownership of project deliverables, source files and third-party assets follows the applicable
            project agreement and licences. Confidentiality and portfolio permissions follow the relevant
            agreement or NDA.
          </p>
        </div>

        <div className="terms-section">
          <h2>5. Acceptable use</h2>
          <p>
            You must not misuse our forms, submit malicious content, infringe others’ rights, disrupt the
            website or attempt unauthorised access. We may restrict access where reasonably necessary to
            prevent misuse.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. Information and liability</h2>
          <p>
            We aim to keep website information accurate but cannot guarantee uninterrupted availability or
            error-free content. Case studies describe individual projects and do not guarantee similar
            outcomes.
          </p>
          <p>
            To the extent permitted by law, we exclude liability for indirect or consequential losses
            arising from use of this informational website. Liability for paid services follows the
            relevant project agreement. Nothing limits rights or liabilities that cannot legally be
            excluded.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Governing law and changes</h2>
          <p>
            These terms are governed by Indian law, subject to any mandatory protections applicable to
            you. Disputes fall within the jurisdiction of the competent courts.
          </p>
          <p>
            Updates apply prospectively and do not retrospectively change signed project agreements.
          </p>
        </div>

        <div className="terms-section">
          <div className="contact-info">
            <p><strong>Contact:</strong> <a href="mailto:info@strixproduction.com">info@strixproduction.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919958844094">+91 9958844094</a></p>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  )
}

export default Term
