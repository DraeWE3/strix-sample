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

{/* <div className="collab">
  <h1>
    Collaborative Design, Guaranteed Quality
  </h1>
  <div className="collab-cards">
    <div className="collab-card">
      <img src="" alt="" />
      <h4>Progress updates &<br/> tracked hours</h4>
    </div>
  </div>
</div> */}

<Footer />
    </div>
  )
}

export default About
