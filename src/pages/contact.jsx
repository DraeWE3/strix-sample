import React from 'react'
import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import '../style/contact.css';
import ContactForm from '../components/ContactForm';


const Contact = () => {
  return (
    <div>
      <Nav />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default Contact
