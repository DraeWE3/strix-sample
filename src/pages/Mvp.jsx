import React, { useState, useEffect, useRef } from "react";
import Nav from '../components/Navbar'
import Circleblur from '../assets/img/sr-img.webp'
import Connect from '../assets/img/connect.svg'
import BtnNormsall from '../components/normSmall-btn';
import Footer from '../components/Footer'
import Blur1 from '../assets/img/p-blur2.png'
import Blur2 from '../assets/img/p-blur1.png'
import Blur3 from '../assets/img/Ellipse 7.png'
import Blur4 from '../assets/img/Ellipse 8.png'
import Blur5 from '../assets/img/p-blur3.png'
import Blur6 from '../assets/img/p-blur4.png'
import { Play } from 'lucide-react';
import '../style/mvp.css'
import Button from "../components/Button";
import HeroImg from '../assets/img/mvp-hero.webp'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DotGrid from "../animations/DotGrid";
import RotateCardsScroll from '../animations/RotateCardsScroll'
import ScrollSlideAnimations from '../animations/slideins'
import Stagger from '../animations/stagger'
import ScrollAnimation from '../animations/scrollReveal'
import SlideInFramerOnLoad from '../animations/SlideInFramerOnLoad'
import BgMvp3card from "../assets/img/mvp3card.svg"
import HbgMvp3card from "../assets/img/mvp3card-h.svg"
import BgMvp3card2 from "../assets/img/mvp3card2.svg"
import HbgMvp3card2 from "../assets/img/mvp3card2-h.svg"
import HbgMvp3card3 from "../assets/img/mvp3card3-h.svg"
import Speed from "../assets/img/speed.png"
import Speed2 from "../assets/img/speed2.png"
import CardBtn from "../components/cardBtn";
import Scala from "../assets/img/scala.png"
import ScalaH from "../assets/img/scala-h.png"
import Stra from "../assets/img/strategy.png"
import StraH from "../assets/img/strategy-h.png"
import Gemini from "../assets/img/gemini.webp"
import TimeIcon from "../assets/img/time-icon.svg"
import Arrow from '../assets/img/arrow-right.svg'
import { Link } from 'react-router-dom'
import ProjectCircle from '../assets/img/project-circle.webp'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import Open from "../assets/img/open.svg"
import Close from "../assets/img/close.svg"
import SEO from "../components/SEO";
import FAQ from "../components/FAQ";



// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3i7GvHlnib2GCCyR37H5XC7aANbPMVIc",
  authDomain: "strix-production-402d4.firebaseapp.com",
  projectId: "strix-production-402d4",
  storageBucket: "strix-production-402d4.firebasestorage.app",
  messagingSenderId: "207095143719",
  appId: "1:207095143719:web:ef9c4d4a3482131da5dd02",
  measurementId: "G-0MVYMSZCWX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

gsap.registerPlugin(ScrollTrigger);

const Mvp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoexRef = useRef(null)

  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Load projects from Firebase
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(4) // Limit to 4 projects for the MVP page
      );
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
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

  const extendRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!extendRef.current || !timelineRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 60%",
        end: "bottom 90%",
        scrub: 1.5,
      }
    });

    tl.to(extendRef.current, {
      height: "25%",
      duration: 0.25,
      ease: "power2.inOut"
    })
      .to(extendRef.current, {
        height: "50%",
        duration: 0.25,
        ease: "power2.inOut"
      })
      .to(extendRef.current, {
        height: "75%",
        duration: 0.25,
        ease: "power2.inOut"
      })
      .to(extendRef.current, {
        height: "100%",
        duration: 0.25,
        ease: "power2.inOut"
      });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const faqData = [
    {
      question: "How do SaaS MVP development agencies help early-stage SaaS businesses?",
      answer: "SaaS MVP development agencies help startups validate their product ideas by launching a minimum viable product with only the essential features needed to test market demand. This approach allows businesses to gather real user feedback, improve the product, and reduce development risks before scaling. Strix Production provides SaaS MVP development services that include product strategy, UX design, agile development, and scalable cloud-based architecture tailored for SaaS startups."
    },
    {
      question: "Why choose custom MVP development services for startups?",
      answer: "Custom MVP development services enable startups to build a minimum viable product that aligns closely with their unique business model, target audience, and long-term goals. This process typically focuses on prioritizing core features, testing user interactions, and refining the product through continuous feedback. Strix Production offers customized MVP development services designed around user feedback, iterative testing, and scalable technology stacks."
    },
    {
      question: "How much does it cost to build an MVP?",
      answer: "MVP development pricing generally depends on factors such as product complexity, number of features, platform requirements, and integration needs. Startups often choose MVP development to minimize initial investment while still building a functional product that can validate their business idea in the market. Strix Production provides transparent MVP development pricing, ensuring startups receive a cost-effective and market-ready MVP without unnecessary expenses."
    },
    {
      question: "How long does the MVP development timeline take?",
      answer: "The timeline for MVP development usually depends on the scope of features, integrations, and testing processes involved. In most cases, startups aim to launch an MVP quickly so they can test the product in the market and gather valuable user insights. Strix Production typically delivers MVPs within 4 to 12 weeks, depending on project complexity, helping startups move from idea to market launch efficiently."
    },
    {
      question: "What is the difference between MVP and prototype?",
      answer: "A prototype is an early model of a product created to visualize and test the design, layout, and user experience before development begins. It may not be fully functional and is mainly used to gather feedback and refine ideas. An MVP (Minimum Viable Product), however, is a working version of the product with only the essential features needed to solve a core problem for real users and test market demand. In simple terms, a prototype helps validate the concept, while an MVP helps validate the product in the market. At Strix Production, teams typically start with prototyping to shape the product idea and then develop an MVP to test it with real users before full-scale development."
    }
  ];

  return (
    <div>
      <SEO
        title="Full-Stack MVP Development Company | Custom MVP Development Services"
        description="Full-stack MVP development company providing custom MVP development services to turn your ideas into scalable, market-ready products fast and efficiently."
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
        <div className="sh-top uiux-hero">
          <img src={Circleblur} alt="Design background blur" />
          <h1 className="slideinLoad mvp-hero-h1">Get flawless <br />product from scratch</h1 >
        </div>

        <div className="case-box-con uiu-con mvp-video">
          <img src={Blur3} className="blur3-hero-left" alt="Light effect left" />
          <img src={Blur4} className="blur3-hero-right" alt="Light effect right" />
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
                  <button
                    onClick={handlePlay}
                    className="play-button-sr"
                    aria-label="Play video"
                  >
                    <h2 className="sr-watch viewwork">Watch showreel</h2>
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
        <p className="ui-hero-p scrollReveal ">We don't just build apps. We craft Minimum Viable Products designed to validate, Impress, and last.</p>
        <img src={Blur1} className='p-blur1' alt="Gradient blur 1" />
        <img src={Blur2} className='p-blur2' alt="Gradient blur 2" />
      </div>

      {/* =================provide=========== */}
      <div className="provide-con mpvcard-section ">
        <div className="sh-top uiux-hero mvp-conn">
          <img src={Circleblur} alt="Design background blur" />
          <h2 className="scrollReveal mvp-why">Why MVP with Strix ?</h2>
          <p className="mvp-hero-p scrollReveal mvp-why-p"> We craft transformative digital experiences that elevate brands and captivate audiences. Your vision, realized without compromise.</p>
        </div>

        <div className="mvp3cards">
          <div className="mvp3card slideInBottomLeft">
            <img className="mvp3card-bg" src={BgMvp3card} alt="Card background" />
            <img className="mvp3card-bg-h" src={HbgMvp3card} alt="Card background hover" />
            <div className="mvp3card-details">
              <img className="speed" src={Speed} alt="Speed icon" />
              <img className="speed-h" src={Speed2} alt="Speed icon hover" />
              <p className="mvp3card-head">Speed</p>
              <p className="mvp3card-title">Launch faster, validate smarter ideas - we turn ideas into <strong>working prototype</strong> before competitors even start planning.</p>
              <p className="mvp3card-title-h">We build <strong>MVPs</strong> that move at the pace of innovation - designed, developed, and deployed in as little as <strong>4-6</strong> weeks.</p>
              <div className="mvp3card-btn">
                <CardBtn text="Know more" />
              </div>
            </div>
          </div>

          <div className="mvp3card scrollReveal">
            <img className="mvp3card-bg" src={BgMvp3card2} alt="Card background" />
            <img className="mvp3card-bg-h" src={HbgMvp3card2} alt="Card background hover" />
            <div className="mvp3card-details">
              <img className="speed" src={Scala} alt="Scalability icon" />
              <img className="speed-h" src={ScalaH} alt="Scalability icon hover" />
              <p className="mvp3card-head">Scalability</p>
              <p className="mvp3card-title">Your MVP isn't a one-off experiment - it's the foundation of your <strong>future product.</strong></p>
              <p className="mvp3card-title-h">Every line of code, every screen, and every interaction is built with <strong>scalability</strong> in mind - so you can evolve, expand, and scale without starting over.</p>
              <div className="mvp3card-btn">
                <CardBtn text="Know more" />
              </div>
            </div>
          </div>

          <div className="mvp3card slideInBottomRight">
            <img className="mvp3card-bg" src={BgMvp3card} alt="Card background" />
            <img className="mvp3card-bg-h" src={HbgMvp3card3} alt="Card background hover" />
            <div className="mvp3card-details">
              <img className="speed" src={Stra} alt="Strategy icon" />
              <img className="speed-h" src={StraH} alt="Strategy icon hover" />
              <p className="mvp3card-head">Strategy</p>
              <p className="mvp3card-title">A <strong>great MVP</strong> isn't just about what you build, but why you build it. </p>
              <p className="mvp3card-title-h">We align every feature with your business model, market fit and audience behavior - ensuring your MVP doesn't just work, it <strong>Wins.</strong> </p>
              <div className="mvp3card-btn">
                <CardBtn text="Know more" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================built-to-launch================== */}
      <div className="mvp-built-section">
        <div className="sh-top uiux-hero mvp-built-conn">
          <img src={Circleblur} alt="Design background blur" />
          <h2 className="scrollReveal">MVPs Built to Launch, Not Sit Idle</h2>
          <div className="mvp-built-copy scrollReveal">
            <p>Speed matters early. As an MVP development company for startups, Strix Production builds only what your users need first. Core features. Clean flow. Ready to test in weeks, not months.
              As a SaaS MVP development agency, we design and build together. No gaps between teams. No long waits. You see each step. You give input. The product stays on track.
            </p>
            <p>Our Custom MVP development services fit your goal, not a preset plan. We map features, pick simple tech, and keep things easy to scale. Less waste. More focus.</p>
            <p>Strix Production is an MVP development company for startups, offering Custom MVP development services and MVP app development for startups as a trusted SaaS MVP development agency focused on fast, scalable launches.</p>
            <p>We handle MVP app development for startups across web and mobile. Fast load, smooth use, stable code. Your first users get a product that works, not a draft.</p>
            <p>Strix Production is a thoughtful and fast MVP builder, assisting founders in testing their ideas early, learning with real users and developing with a clear and consistent direction ahead.</p>
          </div>
        </div>
      </div>

      {/* ===================why================== */}
      <div className="sh-top uiux-hero what-con mvp-connn">
        <img src={Circleblur} alt="Design background blur" />
        <h2 className="scrollReveal">Our 4-Week <br />MVP Framework</h2>
        <p className="p-inde scrollReveal">At Strix Productions, we design, develop, and deliver world-class visuals and experience that help ambitious brands move faster, scale bigger, and stand out globally.</p>
      </div>

      <div className="gemini-con">
        <img className="gemini" src={Gemini} alt="Framework visual" />
      </div>

      <div className="timeline" ref={timelineRef}>
        <div className="timeline-con">
          <div className="time-left">
            <div className="time-con time-con1">
              <img src={TimeIcon} alt="Timeline milestone icon" />
              <p className="time-con-head">Discovery & Wireframes</p>
              <p className="time-con-p">
                We define your core idea, map user journeys, and create wireframes that lock your product vision with direction.
              </p>
            </div>

            <div className="time-con time-con2">
              <img src={TimeIcon} alt="Timeline milestone icon" />
              <p className="time-con-head">Development & Iterations</p>
              <p className="time-con-p">
                We develop the MVP with clean, scalable code & refine through quick sprints to keep results aligned with the vision.
              </p>
            </div>
          </div>

          <div className="time-mid">
            <div className="line-time">
              <div className="extend" ref={extendRef}>
                <div className="time-dot"></div>
                <div className="time-circle"></div>
              </div>
            </div>
          </div>

          <div className="time-right">
            <div className="time-con time-con3">
              <img src={TimeIcon} alt="Timeline milestone icon" />
              <p className="time-con-head">Design & Validation</p>
              <p className="time-con-p">
                High-fidelity visuals, interactive prototypes, and feedback loops - ensuring every screen looks and feels right before development.
              </p>
            </div>
          </div>
        </div>

        <div className="time-con time-con5">
          <img src={TimeIcon} alt="Timeline milestone icon" />
          <p className="time-con-head">Test, Launch & Scale</p>
          <p className="time-con-p">
            Before going live, we stress-test every feature for smooth performance, scalability, and future expansion.
          </p>
        </div>
      </div>

      {/* ===================Project Section================== */}
      <div className="project-section-mvp">
        <h2 className="project-section-mvp-h1">MVPs Delivered</h2>
        <p className="project-section-mvp-p">From Concept to launch - a process built for clarity, precision, and speed.</p>
        <div className="section2">
          <div className="p-card-con">
            {loading ? (
              <div className="loading-state">
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects available at the moment.</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`p-sec2-card ${index % 2 === 0 ? 'p-sec2-card1' : 'p-sec2-card2'}`}
                >
                  <img
                    className='p-sec2-card-img'
                    src={project.image}
                    alt={project.title}
                  />
                  <p>{project.categoryText}</p>
                  <Link className='linkkk' to={`/case-study/${project.id}`}>
                    <div>
                      <h2>{project.title}</h2>
                      <img src={Arrow} className='icon' alt="Arrow" />
                    </div>
                  </Link>
                </div>
              ))
            )}

            <img src={Blur5} className='p-blur3' alt="Blur" />
            <img src={Blur6} className='p-blur4' alt="Blur" />
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/project">
              <BtnNormsall text="View All Projects" />
            </Link>
          </div>
        </div>
      </div>

      {/* ==================booking====================== */}
      <div className="booking" >
        <h2 className="section-header3">
          Have an Idea? <br />Let’s turn it into a market-ready MVP
        </h2>
        <div className="second">
          <div className="left-booking slideInLeft">
            <p className="leave">
              <span>•</span>Leave a request
            </p>

            <div className="right-booking right-booking2">
              <img className="right-booking-img" src={Connect} alt="Connect with Strix" />
              <p>
                Let's start <br /> your project
              </p>
            </div>
            <p className="sr-mobile" > We'd love to be challenged by you! Feel free to share your brief with us</p>
          </div>

          <div className="right-booking slideInRight">
            <img className="right-booking-img" src={Connect} alt="" />
            <p>
              Let's start <br /> your project
            </p>
          </div>
        </div>
        <Button text="Book Appointment" />
      </div>


      {/* ==========FAq================== */}

      <div className="smoothsection sectionCon faq-section">
        <FAQ
          faqData={faqData}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know"
        />
      </div>

      <Footer />
    </div>
  )
}

export default Mvp