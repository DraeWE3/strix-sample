import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Nav from '../components/Navbar';
import Footer from '../components/Footer';
import BtnNormsall from '../components/normSmall-btn';
import Kundali from '../assets/img/kundali-case-study.webp'
import Circle from '../assets/img/updown-circle.webp'
import { Play } from 'lucide-react';
import '../style/services.css'
import Circleblur from '../assets/img/sr-img.webp'
import DesignC1 from '../assets/img/sr-car1.webp'
import DesignC2 from '../assets/img/sr-car2.webp'
import DesignC3 from '../assets/img/sr-car3.webp'
import DesignC4 from '../assets/img/sr-car4.webp'
import DesignC5 from '../assets/img/sr-car5.webp'
import DesignC6 from '../assets/img/sr-car6.webp'
import SrIcon1 from '../assets/img/sr-icon1.svg'
import SrIcon2 from '../assets/img/sr-icon2.svg'
import SrIcon3 from '../assets/img/sr-icon3.svg'
import SrIcon4 from '../assets/img/sr-icon4.svg'
import SrIcon5 from '../assets/img/sr-icon5.svg'
import SrIcon6 from '../assets/img/sr-icon6.svg'
import Carousel from "../components/carousel";
import CircleBlur from "../assets/img/circle-blur.webp";
import ButtonSmall from "../components/btn-small";
import Button from "../components/Button";
import Blur1 from '../assets/img/p-blur2.png'
import Blur2 from '../assets/img/p-blur1.png'
import Blur3 from '../assets/img/Ellipse 7.png'
import Blur4 from '../assets/img/Ellipse 8.png'
import Blur5 from '../assets/img/p-blur3.png'
import Blur6 from '../assets/img/p-blur4.png'
import HeroImg from '../assets/img/service-hero.webp'
import Connect from '../assets/img/connect.svg'

const Service = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

const slides = [DesignC1, DesignC2, DesignC3, DesignC4, DesignC5, DesignC6];
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const moveX = useRef(0);
  const autoSlideRef = useRef(null);

  // Auto-slide every 6 seconds
  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(autoSlideRef.current);
  }, [current]);

  const startAutoSlide = () => {
    clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
  };

  const goToSlide = (index) => setCurrent(index);

  // Drag/swipe handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    startX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    moveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const diff = startX.current - moveX.current;
    if (diff > 70) {
      // swipe left
      setCurrent((prev) => (prev + 1) % slides.length);
    } else if (diff < -70) {
      // swipe right
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setIsDragging(false);
  };


  return (
    <div>
      <Nav />

      {/* =============== service-hero ============ */}
      <div className="service-hero">
        <div className="sh-top">
          <img src={Circleblur} alt="" />
          <h1>The Architects of Digital Excellence.</h1>
          <p className="sh-top-p">
            Empowering brands with future-ready solutions in Design,
            Development, and Production that drive engagement, scalability, and
            growth.
          </p>
          <BtnNormsall text='Know more' />
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
                         <img src={Blur1} className='p-blur1' />
                 <img src={Blur2} className='p-blur2' />
      </div>

      {/* =============== sr-txt-con============ */}
      <div className="service-hero sr-txt-con norm-pad">
        <div className="sh-top">
          <img src={Circleblur} alt="" />
          <h1>What we do at Strix Production?</h1>
          <p className="sh-top-p">
             We craft transformative digital experiences that elevate brands and captivate audiences. Your vision, realized without compromise.
          </p>
          <BtnNormsall text='Know more' />
        </div>
      </div>


    {/* ===============Sr design============ */}
    <div className="sr-design">
        <h1 className='sr-design-h1'>Design</h1>
        <p className='sr-design-p'>Crafting experiences that resonate.</p>
  <div className="sr-carousel-con">
      <div
        className="sr-carousel-items"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
       <div
  className="sr-carousel-inner"
  style={{
    display: "flex",
    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: `translateX(-${current * (100 / 6)}%)`, // consistent step
    width: "600%", // 6 slides * 100%
  }}
>

          {/* Your exact same structure below */}
          <div className="sr-carousel-item">
            <img src={DesignC1} alt="" />
            <div className="sr-items">
              <h1>UI/UX Design</h1>
              <p>
                Beyond beautiful interfaces, we build seamless user journeys
                that drive engagement and conversion.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC2} alt="" />
            <div className="sr-items">
              <h1>Product Design</h1>
              <p>
                From concept to launch, we meticulously shape digital products
                for unparalleled user satisfaction and business impact.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC3} alt="" />
            <div className="sr-items">
              <h1>Mobile app Design</h1>
              <p>
                Strategically designed mobile experiences that are intuitive,
                beautiful, and built for your users' on-the-go lifestyle.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC4} alt="" />
            <div className="sr-items">
              <h1>Creative Design</h1>
              <p>
                A team of creative visionaries delivering high-impact graphics,
                thumbnails, and presentations that leave a lasting impression.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC5} alt="" />
            <div className="sr-items">
              <h1>Website Design</h1>
              <p>
                Bespoke websites and landing pages built to be the digital
                cornerstone of your business.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC6} alt="" />
            <div className="sr-items">
              <h1>Branding</h1>
              <p>
                We forge powerful brand identities and comprehensive guidelines
                that articulate your mission and vision with clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sr-carousel-select">
        <BtnNormsall text="Explore" />
        <div className="sr-icons">
          <img src={SrIcon1} alt="" />
          <img src={SrIcon2} alt="" />
          <img src={SrIcon3} alt="" />
          <img src={SrIcon4} alt="" />
          <img src={SrIcon5} alt="" />
          <img src={SrIcon6} alt="" />
        </div>

        <div className="sr-indicator">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${current === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>

        <p className="sr-carousel-select-p">
          We create intuitive, eye-catching designs for web, apps, and brands
          that stand out in a crowded digital landscape.
        </p>
      </div>
    </div>
    </div>



     {/* ===============Sr development============ */}
    <div className="sr-design">
        <h1 className='sr-dev-h1'>Development</h1>
        <p className='sr-design-p'>Crafting experiences that resonate.</p>
  <div className="sr-carousel-con">
      <div
        className="sr-carousel-items"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
       <div
  className="sr-carousel-inner"
  style={{
    display: "flex",
    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: `translateX(-${current * (100 / 6)}%)`, // consistent step
    width: "600%", // 6 slides * 100%
  }}
>

          {/* Your exact same structure below */}
          <div className="sr-carousel-item">
            <img src={DesignC1} alt="" />
            <div className="sr-items">
              <h1>UI/UX Design</h1>
              <p>
                Beyond beautiful interfaces, we build seamless user journeys
                that drive engagement and conversion.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC2} alt="" />
            <div className="sr-items">
              <h1>Product Design</h1>
              <p>
                From concept to launch, we meticulously shape digital products
                for unparalleled user satisfaction and business impact.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC3} alt="" />
            <div className="sr-items">
              <h1>Mobile app Design</h1>
              <p>
                Strategically designed mobile experiences that are intuitive,
                beautiful, and built for your users' on-the-go lifestyle.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC4} alt="" />
            <div className="sr-items">
              <h1>Creative Design</h1>
              <p>
                A team of creative visionaries delivering high-impact graphics,
                thumbnails, and presentations that leave a lasting impression.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC5} alt="" />
            <div className="sr-items">
              <h1>Website Design</h1>
              <p>
                Bespoke websites and landing pages built to be the digital
                cornerstone of your business.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC6} alt="" />
            <div className="sr-items">
              <h1>Branding</h1>
              <p>
                We forge powerful brand identities and comprehensive guidelines
                that articulate your mission and vision with clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sr-carousel-select">
        <BtnNormsall text="Explore" />
        <div className="sr-icons">
          <img src={SrIcon1} alt="" />
          <img src={SrIcon2} alt="" />
          <img src={SrIcon3} alt="" />
          <img src={SrIcon4} alt="" />
          <img src={SrIcon5} alt="" />
          <img src={SrIcon6} alt="" />
        </div>

        <div className="sr-indicator">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${current === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>

        <p className="sr-carousel-select-p">
          We create intuitive, eye-catching designs for web, apps, and brands
          that stand out in a crowded digital landscape.
        </p>
      </div>
    </div>
    </div>



      {/* ===============Sr Production============ */}
    <div className="sr-design">
        <h1 className='sr-pro-h1'>Production</h1>
        <p className='sr-design-p'>Crafting experiences that resonate.</p>
  <div className="sr-carousel-con">
      <div
        className="sr-carousel-items"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
       <div
  className="sr-carousel-inner"
  style={{
    display: "flex",
    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: `translateX(-${current * (100 / 6)}%)`, // consistent step
    width: "600%", // 6 slides * 100%
  }}
>

          {/* Your exact same structure below */}
          <div className="sr-carousel-item">
            <img src={DesignC1} alt="" />
            <div className="sr-items">
              <h1>UI/UX Design</h1>
              <p>
                Beyond beautiful interfaces, we build seamless user journeys
                that drive engagement and conversion.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC2} alt="" />
            <div className="sr-items">
              <h1>Product Design</h1>
              <p>
                From concept to launch, we meticulously shape digital products
                for unparalleled user satisfaction and business impact.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC3} alt="" />
            <div className="sr-items">
              <h1>Mobile app Design</h1>
              <p>
                Strategically designed mobile experiences that are intuitive,
                beautiful, and built for your users' on-the-go lifestyle.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC4} alt="" />
            <div className="sr-items">
              <h1>Creative Design</h1>
              <p>
                A team of creative visionaries delivering high-impact graphics,
                thumbnails, and presentations that leave a lasting impression.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC5} alt="" />
            <div className="sr-items">
              <h1>Website Design</h1>
              <p>
                Bespoke websites and landing pages built to be the digital
                cornerstone of your business.
              </p>
            </div>
          </div>

          <div className="sr-carousel-item">
            <img src={DesignC6} alt="" />
            <div className="sr-items">
              <h1>Branding</h1>
              <p>
                We forge powerful brand identities and comprehensive guidelines
                that articulate your mission and vision with clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sr-carousel-select">
        <BtnNormsall text="Explore" />
        <div className="sr-icons">
          <img src={SrIcon1} alt="" />
          <img src={SrIcon2} alt="" />
          <img src={SrIcon3} alt="" />
          <img src={SrIcon4} alt="" />
          <img src={SrIcon5} alt="" />
          <img src={SrIcon6} alt="" />
        </div>

        <div className="sr-indicator">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${current === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>

        <p className="sr-carousel-select-p">
          We create intuitive, eye-catching designs for web, apps, and brands
          that stand out in a crowded digital landscape.
        </p>
      </div>
    </div>
    </div>

     
     {/* =============== sr-txt-con============ */}
      <div className="service-hero norm-pad">
        <div className="sh-top">
          <img src={Circleblur} alt="" />
          <h1 className="sh-top-h1">Why
Strix Production?</h1>
          <p className="sh-top-p">
             We craft transformative digital experiences that elevate brands and captivate audiences. Your vision, realized without compromise.
          </p>
          <BtnNormsall text='Know more' />
        </div>
      </div>


  {/* ===============portfolio============ */}

       <div className="portfolio sr-portfolio" >
       
                  <h1 className="section-header2 ">
                    Our Curated Portfolio
                  </h1>
          <div className="cl">
            <img  className="circleblur2" src={CircleBlur} alt="" />
            <Carousel />
            <div className="cl-btn">
            <ButtonSmall text="Portfolio" />
          </div>
          </div>
          
        </div>



    {/* ===============Booking============ */}

      <div className="booking" >
        <img src={Blur5} className="blur-booking-left" />
        <img src={Blur6} className="blur-booking-right" />
           <h1 className="section-header2">
                    Have  a project that <br /> deserves attention ?
                  </h1>
          <div className="second">
            <div className="left-booking">
              <p className="leave">
                <span>•</span>Leave a request
              </p>

              <div className="right-booking right-booking2">
                <img className="right-booking-img" src={Connect} alt="" />
              <p>
                Let's start <br /> your project
              </p>
            </div>
              <p className="sr-mobile" > We'd love to be challenged by you! Feel free to share your brief
                              with us</p>
            </div>
            <div className="right-booking">
              <img className="right-booking-img" src={Connect} alt="" />
              <p>
                Let's start <br /> your project
              </p>
            </div>
          </div>
          <Button text="Book Appointment" />
        </div>
      <Footer />
    </div>
  );
};

export default Service;
