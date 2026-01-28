import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
import HeroImg from '../assets/img/serv.webp'
import Connect from '../assets/img/connect.svg'
import DotGrid from "../animations/DotGrid";
import ScaleInLoad from '../animations/ScaleInLoad'
import SlideInFramerOnLoad from '../animations/SlideInFramerOnLoad'
import ScrollAnimation from "../animations/scrollReveal";
import gsap from "gsap";
import Dev1 from "../assets/img/devc1.webp"
import Dev2 from "../assets/img/devc2.webp"
import Dev3 from "../assets/img/devc3.webp"
import Dev4 from "../assets/img/devc4.webp"
import Dev5 from "../assets/img/devc5.webp"
import Dev6 from "../assets/img/devc6.webp"
import Pro1 from "../assets/img/proc1.webp"
import Pro2 from "../assets/img/proc2.webp"
import Pro3 from "../assets/img/proc3.webp"
import Pro4 from "../assets/img/proc4.webp"
import Pro5 from "../assets/img/proc5.webp"
import De1 from "../assets/img/dec1.webp"
import De2 from "../assets/img/dec2.webp"
import De3 from "../assets/img/dec3.webp"
import De4 from "../assets/img/dec4.webp"
import De5 from "../assets/img/dec5.webp"
import De6 from "../assets/img/dec6.webp"
import Devicon1 from "../assets/img/dev-i1.svg"
import Devicon2 from "../assets/img/dev-i2.svg"
import Devicon3 from "../assets/img/dev-i3.svg"
import Devicon4 from "../assets/img/dev-i4.svg"
import Devicon5 from "../assets/img/dev-i5.svg"
import Devicon6 from "../assets/img/dev-i6.svg"
import Proicon1 from "../assets/img/pro-i1.svg"
import Proicon2 from "../assets/img/pro-i2.svg"
import Proicon3 from "../assets/img/pro-i3.svg"
import Proicon4 from "../assets/img/pro-i4.svg"
import Proicon5 from "../assets/img/pro-i5.svg"



const Service = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoexRef = useRef(null)
  
  const heroRef = useRef(null);
  const designRef = useRef(null);
  const devRef = useRef(null);
  const proRef = useRef(null);
  
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: designScroll } = useScroll({
    target: designRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: devScroll } = useScroll({
    target: devRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: proScroll } = useScroll({
    target: proRef,
    offset: ["start end", "end start"]
  });
  
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.5, 1], [1, 0.8, 0.3]);
  
  const designY = useTransform(designScroll, [0, 1], ["10%", "-10%"]);
  const devY = useTransform(devScroll, [0, 1], ["10%", "-10%"]);
  const proY = useTransform(proScroll, [0, 1], ["10%", "-10%"]);
  
  const blur1Y = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const blur2Y = useTransform(heroScroll, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const designSlides = [De1, De2, De3, De4, De5, De6];
  const [designCurrent, setDesignCurrent] = useState(0);
  const [designIsDragging, setDesignIsDragging] = useState(false);
  const designStartX = useRef(0);
  const designMoveX = useRef(0);
  const designAutoSlideRef = useRef(null);

  useEffect(() => {
    startDesignAutoSlide();
    return () => clearInterval(designAutoSlideRef.current);
  }, [designCurrent]);

  const startDesignAutoSlide = () => {
    clearInterval(designAutoSlideRef.current);
    designAutoSlideRef.current = setInterval(() => {
      setDesignCurrent((prev) => (prev + 1) % designSlides.length);
    }, 6000);
  };

  const goToDesignSlide = (index) => setDesignCurrent(index);

  const handleDesignDragStart = (e) => {
    setDesignIsDragging(true);
    designStartX.current = e.clientX || e.touches[0].clientX;
    designMoveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDesignDragMove = (e) => {
    if (!designIsDragging) return;
    designMoveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDesignDragEnd = () => {
    if (!designIsDragging) return;
    const diff = designStartX.current - designMoveX.current;
    if (diff > 30) {
      setDesignCurrent((prev) => (prev + 1) % designSlides.length);
    } else if (diff < -30) {
      setDesignCurrent((prev) => (prev - 1 + designSlides.length) % designSlides.length);
    }
    setDesignIsDragging(false);
  };

  const devSlides = [Dev1, Dev2, Dev3, Dev4, Dev5, Dev6];
  const [devCurrent, setDevCurrent] = useState(0);
  const [devIsDragging, setDevIsDragging] = useState(false);
  const devStartX = useRef(0);
  const devMoveX = useRef(0);
  const devAutoSlideRef = useRef(null);

  useEffect(() => {
    startDevAutoSlide();
    return () => clearInterval(devAutoSlideRef.current);
  }, [devCurrent]);

  const startDevAutoSlide = () => {
    clearInterval(devAutoSlideRef.current);
    devAutoSlideRef.current = setInterval(() => {
      setDevCurrent((prev) => (prev + 1) % devSlides.length);
    }, 6000);
  };

  const goToDevSlide = (index) => setDevCurrent(index);

  const handleDevDragStart = (e) => {
    setDevIsDragging(true);
    devStartX.current = e.clientX || e.touches[0].clientX;
    devMoveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDevDragMove = (e) => {
    if (!devIsDragging) return;
    devMoveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDevDragEnd = () => {
    if (!devIsDragging) return;
    const diff = devStartX.current - devMoveX.current;
    if (diff > 30) {
      setDevCurrent((prev) => (prev + 1) % devSlides.length);
    } else if (diff < -30) {
      setDevCurrent((prev) => (prev - 1 + devSlides.length) % devSlides.length);
    }
    setDevIsDragging(false);
  };

  const proSlides = [Pro1, Pro2, Pro3, Pro4, Pro5];
  const [proCurrent, setProCurrent] = useState(0);
  const [proIsDragging, setProIsDragging] = useState(false);
  const proStartX = useRef(0);
  const proMoveX = useRef(0);
  const proAutoSlideRef = useRef(null);

  useEffect(() => {
    startProAutoSlide();
    return () => clearInterval(proAutoSlideRef.current);
  }, [proCurrent]);

  const startProAutoSlide = () => {
    clearInterval(proAutoSlideRef.current);
    proAutoSlideRef.current = setInterval(() => {
      setProCurrent((prev) => (prev + 1) % proSlides.length);
    }, 6000);
  };

  const goToProSlide = (index) => setProCurrent(index);

  const handleProDragStart = (e) => {
    setProIsDragging(true);
    proStartX.current = e.clientX || e.touches[0].clientX;
    proMoveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleProDragMove = (e) => {
    if (!proIsDragging) return;
    proMoveX.current = e.clientX || e.touches[0].clientX;
  };

  const handleProDragEnd = () => {
    if (!proIsDragging) return;
    const diff = proStartX.current - proMoveX.current;
    if (diff > 30) {
      setProCurrent((prev) => (prev + 1) % proSlides.length);
    } else if (diff < -30) {
      setProCurrent((prev) => (prev - 1 + proSlides.length) % proSlides.length);
    }
    setProIsDragging(false);
  };

  return (
    <div>
        <DotGrid dotSize={2} gap={24} activeColor="#ffffff" />
         <ScaleInLoad />
          <SlideInFramerOnLoad />
          <ScrollAnimation />
      <Nav />

      <div className="service-hero" ref={heroRef}>
        <motion.div className="sh-top sh-top-hero" style={{ y: heroY, opacity: heroOpacity }}>
          <img src={Circleblur} alt="" />
          <h1 className="slideinLoad">The Architects of<br/> Digital Excellence.</h1>
        </motion.div>

        <div className="case-box-con">
          <motion.img src={Blur3} className="blur3-hero-left" style={{ y: blur1Y }} />
          <motion.img src={Blur4} className="blur3-hero-right" style={{ y: blur2Y }} />
          <div ref={videoexRef} style={{ width: '78vw', height: '85vh' }} className="video-card-container">
            {!isPlaying ? (
              <div className="video-thumbnail">
                <img src={HeroImg} alt="Video thumbnail" className="thumbnail-image" />
                <div className="play-button-overlay">
                  <button onClick={handlePlay} className="play-button-sr" aria-label="Play video">
                    <h1 className="sr-watch">Watch showreel</h1>
                    <span className="play-line"></span>
                    <Play className="play-icon" fill="white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="video-player">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            )}
          </div>
        </div>
        <motion.img src={Blur1} className='p-blur1' style={{ y: blur1Y }} />
        <motion.img src={Blur2} className='p-blur2' style={{ y: blur2Y }} />
      </div>

      <div className="service-hero sr-txt-con norm-pad">
        <div className="sh-top sh-top-section">
          <img src={Circleblur} alt="" />
          <h1 className="scrollReveal">What we do at Strix Production?</h1>
          <p className="sh-top-p scrollReveal">We craft transformative digital experiences that elevate brands and captivate audiences. Your vision, realized without compromise.</p>
          <BtnNormsall className="scrollReveal" text='Know more' />
        </div>
      </div>

    <motion.div className="sr-design" ref={designRef} style={{ y: designY }}>
        <h1 className='sr-design-h1 scrollReveal'>Design</h1>
        <p className='sr-design-p'>Crafting experiences that resonate.</p>
  <div className="sr-carousel-con">
      <div className="sr-carousel-items" onMouseDown={handleDesignDragStart} onMouseMove={handleDesignDragMove} onMouseUp={handleDesignDragEnd} onMouseLeave={handleDesignDragEnd} onTouchStart={handleDesignDragStart} onTouchMove={handleDesignDragMove} onTouchEnd={handleDesignDragEnd} style={{ cursor: designIsDragging ? 'grabbing' : 'grab' }}>
       <div className="sr-carousel-inner" style={{ display: "flex", transition: designIsDragging ? "none" : "transform 1s cubic-bezier(0.23, 1, 0.32, 1)", transform: isMobile ? `translateX(-${designCurrent * 100}%)` : `translateX(-${designCurrent * (100 / designSlides.length)}%)`, width: `${designSlides.length * 100}%`, willChange: "transform" }}>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / designSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={De1} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>UI/UX Design</h1><p>Beyond beautiful interfaces, we build seamless user journeys that drive engagement and conversion.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / designSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={De2} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items sr-items2"><h1>Product Design</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / designSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={De3} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Mobile app Design</h1><p>Strategically designed mobile experiences that are intuitive, beautiful, and built for your users' on-the-go lifestyle.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / designSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={De4} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Creative Design</h1><p>A team of creative visionaries delivering high-impact graphics, thumbnails, and presentations that leave a lasting impression.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / designSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={De5} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Website Design</h1><p>Bespoke websites and landing pages built to be the digital cornerstone of your business.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / designSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={De6} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Branding</h1><p>We forge powerful brand identities and comprehensive guidelines that articulate your mission and vision with clarity.</p></div></div>
        </div>
      </div>
      <div className="sr-carousel-select">
        <BtnNormsall text="Explore" />
        <div className="sr-icons"><img src={SrIcon1} alt="" /><img src={SrIcon2} alt="" /><img src={SrIcon3} alt="" /><img src={SrIcon4} alt="" /><img src={SrIcon5} alt="" /><img src={SrIcon6} alt="" /></div>
        <div className="sr-indicator">{designSlides.map((_, index) => (<span key={index} className={`dot ${designCurrent === index ? "active" : ""}`} onClick={() => goToDesignSlide(index)}></span>))}</div>
        <p className="sr-carousel-select-p">We create intuitive, eye-catching designs for web, apps, and brands that stand out in a crowded digital landscape.</p>
      </div>
    </div>
    </motion.div>

    <motion.div className="sr-design" ref={devRef} style={{ y: devY }}>
        <h1 className='sr-dev-h1'>Development</h1>
        <p className='sr-design-p'>Crafting experiences that resonate.</p>
  <div className="sr-carousel-con">
      <div className="sr-carousel-items" onMouseDown={handleDevDragStart} onMouseMove={handleDevDragMove} onMouseUp={handleDevDragEnd} onMouseLeave={handleDevDragEnd} onTouchStart={handleDevDragStart} onTouchMove={handleDevDragMove} onTouchEnd={handleDevDragEnd} style={{ cursor: devIsDragging ? 'grabbing' : 'grab' }}>
       <div className="sr-carousel-inner" style={{ display: "flex", transition: devIsDragging ? "none" : "transform 1s cubic-bezier(0.23, 1, 0.32, 1)", transform: isMobile ? `translateX(-${devCurrent * 100}%)` : `translateX(-${devCurrent * (100 / devSlides.length)}%)`, width: `${devSlides.length * 100}%`, willChange: "transform" }}>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / devSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Dev1} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Web Applications</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / devSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Dev2} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>E-Commerce</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / devSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Dev3} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Website Development</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / devSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Dev4} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Mobile Applications</h1><p>Beyond beautiful interfaces, we build seamless user journeys that drive engagement and conversion.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / devSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Dev5} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Interactive Websites</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / devSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Dev6} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Maintenance &  Hosting</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
        </div>
      </div>
      <div className="sr-carousel-select">
        <BtnNormsall text="Explore" />
        <div className="sr-icons"><img src={Devicon1} alt="" /><img src={Devicon2} alt="" /><img src={Devicon3} alt="" /><img src={Devicon4} alt="" /><img src={Devicon5} alt="" /><img src={Devicon6} alt="" /></div>
        <div className="sr-indicator">{devSlides.map((_, index) => (<span key={index} className={`dot ${devCurrent === index ? "active" : ""}`} onClick={() => goToDevSlide(index)}></span>))}</div>
        <p className="sr-carousel-select-p">We create intuitive, eye-catching designs for web, apps, and brands that stand out in a crowded digital landscape.</p>
      </div>
    </div>
    </motion.div>

    <motion.div className="sr-design" ref={proRef} style={{ y: proY }}>
        <h1 className='sr-pro-h1'>Production</h1>
        <p className='sr-design-p'>Crafting experiences that resonate.</p>
  <div className="sr-carousel-con">
      <div className="sr-carousel-items" onMouseDown={handleProDragStart} onMouseMove={handleProDragMove} onMouseUp={handleProDragEnd} onMouseLeave={handleProDragEnd} onTouchStart={handleProDragStart} onTouchMove={handleProDragMove} onTouchEnd={handleProDragEnd} style={{ cursor: proIsDragging ? 'grabbing' : 'grab' }}>
       <div className="sr-carousel-inner" style={{ display: "flex", transition: proIsDragging ? "none" : "transform 1s cubic-bezier(0.23, 1, 0.32, 1)", transform: isMobile ? `translateX(-${proCurrent * 100}%)` : `translateX(-${proCurrent * (100 / proSlides.length)}%)`, width: `${proSlides.length * 100}%`, willChange: "transform" }}>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / proSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Pro1} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>3D Animations</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / proSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Pro2} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Commercials & Promos</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / proSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Pro3} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Reels & Shorts</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / proSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Pro4} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Long Format Content</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
          <div className="sr-carousel-item" style={{ width: isMobile ? '100%' : `${100 / proSlides.length}%`, flexShrink: 0, padding: isMobile ? '0 1rem' : '0 2rem' }}><img src={Pro5} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} /><div className="sr-items"><h1>Motion Graphics</h1><p>From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.</p></div></div>
        </div>
      </div>
      <div className="sr-carousel-select">
        <BtnNormsall text="Explore" />
        <div className="sr-icons"><img src={Proicon1} alt="" /><img src={Proicon2} alt="" /><img src={Proicon3} alt="" /><img src={Proicon4} alt="" /><img src={Proicon5} alt="" /></div>
        <div className="sr-indicator">{proSlides.map((_, index) => (<span key={index} className={`dot ${proCurrent === index ? "active" : ""}`} onClick={() => goToProSlide(index)}></span>))}</div>
        <p className="sr-carousel-select-p">We create intuitive, eye-catching designs for web, apps, and brands that stand out in a crowded digital landscape.</p>
      </div>
    </div>
    </motion.div>

      <div className="service-hero norm-pad">
        <div className="sh-top">
          <img src={Circleblur} alt="" />
          <h1 className="sh-top-h1 strix-why scrollReveal">Why Strix Production?</h1>
          <p className="sh-top-p scrollReveal">We craft transformative digital experiences that elevate brands and captivate audiences. Your vision, realized without compromise.</p>
          <BtnNormsall text='Know more' />
        </div>
      </div>

       <div className="portfolio sr-portfolio" >
                  <h1 className="section-header2 scrollReveal">Our Curated Portfolio</h1>
          <div className="cl">
            <CircleBlurAnimation className="circleblur2 circleblurtop" src={CircleBlur} />
            <Carousel />
            <div className="cl-btn">
            <ButtonSmall text="Portfolio" />
          </div>
          </div>
        </div>

      <div className="booking" >
        <img src={Blur5} className="blur-booking-left" />
        <img src={Blur6} className="blur-booking-right" />
           <h1 className="section-header2">Have  a project that <br /> deserves attention ?</h1>
          <div className="second">
            <div className="left-booking">
              <p className="leave"><span>•</span>Leave a request</p>
              <div className="right-booking right-booking2">
                <img className="right-booking-img" src={Connect} alt="" />
              <p>Let's start <br /> your project</p>
            </div>
              <p className="sr-mobile" > We'd love to be challenged by you! Feel free to share your brief with us</p>
            </div>
            <div className="right-booking">
              <img className="right-booking-img" src={Connect} alt="" />
              <p>Let's start <br /> your project</p>
            </div>
          </div>
          <Button text="Book Appointment" />
        </div>
      <Footer />
    </div>
  );
};

export default Service;