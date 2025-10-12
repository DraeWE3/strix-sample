
import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'
import '../style/caseStudy.css'
import ArrowLeft from '../assets/img/arrow-left.svg'
import React, { useState, useRef } from "react";
import Kundali from '../assets/img/kundali-case-study.webp'
import { Play } from 'lucide-react';
import Circle from '../assets/img/updown-circle.webp'
import Slogo from '../assets/img/slogo2.webp'
import Case1 from '../assets/img/kundali1.webp'
import Case2 from '../assets/img/kundali2.webp'
import Case3 from '../assets/img/kundali3.webp'
import ButtonArrow from '../components/button-arrow'
import Cardbg1 from '../assets/img/pr-card1.webp'
import Cardbg2 from '../assets/img/pr-card2.webp'
import Cardbg3 from '../assets/img/pr-card3.webp'
import Pricon1 from '../assets/img/research.svg'
import Pricon2 from '../assets/img/development.svg'
import Pricon3 from '../assets/img/delivery.svg'
import Slide1 from '../assets/img/concept1.webp'
import Slide2 from '../assets/img/concept2.webp'
import Slide3 from '../assets/img/concept3.webp'
import Slide4 from '../assets/img/concept4.webp'
import Slide5 from '../assets/img/concept5.webp'
import Slide6 from '../assets/img/concept6.webp'
import Slide7 from '../assets/img/concept7.webp'
import Slide8 from '../assets/img/concept8.webp'
import Slide9 from '../assets/img/concept9.webp'
import System from '../assets/img/system-bg.webp'
import ResCard1 from '../assets/img/res-card1.webp'
import ResCard2 from '../assets/img/res-card1.webp'
import ResCard3 from '../assets/img/res-card1.webp'
import ResCard4 from '../assets/img/res-card1.webp'
import ResCard5 from '../assets/img/res-card1.webp'
import ResCard6 from '../assets/img/res-card1.webp'
import ResCard7 from '../assets/img/res-card1.webp'
import ResCard8 from '../assets/img/res-card1.webp'
import ResRight from '../assets/img/res-right.svg'
import ResLeft from '../assets/img/res-left.svg'
import Icon1 from '../assets/img/tech-icon1.svg'
import Icon2 from '../assets/img/tech-icon2.svg'
import Icon3 from '../assets/img/tech-icon3.svg'
import Icon4 from '../assets/img/tech-icon4.svg'
import Icon5 from '../assets/img/tech-icon5.svg'
import Icon6 from '../assets/img/tech-icon6.svg'
import Icon7 from '../assets/img/tech-icon7.svg'
import Icon8 from '../assets/img/tech-icon8.svg'
import Icon9 from '../assets/img/tech-icon9.svg'
import Icon10 from '../assets/img/tech-icon10.svg'
import Blur7 from '../assets/img/blur5.png'
import Blur8 from '../assets/img/p-blur6.png'
import BookBg from '../assets/img/book-con.webp'
import NextP from '../assets/img/next-p.svg'
import Blur1 from '../assets/img/p-blur2.png'
import Blur2 from '../assets/img/p-blur1.png'
import Blur3 from '../assets/img/p-blur3.png'
import Blur4 from '../assets/img/p-blur4.png'
import Blur5 from '../assets/img/p-blur3.png'



const images = [
  ResCard1, ResCard2, ResCard3, ResCard4,
  ResCard5, ResCard6, ResCard7, ResCard8
];



const CaseStudy = () => {

    const carouselRef = useRef(null);

const scroll = (direction) => {
  const container = carouselRef.current;
  const card = container.querySelector("img");
  const cardWidth = card.offsetWidth + 24; // 24px = approx gap for mobile
  const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

  container.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
};



 const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div>
      <Nav />
      {/* =======================hero============= */}
      <div className="case-hero">
        <div className="case-return-btn">
            <img src={ArrowLeft} />
            <p>Return to Projects</p>
        </div>
        <h1 className="case-head">
           Project Overview 
        </h1>
        <div className="case-links">
            <p className="link-button">Branding</p>
            <p className="link-button">Websites</p>
            <p className="link-button">All</p>
            <p className="link-button">UI/UX</p>
            <p className="link-button">Media</p>
        </div>

        <div className="case-box-con">
         <div className="video-card-container">
        {!isPlaying ? (
          <div className="video-thumbnail">
            <img
              src={Kundali}
              alt="Video thumbnail"
              className="thumbnail-image"
            />
            <div className="play-button-overlay">
              <button
                onClick={handlePlay}
                className="play-button"
                aria-label="Play video"
              >
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
     
       <img src={Circle} className='updowncircle' />
        </div>
         <h1 className='kun-h1'>The Kundili Pro</h1>
                         <img src={Blur1} className='p-blur1' />
                 <img src={Blur2} className='p-blur2' />
      </div>

       {/* =======================Details============= */}

       <div className="details-sec">
         <div><h2>Client</h2> <img src={Slogo} /></div>
         <div><h2>Industry</h2> <p>Astrology</p></div>
         <div><h2>Country</h2><p>India</p></div>
         <div><h2>Services</h2> <p>UX/UI / Web / App / Media</p></div>
       </div>


       {/* =======================About Project============= */}
        <div className="aboutProject">
            <div className="ap-top">
                <h1>About Project</h1> <p>The Kundli Pro is a Vedic astrology software used to create detailed birth charts, predict future events, and analyze horoscopes. It offers features like dasha analysis, matchmaking, and planetary positions, making it a popular tool among professional astrologers.</p>
            </div>

            <div className="ap-med">
                <div className="ap-left">
                    <img src={Case1} alt="" />
                    <img src={Case2} alt="" />
                </div>
                 <div className="ap-right">
                    <img src={Case3} alt="" />
                 </div>
            </div>
           <div className="aboutprojectbtn">
                 <ButtonArrow text='Experience' />
           </div>
{/* 
              <img src={Blur3} className='p-blur3' /> */}
                           <img src={Blur4} className='p-blur4' />
                           <img src={Blur5} className='p-blur5' />
        </div>

         {/* =======================Process============= */}
           <div className="process">
            <div className="lineup"></div>
            <h1 className="process-h1"> The Process</h1>
            <div className="process-cards">
                <div className="pr-card">
                    <img src={Cardbg1} className='pr-cardbg' />
                  <div className="prcard-con">
                      <div><img src={Pricon1} alt="" /><p>10 Hours</p></div>
                    <h1>Discovery</h1>
                    <div className='prcard-con-details'>
                        <p>crypto audience profiling</p>
                        <p>web 3ux pattern analysis</p>
                        <p>brands & value positioning</p>
                    </div>
                  </div>
                </div>

                  <div className="pr-card">
                    <img src={Cardbg2} className='pr-cardbg' />
                    <div className="prcard-con">
                        <div><img src={Pricon2} alt="" /><p>150 Hours</p></div>
                    <h1>Development</h1>
                    <div className='prcard-con-details'>
                        <p>UX flow for conversions</p>
                        <p>Balance between clean & bold</p>
                        <p>Interactive narrative approach</p>
                    </div>
                    </div>
                </div>

                  <div className="pr-card">
                    <img src={Cardbg3} className='pr-cardbg' />
                   <div className="prcard-con">
                     <div><img src={Pricon3} alt="" /><p>120 Hours</p></div>
                    <h1>Delivery</h1>
                    <div className='prcard-con-details'>
                        <p>High-fidelity</p>
                        <p>Fully responsive components</p>
                        <p>Trust-focused onboarding flow</p>
                    </div>
                   </div>
                </div>
            </div>
            <p className='pr-card-p'>Our process began with detailed research, including a client brief and regular 2-week calls, followed by competitor analysis, wireframe, moodboard, two distinct UI Concepts, and iteration based on feedback. These evolved into polished layouts and a style guide focusing on responsive design.</p>
           </div>


     {/* =======================initial concept============= */}
      <div className="concept">
        <div className="lineup"></div>
        <h1>Initial concepts</h1>
        <div className='case-slide1'>
            <img src={Slide1} alt="" />
            <img src={Slide2}alt="" />
            <img src={Slide3} alt="" />
            <img src={Slide4} alt="" />
            <img src={Slide5} alt="" />
        </div>
         <div className='case-slide2'>
            <img src={Slide6} alt="" />
            <img src={Slide7} alt="" />
            <img src={Slide8} alt="" />
            <img src={Slide9} alt="" />
        </div>
      </div>

      {/* =======================system============= */}
        
        <div className="system">
            <div className="lineup"></div>
            <h1>Styleguide / Design System</h1>
            <img src={System} alt="" />
        </div>


        {/* =======================Respondsive-case============= */}
          <div className="respondsive-case">
             <div className="lineup"></div>
            <h1>Responsive</h1>
             <div className="res-carousel">
      <div className="re-cards" ref={carouselRef}>
        {images.map((src, i) => (
          <img key={i} src={src} alt={`Card ${i}`} />
        ))}
      </div>

      <div className="res-controller">
        <div className="res-btnleft" onClick={() => scroll("left")}>
          <img src={ResLeft} alt="Left" />
        </div>
        <div className="res-btnright" onClick={() => scroll("right")}>
          <img src={ResRight} alt="Right" />
        </div>
      </div>
    </div>
     <img src={Blur5} className='p-blur5' />
          </div>

      {/* =======================Technology============= */}

      <div className="technology">
        <div className="lineup"></div>
            <h1>Technologies and tools</h1>
            <div className="tech-con">
              <div className='tech-cons'>
              <h2>Design</h2>
              <div>
                <img src={Icon1} alt="" />
                <img src={Icon2} alt="" />
                <img src={Icon3} alt="" />
              </div>
            </div>
            <div className='tech-cons'>
              <h2>Development</h2>
              <div>
                <img src={Icon4} alt="" />
                <img src={Icon5} alt="" />
                <img src={Icon6} alt="" />
                <img src={Icon7} alt="" />
                <img src={Icon8} alt="" />
              </div>
            </div>
            <div className='tech-cons'>
              <h2>Production</h2>
              <div>
                <img src={Icon9} alt="" />
                <img src={Icon10} alt="" />
              </div>
            </div>
            </div>
            
      </div>


{/* =======================Results============= */}

<div className="results">
  <div className="lineup"></div>
  <div className="result-grid">
    <h2>Results</h2>
  <div className='result-cards'>
    <div className="result-card">
      <h3>Enhanced user engagement</h3>
      <p>The modern design increased user interactions, driven by intuitive navigation and a user-friendly & accessible interface.</p>
    </div>

    <div className="result-card">
      <h3>Improved brand
recognition</h3>
      <p>We combined Web3 aesthetics with minimalism for a unique visual identity that boosted brand visibility and user trust.</p>
    </div>

    <div className="result-card">
      <h3>Higher
conversions</h3>
      <p>Clear design elements with intuitive navigation increased wallet connections, converting more visitors into active traders.</p>
    </div>

    <div className="result-card">
      <h3>24/7 support
efficiency</h3>
      <p>Our design facilitated better access to live support, reduced response times, and enhanced customer satisfaction.</p>
    </div>
  </div>
  </div>

  <img src={Blur5} className='p-blur5' />
</div>


{/* =======================Circle============= */}

          <div className="book-container case-circle">
                <div className="bool-container-card">
                  <img src={BookBg} className='bookbg'/>
                  <div className="book-ab">
                    <img src={NextP} className='next-p' />
                  </div>
                </div>
      
                <img src={Blur7} className='blur7'/>
                <img src={Blur8} className='blur8'/>
              </div>

       {/* =======================booking============= */}
       <div className="booking" >
           <h1 className="section-header2">
                    Have  a project that <br /> deserves attention ?
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

export default CaseStudy
