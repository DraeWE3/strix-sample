import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Nav from '../../components/Navbar'
import Circleblur from '../../assets/img/sr-img.webp'
import Connect from '../../assets/img/connect.svg'
import BtnNormsall from '../../components/normSmall-btn';
import Footer from '../../components/Footer'
import Blur1 from '../../assets/img/p-blur2.png'
import Blur2 from '../../assets/img/p-blur1.png'
import Blur3 from '../../assets/img/Ellipse 7.png'
import BookTxt from '../../assets/img/Book-txt.png'
import Blur4 from '../../assets/img/Ellipse 8.png'
import Kundali from '../../assets/img/kundali-case-study.webp'
import { Play } from 'lucide-react';
import Circle from '../../assets/img/updown-circle.webp'
import '../../style/uiux.css'
import { Link } from 'react-router-dom'
import CardImg from '../../assets/img/ui-card.webp'
import Cardcon1 from '../../assets/img/ui-card1.png'
import Cardcon2 from '../../assets/img/ui-card2.png'
import ProjectCarousel from "../../components/projectCarouel";
import Button from "../../components/Button";
import ProjectCircle from '../../assets/img/project-circle.webp'
import HeroImg from '../../assets/img/serv.webp'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DotGrid from "../../animations/DotGrid";
import RotateCardsScroll from '../../animations/RotateCardsScroll'
import ScrollSlideAnimations from '../../animations/slideins'
import Stagger from '../../animations/stagger'
import ScrollAnimation from '../../animations/scrollReveal'
import SlideInFramerOnLoad from '../../animations/SlideInFramerOnLoad'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO'


gsap.registerPlugin(ScrollTrigger);

const Product = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoexRef = useRef(null)

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (window.innerWidth < 768) return
    if (!videoexRef.current) return
    const element = videoexRef.current

    const ctx = gsap.context(() => {
      gsap.to(element, {
        width: '85vw',
        height: '90vh',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  const CircleBlurAnimation = ({ src, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.img
        ref={ref}
        src={src}
        className={className}
        initial={{
          scale: 0.7,
          opacity: 0,
          x: "-50%",
        }}
        animate={
          isInView
            ? { scale: 1, opacity: 1, x: "-50%", }
            : { x: "-50%" }
        }
        transition={{
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          position: "absolute",
          left: "50%",
          transformOrigin: "center center",
        }}
      />
    );
  };

  return (
    <div>
      <SEO
        title="Product Design"
        description="Innovative product design services to create user-centered, visually appealing products at Strix Production."
      />
      <Nav />
      <SlideInFramerOnLoad />
      <ScrollAnimation />
      <RotateCardsScroll />
      <ScrollSlideAnimations />
      <Stagger />
      <DotGrid
        dotSize={2}
        gap={24}
        activeColor="#ffffff"
      />




      {/* =============== service-hero ============ */}
      <div className="service-hero">
        <div className="returnNext" >
          <Link to='/service'><button className="back-button">
            <ArrowLeft size={16} /> Return to Service
          </button></Link>

          <Link to='/cdesign'><button className="back-button">
            Next Service <ArrowRight size={16} />
          </button></Link>
        </div>
        <div className="sh-top uiux-hero">
          <img src={Circleblur} alt="" />
          <h1 className="slideinLoad">Product design</h1>
        </div>

        <div className="case-box-con uiu-con">
          <img src={Blur3} className="blur3-hero-left" alt="" />
          <img src={Blur4} className="blur3-hero-right" alt="" />
          <div
            ref={videoexRef}
            style={{
              width: '78vw',
              height: '90vh'
            }}
            className="video-card-container">
            {!isPlaying ? (
              <div className="video-thumbnail">
                <img
                  src={HeroImg}
                  alt="Video thumbnail"
                  className="thumbnail-image"
                />
                <div className="play-button-overlay">
                  <h2 className="sr-watch viewwork2">View work</h2>

                </div>
              </div>
            ) : (
              <div className="video-player">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/zk0mGoyUrLo?autoplay=1"
                  title="Video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
        <p className="ui-hero-p scrollReveal">We craft end-to-end product designs that bring bold ideas to life - balancing aesthetics, usability, and functionality for market-ready impact.</p>
        <img src={Blur1} className='p-blur1' alt="" />
        <img src={Blur2} className='p-blur2' alt="" />
      </div>

      {/* =================provide=========== */}
      <div className="provide-con">
        <div className="sh-top uiux-hero">
          <img src={Circleblur} alt="" />
          <h2 className="scrollReveal">What we provide</h2>
        </div>

        <div className="provide-grid">
          <div className="provide-card p-sec2-card1">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
                <img  src={Cardcon1} alt="" />
                <p>Build your on MVP</p>
              </div>
            </div>
            <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
            <BtnNormsall text="Get a quote" to="/contact" />
          </div>

          <div className="provide-card p-sec2-card2">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
                <img className="top-card-con1" src={Cardcon2} alt="" />
                <p>Hardware + Digital Interfaces</p>
              </div>
            </div>
            <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
            <BtnNormsall text="Get a quote" to="/contact" />
          </div>

          <div className="provide-card p-sec2-card1">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
                <img src={Cardcon1} alt="" />
                <p>Product Concept Development</p>
              </div>
            </div>
            <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
            <BtnNormsall text="Get a quote" to="/contact" />
          </div>

          <div className="provide-card p-sec2-card2">
            <div className="p-top-card">
              <img src={CardImg} alt="" />
              <div className="top-card-con">
                <img src={Cardcon1} alt="" />
                <p>Interactive product mockup</p>
              </div>
            </div>
            <p className="provide-card-p">At Strix Productions, we design, develop, and deliver world-class visuals and experience</p>
            <BtnNormsall text="Get a quote" to="/contact" />
          </div>


        </div>
      </div>

      {/* ===================why================== */}
      <div className="sh-top uiux-hero what-con">
        <img src={Circleblur} alt="" />
        <h2 className="scrollReveal">Why Choose us ?</h2>
        <p className="p-inde scrollReveal">Our UI/UX practice combines research, strategy, and sleek execution — helping startups and enterprises create designs that actually perform.</p>
      </div>

      <div className='project-carousel-con'>
        <CircleBlurAnimation className="ProjectCircle" src={ProjectCircle} />
        <h2>Related Projects</h2>
        <ProjectCarousel />
      </div>
      <div className="uiuxproinfo">
        <p>Projects tailored to your industry or need are available on request.</p>
        <BtnNormsall className="scrollReveal" text='Know more' />
      </div>

      {/* ==================booking====================== */}
      <div className="booking" >
        <h2 className='delay2'>Turn Your Vision Into an Experience That Lasts</h2>
        <div className="logo-slider logo-slider2">
          <div className="logo-track logo-track2">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <img src={BookTxt} alt="" className="loop-img" />
                <img src={BookTxt} alt="" className="loop-img" />
                <img src={BookTxt} alt="" className="loop-img" />
                <img src={BookTxt} alt="" className="loop-img" />
                <img src={BookTxt} alt="" className="loop-img" />
                <img src={BookTxt} alt="" className="loop-img" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Product