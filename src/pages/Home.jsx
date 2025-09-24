import React, { useEffect, useRef } from "react";
import "../style/home.css";
import Light from "../assets/img/bg.webp";
import Nav from "../components/Navbar";
import Bg from "../assets/img/bgg.webm";
import Button from "../components/Button";
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";
import CountUp from "../components/CountUp";
import Shadow3 from "../assets/img/shadow3.webp";
import Vector1 from "../assets/img/Vector.svg";
import Loop from "../components/Loop";
import Card from "../assets/img/card.webp";
import Star from "../assets/img/star.webp";
import Star2 from "../assets/img/star2.webp";
import Card2 from "../assets/img/card1.webp";
import Card3 from "../assets/img/card2.webp";
import Cloud from "../assets/img/cloud.webp";
import Cloud2 from "../assets/img/cloud2.webp";
import Bolt from "../assets/img/bolt.webp";
import Bolt2 from "../assets/img/bolt2.webp";
import CircleBlur from "../assets/img/circle-blur.webp";
import TestImg from "../assets/img/test.webp";
import Mvp from "../assets/img/mvp.webp";
import Carousel from "../components/carousel";
import Coin from "../assets/img/Coin-anime.mp4";
import Footer from "../components/Footer";
import { ButtonI } from "../components/ButtonI";
import TestimonialCarousel from "../components/testimonial";
import useTiltMotion from "../components/threecard";
import ScrollReveal from "../animations/scroolReveal";
import AnimatedContent from "../animations/fadeUp";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import BlurText from "../animations/blur";
import LightMobile from "../assets/img/mobile-hero.webp";

gsap.registerPlugin(ScrollTrigger, SplitText);

// 🔹 Helper for responsive scrollTrigger start
const getScrollStart = () => {
  return window.innerWidth < 768 ? "top 90%" : "top 80%";
};

const useScrollAnimation = (ref) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const h1 = ref.current.querySelector("h1");
      const p = ref.current.querySelector(".p-up");
      const buttons = ref.current.querySelectorAll(".button-p");

      if (h1) {
        const split = new SplitText(h1, {
          type: "chars",
          charsClass: "split-char",
        });

        gsap.from(split.chars, {
          y: 80,
          opacity: 0,
          rotateX: 50,
          stagger: 0.04,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ref.current,
            start: getScrollStart(), // 🔹 responsive start
          },
        });
      }

      if (p) {
        gsap.from(p, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: getScrollStart(), // 🔹 responsive start
          },
        });
      }

      if (buttons.length > 0) {
        gsap.from(buttons, {
          y: 40,
          opacity: 0,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ref.current,
            start: getScrollStart(), // 🔹 responsive start
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [ref]);
};

const Home = () => {
  const titleRef = useRef(null);
  const subTextRef = useRef(null);

  const containerRef = useRef(null);
  const handleAnimationComplete = () => {
    console.log("BlurText animation finished!");
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        scale: 1.2,
        letterSpacing: "140px",
        y: 100,
        filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
      },
      {
        opacity: 1,
        scale: 1,
        letterSpacing: "90px",
        y: 0,
        filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.474))",
        ease: "power4.out",
        duration: 2.5,
      }
    );

    tl.fromTo(
      subTextRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        duration: 1.8,
      },
      "-=0.8"
    );
  }, []);

  useEffect(() => {
    gsap.set(".mvp-card", { opacity: 0 }); // start hidden

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mvp-cardcon",
        start: getScrollStart(), // 🔹 responsive start
        toggleActions: "play none none reverse",
      },
    });

    tl.to(".mvp-card1", {
      opacity: 1,
      x: -220,
      y: -120,
      rotate: -12,
      duration: 1.2,
      ease: "power3.out",
    })
      .to(
        ".mvp-card2",
        {
          opacity: 1,
          x: 0,
          y: -200,
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
          x: 220,
          y: -240,
          rotate: 12,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.9"
      );
  }, []);

  

  // Refs for each section
  const exploreRef = useRef(null);
  const motionRef = useRef(null);
  const servicesRef = useRef(null);
  const mvpRef = useRef(null);
  const aboutRef = useRef(null);

  useScrollAnimation(exploreRef);
  useScrollAnimation(motionRef);
  useScrollAnimation(servicesRef);
  useScrollAnimation(mvpRef);
  useScrollAnimation(aboutRef);


  
  const velocityRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        velocityRef.current.children,
        {
          y: 100,       // cards slide up into place
          opacity: 0,   // fade in
          rotateX: 20,  // subtle 3D entry
          scale: 0.95,  // start slightly smaller
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: {
            amount: 0.6, // spread out the animation across cards
            from: "center", // animate from middle outwards
          },
          scrollTrigger: {
            trigger: velocityRef.current,
            start: "top 80%",  // when container hits 80% of viewport
            toggleActions: "play none none reverse", // replay on scroll up
          },
        }
      );
    }, velocityRef);

    return () => ctx.revert();
  }, []);

  return (
    <div>

      <div className="app">
        <Nav />
        <div className="hero">
          <h1 ref={titleRef}>STRIX</h1>
          <p ref={subTextRef}>Where Creative Strategy Meets Scalable Technology</p>
           <div className="half-circle-container">
      <svg className="half-circle-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="halfCircleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.9 }} />
            <stop offset="50%" style={{ stopColor: "#f8f8f8", stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 0.9 }} />
          </linearGradient>
        </defs>
        {/* Flipped downward half circle */}
        <path className="half-circle-path" d="M 50 0 A 150 150 0 0 0 350 0" />
      </svg>

      {/* Underlay image that fades in */}
    </div>
          <img src={Light} alt="" className="underlay" />
          <img src={LightMobile} alt="" className="underlay-mobile" />
        </div>

        {/* =====================explore==================== */}
      <div ref={exploreRef} className="explore relative overflow-hidden">

          <div className="section-container2">
      {/* First item: blurred background with input */}
      <div className="blur-box">
        <input type="text" placeholder="Type here..." />
      </div>

      {/* Second item: background image with centered content */}
      <div className="image-box">
        <p></p>
      </div>
    </div>


      <h1 className="power-desk">Powering Brands with Design & Technology</h1>
        <p className="power-mobile">Powering Brands with Design & Technology</p>


       <div className="section-container">
      {/* First item: blurred background with input */}
      <div className="blur-box">
        <input type="text" placeholder="Type here..." />
      </div>

      {/* Second item: background image with centered content */}
      <div className="image-box">
        <p></p>
      </div>
    </div>

      <div className="button-p flex gap-4 mt-6">
        <Button text="Get Started" />
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

        {/* =====================motion==================== */}
        <div className="motion" ref={motionRef}>
          <img src={Shadow3} alt="" className="shadow3" />
          <img src={Vector1} alt="" className="Vector1" />

        <BlurText
        text="Real Work. Real Results"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-2xl mb-8"
      />

          <div className="number-container">
            {/* Conversions */}
            <div className="num1">
              <div>
                <CountUp
                  from={0}
                  to={300}
                  separator=","
                  direction="up"
                  duration={5}
                  className="count-up-text"
                />
                <span>+</span>
              </div>
              <p>Conversions</p>
            </div>

            {/* Projects */}
            <div className="num1">
              <div>
                <CountUp
                  from={0}
                  to={220}
                  separator=","
                  direction="up"
                  duration={5}
                  className="count-up-text"
                />
                <span>+</span>
              </div>
              <p>Projects</p>
            </div>

            {/* Client Retention */}
            <div className="num1">
              <div>
                <CountUp
                  from={0}
                  to={90}
                  separator=","
                  direction="up"
                  duration={5}
                  className="count-up-text"
                />
                <span>+</span>
              </div>
              <p>Client-Retention</p>
            </div>

            {/* Potential */}
            <div className="num1">
              <div>
                <h1 className="count-up-text">∞</h1>
              </div>
              <p>Potential</p>
            </div>
          </div>

            <p className="motion-p p-up">
              Trusted by brands that demand Excellence - we deliver creative-tech
              solutions that don’t just look good, they perform where it matters
            </p>
            <Button text="Explore Cases" />
        </div>

        {/* ====================logo loop================== */}
        <div className="logo-loop">
          <Loop />
        </div>

        {/* ===================services=================== */}
        <div className="services" ref={servicesRef}>
            <BlurText

  text=" We Build Experiences that Breathe"

  delay={150}

  animateBy="words"

  direction="top"


  onAnimationComplete={handleAnimationComplete}

  className="text-2xl mb-8"

/>

          <img className="circleblur"  src={CircleBlur} alt="" />

          <div ref={velocityRef} className="altcard flex gap-8 justify-center">
      {/* Card 1 */}
      <div className="card-con">
        <img src={Card} alt="" className="card-img" />
        <img src={Star} alt="" className="card-icon" />
        <img src={Star2} alt="" className="card-icon2" />
        <div className="card-content">
          <h2>Design</h2>
          <p className="card-content-p">Crafted to Captivate</p>
          <div className="btn-con">
            <Button />
          </div>
        </div>
        <div className="glow"></div>
      </div>

      {/* Card 2 */}
      <div className="card-con card-con2">
        <img src={Card2} alt="" className="card-img" />
        <img src={Cloud} alt="" className="card-icon" />
        <img src={Cloud2} alt="" className="card-icon2" />
        <div className="card-content">
          <h2>Development</h2>
          <p className="card-content-p">Engineered for Performance</p>
          <div className="btn-con">
            <Button />
          </div>
        </div>
        <div className="glow glow2"></div>
      </div>

      {/* Card 3 */}
      <div className="card-con">
        <img src={Card3} alt="" className="card-img" />
        <img src={Bolt} alt="" className="card-icon" />
        <img src={Bolt2} alt="" className="card-icon2" />
        <div className="card-content">
          <h2>Production</h2>
          <p className="card-content-p">Elevate your content</p>
          <div className="btn-con">
            <Button />
          </div>
        </div>
        <div className="glow glow3"></div>
      </div>
    </div>

          <p className="services-p p-up">
            From visuals that speak to systems that scale - We deliver
            end-to-end solutions that define, design, and develop your brand’s
            digital presence
          </p>
          <Button text="Our Services" />
        </div>

        {/* ==================mvp==================== */}
        <div className="services services-mvp" ref={mvpRef}>

           <img
        src={Shadow1}
        alt=""
        className="shadow1 shdowsmall absolute top-10 left-0 w-40"
      />
      <img
        src={Shadow2}
        alt=""
        className="shadow2 shdowsmall absolute bottom-0 right-0 w-40"
      />


                    <BlurText
                    text="From Idea to Market in 4 Weeks"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    maxWidth="550px" 
                    onAnimationComplete={handleAnimationComplete}
                    className="text-2xl mb-8"
                  />

          <div className="mvp-cardcon">
            <div className="mvp-card mvp-card1">
              <img className="mvp-img" src={Mvp} alt="" />
              <img className="mvp-img-ab" src={TestImg} alt="" />
              <div className="mvp-content">
                <h2>
                  MVP <br /> Research
                </h2>
                <div className="btn-con2">
                  <Button />
                </div>
              </div>
            </div>

            <div className="mvp-card mvp-card2">
              <img className="mvp-img" src={Mvp} alt="" />
              <img className="mvp-img-ab" src={TestImg} alt="" />
              <div className="mvp-content">
                <h2>
                  MVP <br /> Design
                </h2>
                <div className="btn-con2">
                  <Button />
                </div>
              </div>
            </div>

            <div className="mvp-card mvp-card3">
              <img className="mvp-img" src={Mvp} alt="" />
              <img className="mvp-img-ab" src={TestImg} alt="" />
              <div className="mvp-content">
                <h2>
                  MVP <br /> Development
                </h2>
                <div className="btn-con2">
                  <Button />
                </div>
              </div>
            </div>
          </div>
          <p className="services-p p-up">
            We don’t just design and develop - we help founders validate and
            launch market-ready MVPs with speed, clarity, and impact.
          </p>
          <Button text="Our Services" />
        </div>

        {/* ==================About us==================== */}
        <div className="services" ref={aboutRef}>
          
           <BlurText
                    text="Strix Production"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    maxWidth="550px" 
                    onAnimationComplete={handleAnimationComplete}
                    className="text-2xl mb-8"
                  />
          <div className="coin-con">
            <video
              className="coin-anime"
              src={Coin}
              autoPlay
              loop
              muted
              playsInline
            ></video>
          </div>
          <p className="services-p p-up">
            Not just another agency — Strix combines design, development,
            production, and MVP expertise to help brands and startups scale
            faster.
          </p>
          <Button text="About us" />
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

        {/* ===================portfolio================= */}
        <div className="portfolio">
          <img
        src={Shadow1}
        alt=""
        className="shadow1 shadowmed  absolute top-10 left-0 w-40"
      />
      <img
        src={Shadow2}
        alt=""
        className="shadow2 shadowmed  absolute bottom-0 right-0 w-40"
      />
           <BlurText
                    text="Our Craft, Your Expression."
                    delay={150}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                    className="text-2xl mb-8"
                  />
          <div className="links">
            <p>Branding</p>
            <p>Websites</p>
            <p>All</p>
            <p>UI/UX</p>
            <p>Media</p>
          </div>
          <div className="cl">
            <img  className="circleblur2" src={CircleBlur} alt="" />
            <Carousel />
            <div className="cl-btn">
            <ButtonI />
          </div>
          </div>
          
        </div>

        {/* ==================testimonials================ */}
        <div className="testimonial-con">
          <h1>What Our Clients say</h1>
                    <p>
            Real stories from the brands and people we’ve helped grow, design,
            and stand out
          </p>
          <TestimonialCarousel />
        </div>

        {/* ==================booking================ */}
        <div className="booking">
          <h1>
            Turn Your Idea Into a <br /> Market-Ready MVP That Lasts
          </h1>
          <div className="second">
            <div className="left-booking">
              <p>
                <span>•</span>Leave a request
              </p>

              <div className="right-booking right-booking2">
              <p>
                Let's start <br /> your project
              </p>
            </div>
              <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={15}
              className="sr-desk"
              >
              We’d love to be challenged by you! Feel free to share your brief
                              with us

              </ScrollReveal>
              <p className="sr-mobile" > We’d love to be challenged by you! Feel free to share your brief
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
      </div>

      <Footer />
    </div>
  );
};

export default Home;
