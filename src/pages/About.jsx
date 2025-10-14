import React from 'react'
import '../style/about.css'
import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import Circleblur from '../assets/img/sr-img.webp'
import BtnNormsall from '../components/normSmall-btn'
import Raj from '../assets/img/raj.webp'
import Ashim from '../assets/img/ashim.webp'
import FamilyBg from '../assets/img/Family.webp'
import Teambg from '../assets/img/teambg.webp'
import Teambur from '../assets/img/teamblur.png'
import Team1 from '../assets/img/team1.png'
import Team2 from '../assets/img/team2.png'
import Team3 from '../assets/img/team3.png'
import Team4 from '../assets/img/team4.png'
import Team5 from '../assets/img/team5.png'
import Team6 from '../assets/img/team6.png'
import positionbg1 from '../assets/img/positionbg1.webp'
import positionbg2 from '../assets/img/positionbg2.webp'
import Dp from '../assets/img/dp.png'
import Collab1 from '../assets/img/collab-icon1.png'
import Collab2 from '../assets/img/collab-icon2.png'
import Collab3 from '../assets/img/collab-icon3.png'
import Collab4 from '../assets/img/collab-icon4.png'
import ButtonB from '../components/ButtonB'
import Etbg1 from '../assets/img/etbg1.webp'
import Etbg2 from '../assets/img/etbg2.webp'
import Etbg3 from '../assets/img/etbg3.webp'
import Etbg4 from '../assets/img/etbg4.webp'
import Etbg5 from '../assets/img/etbg5.webp'
import Etbtn from '../assets/img/etarr.svg'
import Ethcard1 from '../assets/img/etcard1.webp'
import Ethcard2 from '../assets/img/etcard2.webp'
import ValBg1 from '../assets/img/valuebg1.webp'
import ValBg2 from '../assets/img/valuebg2.webp'
import ValBg3 from '../assets/img/valuebg3.webp'


const About = () => {
  return (
    <div>
      <Nav />
      <div className="about-hero">
          <div className="sh-top uiux-hero">
                  <img src={Circleblur} alt="" />
                  <h1>We craft impact. <br/>Not noise.</h1>
                </div>
                <p className='about-hero-p'>At Strix Productions, we design, develop, and deliver world-class visuals and experience that help ambitious brands move faster, scale bigger, and stand out globally.</p>
                <BtnNormsall text='Know more' />
      </div>



      {/* ==========Family=============== */}

      <div className="family">
        <h2>Strix  is not just a Production, it’s family</h2>
        <div className="family-cards">
            <div className="family-card">
            <img src={FamilyBg} alt="" />
            <div className="fam-detail">
            <img src={Ashim} alt="" />
            <h3>Ashmin</h3>
            <p>Production Head</p>
            </div>
            </div>

              <div className="family-card">
            <img src={FamilyBg} alt="" />
            <div className="fam-detail">
            <img className='raj' src={Raj} alt="" />
            <h3>Ashmin</h3>
            <p>Production Head</p>
            </div>
            </div>


              <div className="family-card">
            <img src={FamilyBg} alt="" />
            <div className="fam-detail">
            <img src={Ashim} alt="" />
            <h3>Ashmin</h3>
            <p>Production Head</p>
            </div>
            </div>

        </div>
        <p className='fam-p'>Visionary mind steering Strix Production toward global impact!</p>
      </div>



    {/* ==============Our teams=============== */}
    <div className="team">
        <h1>Our Teams</h1>
        <div className="team-cards">
          <div className="team-card">
            <div className="family-card team-fm-card">
            <img  src={Teambg} alt="" />
            <div className="fam-detail team-fm-detail">
            <img className='team-id1' src={Team1} alt="" />
            <h3>Ashmin</h3>
            <p>Production Head</p>
            </div>
            </div>
            <p className='team-card-p'>Architects of seamless, scalable digital experiences.</p>
            <BtnNormsall text='Hire Team' />
          </div>


             <div className="team-card">
            <div className="family-card team-fm-card">
            <img src={Teambg} alt="" />
            <div className="fam-detail team-fm-detail">
            <img className='team-id2' src={Team2} alt="" />
            <h3>UX/UI</h3>
            <p>Experience Wizards</p>
            </div>
            </div>
            <p className='team-card-p'>Designers who turn complexity into intuitive beauty.</p>
            <BtnNormsall text='Hire Team' />
          </div>



             <div className="team-card">
            <div className="family-card team-fm-card">
            <img src={Teambg} alt="" />
            <div className="fam-detail team-fm-detail">
            <img className='team-id3' src={Team3} alt="" />
            <h3>Graphic Designers</h3>
            <p>Visual Alchemists</p>
            </div>
            </div>
            <p className='team-card-p'>Masters of visuals that stick and stories that sell.</p>
            <BtnNormsall text='Hire Team' />
          </div>




             <div className="team-card">
            <div className="family-card team-fm-card">
            <img src={Teambg} alt="" />
            <div className="fam-detail team-fm-detail">
            <img className='team-id4' src={Team4} alt="" />
            <h3>Video Editors</h3>
            <p>Frame Magicians</p>
            </div>
            </div>
            <p className='team-card-p'>Cutting, crafting, and creating stories in motion.</p>
            <BtnNormsall text='Hire Team' />
          </div>


           <div className="team-card">
            <div className="family-card team-fm-card">
            <img src={Teambg} alt="" />
            <div className="fam-detail team-fm-detail">
            <img className='team-id5' src={Team5} alt="" />
            <h3>Sales</h3>
            <p>Growth Hackers</p>
            </div>
            </div>
            <p className='team-card-p'>Strategies, opportunities, growth in action.</p>
            <BtnNormsall text='Hire Team' />
          </div>


           <div className="team-card">
            <div className="family-card team-fm-card">
            <img src={Teambg} alt="" />
            <div className="fam-detail team-fm-detail">
            <img className='team-id6' src={Team6} alt="" />
            <h3>3d & Animations</h3>
            <p>Reality Benders</p>
            </div>
            </div>
            <p className='team-card-p'>World-builders bringing imagination to life in motion.</p>
            <BtnNormsall text='Hire Team' />
          </div>
          <img className='tblur' src={Teambur} alt="" />
        </div>
        <p className='team-p'>At Strix Productions, we design, develop, and deliver world-class visuals and experience that help ambitious brands move faster, scale bigger, and stand out globally.</p>
    </div>


{/* ==============Position=============== */}
<div className="positions">
    <h1>Rising positions and recognitions</h1>
    <div className="po-top">
        <div className="po-top-left desktop-po">
         <img src={positionbg1} alt="" />
         <div className="po-top-left-de">
            <h3>2 + <br/> years</h3>
            <p>Building global presence</p>
         </div>
        </div>

         <div className="po-top-right">
         <img src={positionbg2} alt="" />
         <div className="po-top-right-de">
            <h3>10+ successfully developed startups </h3>
            <p>I'm glad I decided to work with you.  It's really great how easy your websites are to update and manage.</p>
            <div>
                <img src={Dp} alt="" />
                <p>Abhishek Verma</p>
            </div>
         </div>
        </div>

    </div>
    <div className="po-bottom">
        <div className="po-top-left mobile-po">
         <img src={positionbg1} alt="" />
         <div className="po-top-left-de">
            <h3>2 + <br/> years</h3>
            <p>Building global presence</p>
         </div>
        </div>

      <div className="po-top-left">
         <img src={positionbg1} alt="" />
         <div className="po-top-left-de">
            <h3>220 + <br/> Projects</h3>
            <p>Delivered Successfully</p>
         </div>
        </div>

         <div className="po-top-left">
         <img src={positionbg1} alt="" />
         <div className="po-top-left-de">
            <h3>10 + <br/> Team of</h3>
            <p>Storytellers and makers</p>
         </div>
        </div> 

         <div className="po-top-left">
         <img src={positionbg1} alt="" />
         <div className="po-top-left-de">
            <h3>15 + <br/> Services</h3>
            <p>One creative hub</p>
         </div>
        </div>
   </div>
</div>


{/* ==============DNA=============== */}
<div className="dna">
  <h1>What is imprinted in our DNA ?</h1>
  <div className="dna-left">
    <h2>Mission</h2>
    <p>We partner with funded startups, technology SMEs, and Fortune 500 companies to deliver high-impact design, development, and production solutions that fuel growth.</p>
    </div>
  <div className="dna-right">
    <h2>Vision</h2>
    <p>We, at Strix, aim to become the go-to creative powerhouse for brands seeking premium, innovative, and scalable results.</p>
  </div>
</div>



{/* =============collab=================== */}

<div className="collab">
  <h1>
    Collaborative Design, Guaranteed Quality
  </h1>
  <div className="collab-cards">
    <div className="collab-card">
      <img src={Collab1} alt="" />
      <p>Progress updates &<br/> tracked hours</p>
    </div>

     <div className="collab-card">
      <img src={Collab2} alt="" />
      <p>Progress updates &<br/> tracked hours</p>
    </div>

     <div className="collab-card">
      <img src={Collab3} alt="" />
      <p>Progress updates &<br/> tracked hours</p>
    </div>

     <div className="collab-card">
      <img src={Collab4} alt="" />
      <p>Progress updates &<br/> tracked hours</p>
    </div>
  </div>

  <ButtonB text='Book Appointment' />
</div>



  {/* ===================expert==================== */}

  <div className="expert">
    <h1>Design Expertise Across Industries</h1>
    <div className='expert-top'>
      <div className="et-top-card">
        <img src={Etbg1} alt="" />
        <div className="et-top-card-con">
          <h3>SaaS</h3>
          <div className="et-flex">
            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>CRM & HR Tech</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Data Dashboards</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Product Design</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Brand Systems</p>
            </div>
          </div>
          <div className="et-center">
             <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>MVP Development</p>
            </div>
          </div>
          <img className='etarr' src={Etbtn} alt="" />
        </div>
      </div>


      <div className="et-top-card">
        <img src={Etbg2} alt="" />
        <div className="et-top-card-con">
          <h3>Fintech</h3>
          <div className="et-flex">
            <div className='et-btn'>
              <img src={Ethcard2} alt="" />
              <p>App Design</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard2} alt="" />
              <p>Trading Platforms</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard2} alt="" />
              <p>Corporate Identity</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard2} alt="" />
              <p>Digital Payments</p>
            </div>
          </div>
          <div className="et-center et-d">
             <div className='et-btn'>
              <img src={Ethcard2} alt="" />
              <p>Secure Web Portals</p>
            </div>
          </div>
          <img className='etarr' src={Etbtn} alt="" />
        </div>
      </div>




      <div className="et-top-card et-destop">
        <img src={Etbg3} alt="" />
        <div className="et-top-card-con">
          <h3>E-commerce</h3>
          <div className="et-flex">
            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Online stores</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>B2B/B2C</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Product Promos</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>3D Commercials</p>
            </div>
          </div>
          <div className="et-center">
             <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>product configurators</p>
            </div>
          </div>
          <img className='etarr' src={Etbtn} alt="" />
        </div>
      </div>


      
    </div>

    <div className="expert-bottom">

        <div className="et-top-card et-mobile">
        <img src={Etbg3} alt="" />
        <div className="et-top-card-con">
          <h3>E-commerce</h3>
          <div className="et-flex">
            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Online stores</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>B2B/B2C</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Product Promos</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>3D Commercials</p>
            </div>
          </div>
          <div className="et-center">
             <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>product configurators</p>
            </div>
          </div>
          <img className='etarr' src={Etbtn} alt="" />
        </div>
      </div>


            <div className="et-top-card">
        <img src={Etbg5} alt="" />
        <div className="et-top-card-con">
          <h3>Startups</h3>
          <div className="et-flex">
            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>MVP design</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>platform UX</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>mobile apps</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>dashboards</p>
            </div>
          </div>
          <div className="et-center">
             <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>developer tools</p>
            </div>
          </div>
          <img className='etarr' src={Etbtn} alt="" />
        </div>
      </div>



      <div className="et-top-card">
        <img src={Etbg4} alt="" />
        <div className="et-top-card-con">
          <h3>Agencies</h3>
          <div className="et-flex">
            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Portfolio  site</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Brand Identity</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Client Portals</p>
            </div>

            <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Creative Assets</p>
            </div>
          </div>
          <div className="et-center">
             <div className='et-btn'>
              <img src={Ethcard1} alt="" />
              <p>Promotional Content</p>
            </div>
          </div>
          <img className='etarr' src={Etbtn} alt="" />
        </div>
      </div>


    </div>

    <p className="et-pp">
      Our product designers bring deep, cross-industry experience—crafting tailored design solutions that not only look great but also drive real business value. No matter the niche, we know how to make your digital product stand out and succeed.
    </p>
  </div>



  {/* ======================Value==================== */}

  <div className="value">
    <h1>Our Values</h1>
    <div className="value-cards">
      <div className="value-card">
        <img src={ValBg1} alt="" />
        <div className="value-card-de">
          <h2>Growth</h2>
          <p>Evolving every day</p>
        </div>
      </div>

      <div className="value-card">
        <img src={ValBg2} alt="" />
        <div className="value-card-de">
          <h2>People</h2>
          <p>Driven by humans</p>
        </div>
      </div>

      <div className="value-card">
        <img src={ValBg3} alt="" />
        <div className="value-card-de">
          <h2>Awareness</h2>
          <p>Mindful by design</p>
        </div>
      </div>
    </div>
          <p className='value-p'>We grow with purpose, put people first, and create with awareness at every step</p>
  </div>

  <div className="create">
    <h1>Let’s create amazing digital <br/>
experiences together</h1>

<p>Strix is a global remote team with a global footprint. <br />Don`t hesitate to reach out to us with your projects, ideas, and questions.</p>
<div className="btnb-con">
  <ButtonB text='Book Appointment' />
</div>
  </div>

<Footer />
    </div>
  )
}

export default About
