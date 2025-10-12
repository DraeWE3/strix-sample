import React, { useState, useEffect, useRef } from "react";
import Nav from '../components/Navbar'
import Circleblur from '../assets/img/sr-img.webp'
import BtnNormsall from '../components/normSmall-btn';
import Footer from '../components/Footer'
import Blur1 from '../assets/img/p-blur2.png'
import Blur2 from '../assets/img/p-blur1.png'
import Blur3 from '../assets/img/Ellipse 7.png'
import Blur4 from '../assets/img/Ellipse 8.png'
import Kundali from '../assets/img/kundali-case-study.webp'
import { Play } from 'lucide-react';
import Circle from '../assets/img/updown-circle.webp'
import '../style/uiux.css'
import CardImg from '../assets/img/ui-card.webp'
import Cardcon1 from '../assets/img/ui-card1.png'
import Cardcon2 from '../assets/img/ui-card2.png'
import ProjectCarousel from "../components/projectCarouel";
import Button from "../components/Button";
import ProjectCircle from '../assets/img/project-circle.webp'
import HeroImg from '../assets/img/service-hero.webp'

const Uiux = () => {

      const [isPlaying, setIsPlaying] = useState(false);
    
      const handlePlay = () => {
        setIsPlaying(true);
      };


  return (
    <div>
      <Nav />

        {/* =============== service-hero ============ */}
      <div className="service-hero">
        <div className="sh-top uiux-hero">
          <img src={Circleblur} alt="" />
          <h1>UI/UX design</h1>
        </div>

        <div className="case-box-con">
          <img src={Blur3} className="blur3-hero-left" />
            <img src={Blur4} className="blur3-hero-right"/>
          <div className="video-card-container">
            {!isPlaying ? (
              <div className="video-thumbnail">
                <img
                  src={HeroImg}
                  alt="Video thumbnail"
                  className="thumbnail-image"
                />
                <div className="play-button-overlay">
                  <button
                    onClick={handlePlay}
                    className="play-button-sr"
                    aria-label="Play video"
                  >
                    <h1 className="sr-watch">Watch showreel</h1>
                    <span className="play-line"></span>
                    <Play className="play-icon" fill="white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="video-player">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
          </div>

        
        </div>
        <p className="ui-hero-p">From concept to launch, we design products that captivate users and elevate businesses.</p>
                         <img src={Blur1} className='p-blur1' />
                 <img src={Blur2} className='p-blur2' />
      </div>


    {/* =================provide=========== */}
    <div className="provide-con">
       <div className="sh-top uiux-hero">
          <img src={Circleblur} alt="" />
          <h1>What we provide</h1>
        </div>

        <div className="provide-grid">
          <div className="provide-card">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
               <img src={Cardcon1} alt="" />
               <p>SaaS Interfaces</p>
              </div>
            </div>
             <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
                <BtnNormsall text="Hire Team"/>
          </div>

           <div className="provide-card">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
               <img className="top-card-con1" src={Cardcon2} alt="" />
               <p>Dashboards</p>
              </div>
            </div>
             <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
                <BtnNormsall text="Hire Team"/>
          </div>

           <div className="provide-card">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
               <img src={Cardcon1} alt="" />
               <p>Enterprise Applications</p>
              </div>
            </div>
             <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
                <BtnNormsall text="Hire Team"/>
          </div>

           <div className="provide-card">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
               <img src={Cardcon1} alt="" />
               <p>User Flows & Wireframes</p>
              </div>
            </div>
             <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
                <BtnNormsall text="Hire Team"/>
          </div>
        </div>
    </div>

    {/* ===================why================== */}

      <div className="sh-top uiux-hero what-con">
          <img src={Circleblur} alt="" />
          <h1>Why Choose us ?</h1>
          <p>Our UI/UX practice combines research, strategy, and sleek execution — helping startups and enterprises create designs that actually perform.</p>
        </div>



 <div className='project-carousel-con'>
          <img src={ProjectCircle} className='ProjectCircle'/>
          <h1>Related Projects</h1>
          <ProjectCarousel />

          
        </div>



  {/* ==================booking====================== */}
    <div className="booking" >
             <h1 className="section-header2">
                     Have  a project that <br/> deserves attention ?
                    </h1>
            <div className="second">
              <div className="left-booking">
                <p className="leave">
                  <span>•</span>Leave a request
                </p>
  
                <div className="right-booking right-booking2">
                <p>
                  Let's start <br /> your project
                </p>
              </div>
                <p className="sr-mobile" > We'd love to be challenged by you! Feel free to share your brief
                                with us</p>
              </div>
              <div className="right-booking">
                <p>
                  Let's start <br /> your project
                </p>
              </div>
            </div>
            <Button text="Book Appointment" />
          </div>


      <Footer />
    </div>
  )
}

export default Uiux
