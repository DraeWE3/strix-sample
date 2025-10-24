import React, { useState, useRef, useEffect } from "react";
import "../style/home.css";
import Light from "../assets/img/bg.webp";
import Nav from "../components/Navbar";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Button from "../components/Button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Connect from '../assets/img/connect.svg'

gsap.registerPlugin(ScrollTrigger);
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";
import CountUp from "../components/CountUp";
import Shadow3 from "../assets/img/shadow3.webp";
import VectorB from '../assets/img/b-vector.webp'
import Loop from "../components/Loop";
import Card from "../assets/img/card.webp";
import Star from "../assets/img/star.webp";
import Star2 from "../assets/img/star2.webp";
import Card2 from "../assets/img/card1.webp";
import Card3 from "../assets/img/card3.webp";
import Cloud from "../assets/img/cloud.webp";
import Cloud2 from "../assets/img/cloud2.webp";
import Bolt from "../assets/img/bolt.webp";
import Bolt2 from "../assets/img/bolt2.webp";
import CircleBlur from "../assets/img/circle-blur.webp";
import Mvp from "../assets/img/mvp.webp";
import Carousel from "../components/carousel";
import Coin from "../assets/img/coin-video.webm";
import Footer from "../components/Footer";
import TestimonialCarousel from "../components/testimonial";
import LightMobile from "../assets/img/mobile-hero.webp";
import MvpReasearch from '../assets/img/mpv-research.png'
import MvpDev from '../assets/img/mvp-dev.png'
import MvpDesign from '../assets/img/mvp-design.png'
import ButtonArrow from "../components/button-arrow";
import ButtonSmall from "../components/btn-small";
import BtnNormsall from "../components/normSmall-btn";
import DevelopmentModal from "../components/DevelopmentModal";
import DesignModal from "../components/DesignModal";
import ResearchModal from "../components/production";
import CardBtn from "../components/cardBtn";
import Shadow4 from '../assets/img/shadow4.webp'
import { Link } from "react-router-dom";

// Smooth text reveal animation component
const SmoothTextReveal = ({ children, className = "", delay = 0, as = "div" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Component = motion[as];

  return (
    <Component
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </Component>
  );
};

// Blur text animation component
const BlurTextReveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.h1
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { 
        opacity: 1, 
        filter: "blur(0px)"
      } : { 
        opacity: 0, 
        filter: "blur(10px)"
      }}
      transition={{ 
        duration: 1, 
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.h1>
  );
};

// Random text scramble animation component
const ScrambleText = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayText, setDisplayText] = useState(children);
  const originalText = children;

  useEffect(() => {
    if (!isInView) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()';
    let iteration = 0;
    const totalIterations = 30;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1;

      if (iteration > originalText.length) {
        clearInterval(interval);
        setDisplayText(originalText);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isInView, originalText]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {displayText}
    </motion.p>
  );
};


const CircleBlurAnimation = ({ src, className = "" }) => {
  // ✅ define ref first
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
         // preserve centering
      }}
      animate={
        isInView
          ? { scale: 1, opacity: 1, x: "-50%",  } // keep translate during animation
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

const Home = () => {
  const [openModal, setOpenModal] = useState(null);
  const titleRef = useRef(null);
  const subTextRef = useRef(null);
  const velocityRef = useRef(null);
  const section = useRef(null);

  // Hero animation for title and subtitle
  useEffect(() => {
    gsap.set(titleRef.current, {
      opacity: 0,
      visibility: "hidden",
      scale: 1.2,
      letterSpacing: "140px",
      y: 100,
      filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
    });

    gsap.set(subTextRef.current, {
      opacity: 0,
      visibility: "hidden",
      y: 60,
    });

    const tl = gsap.timeline();

    tl.to(titleRef.current, {
      opacity: 1,
      visibility: "visible",
      scale: 1,
      letterSpacing: "90px",
      y: 0,
      filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.474))",
      ease: "power4.out",
      duration: 2.5,
    });

    tl.to(
      subTextRef.current,
      {
        opacity: 1,
        visibility: "visible",
        y: 0,
        ease: "power3.out",
        duration: 1.8,
      },
      "-=0.8"
    );
  }, []);

  // MVP Card animation
  useEffect(() => {
    gsap.set(".mvp-card", { opacity: 0 });

    let mm = gsap.matchMedia();

    // Desktop version (scroll-based)
    mm.add("(min-width: 771px)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: ".mvp-cardcon",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
        .to(".mvp-card1", {
          opacity: 1,
          x: -260,
          y: 0,
          rotate: -18,
          duration: 1.2,
          ease: "power3.out",
        })
        .to(
          ".mvp-card2",
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.9"
        )
        .to(
          ".mvp-card3",
          {
            opacity: 1,
            x: 260,
            y: 0,
            rotate: 18,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.9"
        );
    });

    // Mobile version (runs immediately on load, no scrollTrigger)
    mm.add("(max-width: 770px)", () => {
      gsap.timeline()
        .to(".mvp-card1", {
          opacity: 1,
          x: -150,
          y: 0,
          rotate: -20,
          duration: 0.5,
          ease: "power3.out",
        })
        .to(
          ".mvp-card2",
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          ".mvp-card3",
          {
            opacity: 1,
            x: 150,
            y: 0,
            rotate: 20,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        );
    });

    return () => mm.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInSide = (direction) => ({
    hidden: { opacity: 0, x: direction === "left" ? -80 : 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.6 },
    },
  });

  // Card animation variants for services section
  const ServiceCard = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ 
          opacity: 0, 
          y: 100, 
          scale: 0.8,
          rotateX: 45
        }}
        animate={isInView ? { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotateX: 0
        } : { 
          opacity: 0, 
          y: 100, 
          scale: 0.8,
          rotateX: 45
        }}
        transition={{ 
          duration: 1, 
          delay, 
          ease: [0.25, 0.4, 0.25, 1],
          type: "spring",
          stiffness: 50,
          damping: 15
        }}
        whileHover={{
          y: -10,
          transition: { duration: 0.3 }
        }}
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        {children}
      </motion.div>
    );
  };

  const PortfolioLink = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // detect screen width
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <motion.p
      ref={ref}
      className="link-button"
      initial={isMobile ? false : { opacity: 0, x: -50 }}
      animate={isMobile ? false : (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 })}
      transition={
        isMobile
          ? { duration: 0 } // disable animation entirely
          : { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }
      }
      whileHover={
        isMobile
          ? {} // no hover animation on mobile
          : { scale: 1.05, transition: { duration: 0.2 } }
      }
    >
      {children}
    </motion.p>
  );
};


  return (
    <div>
      <div className="app" id="smooth-wrapper" ref={section}>
        <Nav />
        <div className="hero sectionCon">
          <h1 className="spread-h1" ref={titleRef}>STRIX</h1>
          <p className="spread-txt" ref={subTextRef}>Where Creative Strategy Meets Scalable Technology</p>
          <div className="half-circle-container">
            <svg className="half-circle-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="halfCircleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.9 }} />
                  <stop offset="50%" style={{ stopColor: "#f8f8f8", stopOpacity: 0.95 }} />
                  <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 0.9 }} />
                </linearGradient>
              </defs>
              <path className="half-circle-path" d="M 50 0 A 150 150 0 0 0 350 0" />
            </svg>
          </div>
          <img src={Light} alt="" className="underlay" />
          <img src={LightMobile} alt="" className="underlay-mobile" />

          <motion.div
            className="explore explore-mobile relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="section-container2" variants={itemVariants}>
              <div className="blur-box">
                <motion.input
                  type="text"
                  placeholder="Type here..."
                  variants={itemVariants}
                />
              </div>
              <motion.div className="image-box" variants={itemVariants}>
                <p></p>
              </motion.div>
            </motion.div>

            <motion.h1 className="power-desk" variants={itemVariants}>
              Powering Brands with Design & Technology
            </motion.h1>
            <motion.p className="power-mobile" variants={itemVariants}>
              Powering Brands with Design & Technology
            </motion.p>

            <motion.div className="section-container" variants={itemVariants}>
              <div className="blur-box">
                <motion.input
                  type="text"
                  placeholder="Type here..."
                  variants={itemVariants}
                />
              </div>
              <motion.div className="image-box" variants={itemVariants}>
                <p></p>
              </motion.div>
            </motion.div>

            <motion.div className="button-p flex gap-4 mt-6" variants={itemVariants}>
              <ButtonArrow text="Get Started" />
              <Button text="Explore Work" />
            </motion.div>

            <motion.img
              src={Shadow1}
              alt=""
              className="shadow1 absolute top-10 left-0 w-40"
              variants={fadeInSide("right")}
            />
            <motion.img
              src={Shadow2}
              alt=""
              className="shadow2 absolute bottom-0 right-0 w-40"
              variants={fadeInSide("left")}
            />
          </motion.div>
        </div>

        <div className="sectionCon explore relative overflow-hidden explore-desk">
          <div className="section-container2">
            <div className="blur-box">
              <input type="text" placeholder="Type here..." />
            </div>
            <div className="image-box">
              <p></p>
            </div>
          </div>

          <h1 className="power-desk section-header">Powering Brands with Design & Technology</h1>
          <p className="power-mobile">Powering Brands with Design & Technology</p>

          <div className="section-container">
            <div className="blur-box">
              <input type="text" placeholder="Type here..." />
            </div>
            <div className="image-box">
              <p></p>
            </div>
          </div>

          <div className="button-p flex gap-4 mt-6">
            <ButtonArrow text="Get Started" />
            <Button text="Explore Work" />
          </div>
          <img
            src={Shadow1}
            alt=""
            className="shadow1 absolute top-10 left-0 w-40"
          />
          <img
            src={Shadow2}
            alt=""
            className="shadow2 absolute bottom-0 right-0 w-40"
          />
        </div>

        <div className="motion sectionCon">
          <img src={Shadow3} alt="" className="shadow3" />
          <img src={VectorB} alt="" className="Vector1" />

          <SmoothTextReveal as="h1" className="section-header2">Real Work. Real Results</SmoothTextReveal>

          <div className="number-container">
            <img src={Shadow4} className="shadow4" alt="" />
            <div className="num1">
              <div>
                <CountUp
                  from={10}
                  to={20}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text"
                />
                <span>+</span>
              </div>
              <p>Conversions</p>
            </div>

            <div className="num1">
              <div>
                <CountUp
                  from={200}
                  to={220}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text"
                />
                <span>+</span>
              </div>
              <p>Projects</p>
            </div>

            <div className="num1">
              <div>
                <CountUp
                  from={80}
                  to={90}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text"
                />
                <span>%</span>
              </div>
              <p>Client-Retention</p>
            </div>

            <div className="num1">
              <div>
                <h1 className="count-up-text">∞</h1>
              </div>
              <p>Potential</p>
            </div>
          </div>

          <SmoothTextReveal as="p" className="motion-p p-up" delay={0.2}>
            Trusted by brands that demand Excellence - we deliver creative-tech
            solutions that don't just look good, they perform where it matters
          </SmoothTextReveal>
          <Button text="Explore Cases" />
        </div>

        <div className="logo-loop sectionCon">
          <Loop />
        </div>

        <div className="services circcon sectionCon">
          <SmoothTextReveal as="h1" className="section-header">
            We Build Experiences that Breathe
          </SmoothTextReveal>

       <CircleBlurAnimation className="circleblur circleblurtop" src={CircleBlur} />


          <div ref={velocityRef} className="altcard flex gap-8 justify-center">
            <ServiceCard delay={0}>
              <div className="card-con card-con1">
                <img src={Card} alt="" className="card-img" />
                <img src={Star} alt="" className="card-icon" />
                <img src={Star2} alt="" className="card-icon2" />
                <div className="card-content">
                  <h2>Design</h2>
                  <p className="card-content-p">Crafted to Captivate</p>
                  <div className="btn-con">
                    <CardBtn onClick={() => setOpenModal("design")} text="Know more" />
                  </div>
                </div>
                <div className="glow"></div>
              </div>
            </ServiceCard>

            <ServiceCard delay={0.2}>
              <div className="card-con card-con2">
                <img src={Card2} alt="" className="card-img" />
                <img src={Cloud} alt="" className="card-icon" />
                <img src={Cloud2} alt="" className="card-icon2" />
                <div className="card-content">
                  <h2>Development</h2>
                  <p className="card-content-p">Engineered for Performance</p>
                  <div className="btn-con">
                    <CardBtn onClick={() => setOpenModal("dev")} text="Know more" />
                  </div>
                </div>
                <div className="glow glow2"></div>
              </div>
            </ServiceCard>

            <ServiceCard delay={0.4}>
              <div className="card-con">
                <img src={Card3} alt="" className="card-img" />
                <img src={Bolt} alt="" className="card-icon" />
                <img src={Bolt2} alt="" className="card-icon2" />
                <div className="card-content">
                  <h2>Production</h2>
                  <p className="card-content-p">Elevate your content</p>
                  <div className="btn-con">
                    <CardBtn onClick={() => setOpenModal("research")} text="Know more" />
                  </div>
                </div>
                <div className="glow glow3"></div>
              </div>
            </ServiceCard>
          </div>

          <DevelopmentModal isOpen={openModal === "dev"} onClose={() => setOpenModal(null)} />
          <DesignModal isOpen={openModal === "design"} onClose={() => setOpenModal(null)} />
          <ResearchModal isOpen={openModal === "research"} onClose={() => setOpenModal(null)} />

          <SmoothTextReveal as="p" className="services-p p-up" delay={0.3}>
            From visuals that speak to systems that scale - We deliver
            end-to-end solutions that define, design, and develop your brand's
            digital presence
          </SmoothTextReveal>
          <Button text="Our Services" />
        </div>

        <div className="sectionCon services services-mvp">
          <SmoothTextReveal as="h1" className="section-header">From Idea to Market in 4 Weeks</SmoothTextReveal>
          <div className="mvp-cardcon mvp-desk">
            <img
              src={Shadow1}
              alt=""
              className="shadow1 shdowsmall absolute top-10 left-0 w-40"
            />
            <img
              src={Shadow2}
              alt=""
              className="shadow2 mpv-shad shdowsmall absolute bottom-0 right-0 w-40"
            />

            <div className="mvp-card mvp-card1">
              <img className="mvp-img" src={Mvp} alt="" />
              <img className="mvp-img-ab" src={MvpDev} alt="" />
              <div className="mvp-content">
                <h2>
                  MVP <br /> Research
                </h2>
                <div className="btn-con2">
                  <p className="mvp-ptxt">Shape your concept into a roadmap</p>
                  <CardBtn text="Know more" />
                </div>
              </div>
            </div>

            <div className="mvp-card mvp-card2">
              <img className="mvp-img" src={Mvp} alt="" />
              <img className="mvp-img-ab" src={MvpDesign} alt="" />
              <div className="mvp-content">
                <h2>
                  MVP <br /> Design
                </h2>
                <div className="btn-con2">
                  <p className="mvp-ptxt">Create intuitive flows, protoypes & More</p>
                  <CardBtn text="Know more" />
                </div>
              </div>
            </div>

            <div className="mvp-card mvp-card3">
              <img className="mvp-img" src={Mvp} alt="" />
              <img className="mvp-img-ab" src={MvpReasearch} alt="" />
              <div className="mvp-content">
                <h2>
                  MVP <br /> Development
                </h2>
                <div className="btn-con2">
                  <p className="mvp-ptxt">Full-stack, scalable builds</p>
                  <CardBtn text="Know more" />
                </div>
              </div>
            </div>
          </div>

          <SmoothTextReveal as="p" className="services-p p-up" delay={0.2}>
            We don't just design and develop - we help founders validate and
            launch market-ready MVPs with speed, clarity, and impact.
          </SmoothTextReveal>
          <ButtonSmall text="Build MVP" />
        </div>

        <section className="sectionCon services service-pro relative">
          <SmoothTextReveal as="h1" className="section-header3">Strix Production</SmoothTextReveal>

          <div className="coin-con flex justify-center items-center">
            <video
              className="coin-anime"
              src={Coin}
              playsInline
              muted
            ></video>
          </div>

          <SmoothTextReveal as="p" className="services-p p-up" delay={0.2}>
            Not just another agency — Strix combines design, development,
            production, and MVP expertise to help brands and startups scale faster.
          </SmoothTextReveal>

          <BtnNormsall text="About us" />

          <img
            src={Shadow1}
            alt=""
            className="shadow1 absolute top-10 left-0 w-40"
          />
          <img
            src={Shadow2}
            alt=""
            className="shadow2 absolute bottom-0 right-0 w-40"
          />
        </section>

        <div className="zle circcon portfolio relative">
          <img
            src={Shadow1}
            alt=""
            className="shadow1 shadowmed absolute top-10 left-0 w-40"
          />
          <img
            src={Shadow2}
            alt=""
            className="shadow2 shadowmed absolute bottom-0 right-0 w-40"
          />

          <SmoothTextReveal as="h1" className="section-header2">Our Craft, Your Expression.</SmoothTextReveal>

          <div className="links">
            <PortfolioLink delay={0}>Branding</PortfolioLink>
            <PortfolioLink delay={0.1}>Websites</PortfolioLink>
            <PortfolioLink delay={0.2}>All</PortfolioLink>
            <PortfolioLink delay={0.3}>UI/UX</PortfolioLink>
            <PortfolioLink delay={0.4}>Media</PortfolioLink>
          </div>

          <div className="cl relative flex flex-col items-center justify-center">
         <CircleBlurAnimation className="circleblur2 circleblurtop" src={CircleBlur} />

            <Carousel />
            <div className="cl-btn mt-10">
              <ButtonSmall text="Portfolio" />
            </div>
          </div>
        </div>

        <div className="sectionCon testimonial-con">
          <SmoothTextReveal as="h1" className="section-header2">
            What our clients say
          </SmoothTextReveal>
          <SmoothTextReveal as="p" className="text-pp" delay={0.2}>
            Real stories from the brands and people we've helped grow, design,
            and stand out
          </SmoothTextReveal>
          <TestimonialCarousel />
        </div>

        <div className="zle booking">
          <BlurTextReveal>
            Turn Your Idea Into a <br /> Market-Ready MVP That Lasts
          </BlurTextReveal>
          <div className="second">
            <div className="left-booking">
              <p className="leave">
                <span>•</span>Leave a request
              </p>

              <Link to='/contact'>
                <div className="right-booking right-booking2">
                  <img className="right-booking-img" src={Connect} alt="" />
                  <p>
                    Let's start <br /> your project
                  </p>
                </div>
              </Link>
              <ScrambleText className="sr-mobile">
                We'd love to be challenged by you! Feel free to share your brief with us
              </ScrambleText>
            </div>
            <Link to='/contact'>
              <div className="right-booking">
                <img className="right-booking-img" src={Connect} alt="" />
                <p>
                  Let's start <br /> your project
                </p>
              </div>
            </Link>
          </div>
          <Button text="Book Appointment" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;