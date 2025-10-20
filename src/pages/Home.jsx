import React, { useEffect, useRef, useState } from "react";
import "../style/home.css";
import Light from "../assets/img/bg.webp";
import Nav from "../components/Navbar";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";
import CountUp from "../components/CountUp";
import Shadow3 from "../assets/img/shadow3.webp";
import VectorB from '../assets/img/b-vector.webp'
import Loop from "../components/Loop";
import Card from "../assets/img/card.webp";
import Star from "../assets/img/star.webp";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Star2 from "../assets/img/star2.webp";
import Card2 from "../assets/img/card1.webp";
import Card3 from "../assets/img/card3.webp";
import Cloud from "../assets/img/cloud.webp";
import Cloud2 from "../assets/img/cloud2.webp";
import Bolt from "../assets/img/bolt.webp";
import Bolt2 from "../assets/img/bolt2.webp";
import CircleBlur from "../assets/img/circle-blur.webp";
import TestImg from "../assets/img/test.webp";
import Mvp from "../assets/img/mvp.webp";
import Carousel from "../components/carousel";
import Coin from "../assets/img/coin-video.webm";
import Footer from "../components/Footer";
import TestimonialCarousel from "../components/testimonial";
// import useTiltMotion from "../components/threecard";
// import ScrollReveal from "../animations/scroolReveal";
// import AnimatedContent from "../animations/fadeUp";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import BlurText from "../animations/blur";
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
import Spotlight from "../components/spotlight";
import { Link } from "react-router-dom";


gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

// 🔹 Helper for responsive scrollTrigger start
const getScrollStart = () => {
  return window.innerWidth < 768 ? "top 90%" : "top 80%";
};

// 🚀 ENHANCED HEADER ANIMATION SYSTEM
const useAdvancedHeaderAnimation = (ref, animationType = "default") => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const headers = ref.current.querySelectorAll("h1, .section-header, .section-header2, .section-header3");
      
      headers.forEach((header, index) => {
        // Ensure header has relative positioning for animations
        header.style.position = 'relative';

        // Split text into characters/words
        const split = new SplitText(header, {
          type: "chars,words",
          charsClass: "char-reveal",
          wordsClass: "word-reveal",
        });

        // Add CSS for better 3D effects
        gsap.set(split.chars, {
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        });

        // Different animation types
        switch (animationType) {
          case "magnetic":
            // Magnetic pull-in effect
            gsap.set(split.chars, {
              y: 150,
              opacity: 0,
              rotationX: 90,
              scale: 0.3,
              filter: "blur(10px)",
            });

            gsap.to(split.chars, {
              y: 0,
              opacity: 1,
              rotationX: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.4,
              ease: "power4.out",
              stagger: {
                amount: 0.8,
                from: "center",
                grid: "auto",
              },
              scrollTrigger: {
                trigger: header,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            });
            break;

          case "glitch":
            // Glitch reveal effect
            gsap.set(split.chars, {
              y: 100,
              opacity: 0,
              skewX: 20,
            });

            gsap.to(split.chars, {
              y: 0,
              opacity: 1,
              skewX: 0,
              duration: 1.2,
              ease: "back.out(2)",
              stagger: {
                amount: 0.6,
                from: "random",
              },
              scrollTrigger: {
                trigger: header,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
            break;

          case "wave":
            // Wave ripple effect
            gsap.set(split.chars, {
              y: 80,
              opacity: 0,
              rotationY: 180,
              transformOrigin: "center center -50px",
            });

            gsap.to(split.chars, {
              y: 0,
              opacity: 1,
              rotationY: 0,
              duration: 1.5,
              ease: "elastic.out(1.2, 0.75)",
              stagger: {
                amount: 1.2,
                from: "start",
                ease: "sine.inOut",
              },
              scrollTrigger: {
                trigger: header,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
            break;

          case "typewriter":
            // Typewriter effect with cursor
            gsap.set(split.chars, {
              opacity: 0,
            });

            // Add cursor
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.cssText = 'color: #fff; animation: blink 1s infinite;';
            header.appendChild(cursor);

            gsap.to(split.chars, {
              opacity: 1,
              duration: 0.05,
              stagger: 0.08,
              scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
              onComplete: () => {
                gsap.to(cursor, { opacity: 0, duration: 0.5, delay: 0.5 });
              }
            });
            break;

          case "neon":
            // Neon sign flicker
            gsap.set(split.chars, {
              opacity: 0,
            });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: header,
                start: "top 80%",
                toggleActions: "play none none reverse",
              }
            });

            tl.to(split.chars, {
              opacity: 1,
              duration: 0.1,
              stagger: {
                amount: 0.8,
                from: "random",
              },
            });
            break;

          default:
            // Enhanced default with 3D rotation and blur
            gsap.set(split.chars, {
              y: 120,
              opacity: 0,
              rotationX: 90,
              rotationZ: 15,
              scale: 0.8,
              filter: "blur(8px)",
              transformOrigin: "center bottom",
            });

            gsap.to(split.chars, {
              y: 0,
              opacity: 1,
              rotationX: 0,
              rotationZ: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.6,
              ease: "power4.out",
              stagger: {
                amount: 0.8,
                from: "start",
              },
              scrollTrigger: {
                trigger: header,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            });
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, animationType]);
};

// Enhanced scroll animation for other elements
const useScrollAnimation = (ref) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const p = ref.current.querySelector(".p-up");
      const buttons = ref.current.querySelectorAll(".button-p");

      if (p) {
        gsap.from(p, {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: getScrollStart(),
          },
        });
      }

      if (buttons.length > 0) {
        gsap.from(buttons, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ref.current,
            start: getScrollStart(),
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [ref]);
};

const Home = () => {
  
  const [openModal, setOpenModal] = useState(null);
  const titleRef = useRef(null);
  const subTextRef = useRef(null);

  const containerRef = useRef(null);
  const handleAnimationComplete = () => {
    console.log("BlurText animation finished!");
  };

  // Keep your original hero animation unchanged
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

useEffect(() => {
  gsap.set(".mvp-card", { opacity: 0 });

  let mm = gsap.matchMedia();

  // Desktop version (scroll-based)
  mm.add("(min-width: 771px)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".mvp-cardcon",
        start: getScrollStart(),
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
        "-=0.4" // adjusted overlap since shorter durations
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

  return () => mm.revert(); // cleanup
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

  // Refs for each section with different animation types
  const exploreRef = useRef(null);
  const motionRef = useRef(null);
  const servicesRef = useRef(null);
  const mvpRef = useRef(null);
  const aboutRef = useRef(null);
  const portfolioRef = useRef(null);
  const testimonialRef = useRef(null);
  const bookingRef = useRef(null);

  // Apply different animation styles to each section
  useAdvancedHeaderAnimation(exploreRef, "default");
  useAdvancedHeaderAnimation(motionRef, "magnetic");
  useAdvancedHeaderAnimation(servicesRef, "magnetic");
  useAdvancedHeaderAnimation(mvpRef, "glitch");
  useAdvancedHeaderAnimation(aboutRef, "neon");
  useAdvancedHeaderAnimation(portfolioRef, "typewriter");
  useAdvancedHeaderAnimation(testimonialRef, "magnetic");
  useAdvancedHeaderAnimation(bookingRef, "magnetic");

  useScrollAnimation(exploreRef);
  useScrollAnimation(motionRef);
  useScrollAnimation(servicesRef);
  useScrollAnimation(mvpRef);
  useScrollAnimation(aboutRef);

  const velocityRef = useRef(null);

useEffect(() => {
  let mm = gsap.matchMedia();

  // Desktop (scroll-based)
  mm.add("(min-width: 771px)", () => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        velocityRef.current.children,
        {
          y: 100,
          opacity: 0,
          rotateX: 20,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: {
            amount: 0.6,
            from: "center",
          },
          scrollTrigger: {
            trigger: velocityRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, velocityRef);

    return () => ctx.revert();
  });

  // Mobile (runs immediately on load, no scrollTrigger)
  mm.add("(max-width: 770px)", () => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        velocityRef.current.children,
        {
          y: 60,
          opacity: 0,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        }
      );
    }, velocityRef);

    return () => ctx.revert();
  });

  return () => mm.revert();
}, []);





// ========================new set of animation============


const section = useRef(null); // ✅ renamed from container → section

  useEffect(() => {
    // ✅ Create smooth scrolling wrapper
    const smoother = ScrollSmoother.create({
      wrapper: section.current,
      content: section.current.querySelector(".content"),
      smooth: 2.5,
      effects: true,
    });

    // ✅ Animate each sectionCon
    gsap.utils.toArray(".sectionCon").forEach((sec) => {
      // Pull-in effect when entering
      gsap.fromTo(
        sec,
        { y: 150, opacity: 0, filter: "blur(20px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      // Blur-out effect when leaving
      gsap.to(sec, {
        filter: "blur(25px)",
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sec,
          start: "bottom 70%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    });

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);



// =======================link================


//======================= Animate Carousel blur + fade-in

 useEffect(() => {
   


    gsap.from(".cl", {
      filter: "blur(30px)",
      opacity: 0,
      y: 30,
      duration: 1.8,
      ease: "power2.out",
      marker: true,
      scrollTrigger: {
        trigger: ".portfolio",
        start: "top center",
        toggleActions: "play none none reverse",
      },
    });

  // Fade-in from top for Button
    gsap.from(".cl-btn", {
      opacity: 0,
      y: -40,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".portfolio",
        start: "top top",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  



  return (
    <div>
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .char-reveal, .word-reveal {
          display: inline-block;
          will-change: transform, opacity, filter;
        }
        
        .section-header, .section-header2, .section-header3 {
          overflow: hidden;
          position: relative;
        }
      `}</style>

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
      {/* Top Input */}
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

      {/* Heading */}
      <motion.h1 className="power-desk" variants={itemVariants}>
        Powering Brands with Design & Technology
      </motion.h1>
      <motion.p className="power-mobile" variants={itemVariants}>
        Powering Brands with Design & Technology
      </motion.p>

      {/* Bottom Input */}
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

      {/* Buttons */}
      <motion.div className="button-p flex gap-4 mt-6" variants={itemVariants}>
        <ButtonArrow text="Get Started" />
        <Button text="Explore Work" />
      </motion.div>

      {/* Shadows with side fade-in */}
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

      {/* =================explore================ */}

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
       <ButtonArrow text="Get Started"  />
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

  {/* ================motion================ */}

        <div className="motion sectionCon">
          <img src={Shadow3} alt="" className="shadow3" />
          <img src={VectorB} alt="" className="Vector1" />


     
       <h1 className="section-header2">Real Work. Real Results</h1>

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

            <p className="motion-p p-up">
              Trusted by brands that demand Excellence - we deliver creative-tech
              solutions that don't just look good, they perform where it matters
            </p>
            <Button text="Explore Cases" />
        </div>

    {/* ==============logo-loop================= */}

        <div className="logo-loop sectionCon">
          <Loop />
        </div>


    {/* ==============service=============== */}

        <div className="services sectionCon" >
             <h1 className="section-header">
               We Build Experiences that Breathe
             </h1>

          <img className="circleblur"  src={CircleBlur} alt="" />

          <div ref={velocityRef} className="altcard flex gap-8 justify-center">
      <div className="card-con">
        <img src={Card} alt="" className="card-img" />
        <img src={Star} alt="" className="card-icon" />
        <img src={Star2} alt="" className="card-icon2" />
        <div className="card-content">
          <h2>Design</h2>
          <p className="card-content-p">Crafted to Captivate</p>
          <div className="btn-con">
            <CardBtn onClick={() => setOpenModal("design")}text="Know more" />
          </div>
        </div>
        <div className="glow"></div>
      </div>

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
    </div>

     <DevelopmentModal isOpen={openModal === "dev"} onClose={() => setOpenModal(null)} />
      <DesignModal isOpen={openModal === "design"} onClose={() => setOpenModal(null)} />
      <ResearchModal isOpen={openModal === "research"} onClose={() => setOpenModal(null)} />

          <p className="services-p p-up">
            From visuals that speak to systems that scale - We deliver
            end-to-end solutions that define, design, and develop your brand's
            digital presence
          </p>
          <Button text="Our Services" />
        </div>

        {/* ==============mvp============= */}
  

        <div className="sectionCon services services-mvp" >
                  <h1 className="section-header">From Idea to Market in 4 Weeks</h1>

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
                  <CardBtn text="Know more"/>
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
                  <CardBtn text="Know more"/>
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
                  <CardBtn text="Know more"/>
                </div>
              </div>
            </div>
          </div>
           {/* <Spotlight /> */}
          <p className="services-p p-up">
            We don't just design and develop - we help founders validate and
            launch market-ready MVPs with speed, clarity, and impact.
          </p>
          <ButtonSmall text="Build MVP" />
        </div>


      {/* ===============production================ */}

       <section className="sectionCon services service-pro relative">
      <h1 className="section-header3">Strix Production</h1>

      <div className="coin-con flex justify-center items-center">
        <video
          className="coin-anime"
          src={Coin}
          playsInline
          muted
        ></video>
      </div>

      <p className="services-p p-up">
        Not just another agency — Strix combines design, development,
        production, and MVP expertise to help brands and startups scale faster.
      </p>

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


      {/* =================portfolio============== */}

          <div className="zle portfolio relative">
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

      <h1 className="section-header2">Our Craft, Your Expression.</h1>

      <div className="links">
        <p className="link-button">Branding</p>
        <p className="link-button">Websites</p>
        <p className="link-button">All</p>
        <p className="link-button">UI/UX</p>
        <p className="link-button">Media</p>
      </div>

      <div className="cl relative flex flex-col items-center justify-center">
        <img className="circleblur2 absolute" src={CircleBlur} alt="" />
        <Carousel />
        <div className="cl-btn mt-10">
          <ButtonSmall text="Portfolio" />
        </div>
      </div>
    </div>


    {/* ==============test================== */}

        <div className="sectionCon testimonial-con" >
           <h1 className="section-header2">
                    What our clients say
                  </h1>
                    <p className="text-pp">
            Real stories from the brands and people we've helped grow, design,
            and stand out
          </p>
          <TestimonialCarousel />
        </div>


    {/* ============booking================ */}

        <div className="zle booking" >
           <h1 className="section-header2">
                    Turn Your Idea Into a <br /> Market-Ready MVP That Lasts
                  </h1>
          <div className="second">
            <div className="left-booking">
              <p className="leave">
                <span>•</span>Leave a request
              </p>

              <Link to='/contact'><div className="right-booking right-booking2">
              <p>
                Let's start <br /> your project
              </p>
            </div></Link>
              <p className="sr-mobile" > We'd love to be challenged by you! Feel free to share your brief
                              with us</p>
            </div>
           <Link to='/contact'>
            <div className="right-booking">
              <p>
                Let's start <br /> your project
              </p>
            </div></Link>
          </div>
          <Button text="Book Appointment" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;