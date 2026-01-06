import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'
import '../style/caseStudy.css'
import ArrowLeft from '../assets/img/arrow-left.svg'
import React, { useState, useRef, useEffect } from "react";
import { Play } from 'lucide-react';
import Circle from '../assets/img/updown-circle.webp'
import ButtonArrow from '../components/button-arrow'
import Cardbg1 from '../assets/img/pr-card1.webp'
import Cardbg2 from '../assets/img/pr-card2.webp'
import Cardbg3 from '../assets/img/pr-card3.webp'
import Pricon1 from '../assets/img/research.svg'
import Pricon2 from '../assets/img/development.svg'
import Pricon3 from '../assets/img/delivery.svg'
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
import Blur4 from '../assets/img/p-blur4.png'
import Blur5 from '../assets/img/p-blur3.png'
import Connect from '../assets/img/connect.svg'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import { db } from '../admin/firebaseconfig'
import { motion, useScroll, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Technology icon mapping
const TECH_ICONS = {
  'Figma': Icon1,
  'Photoshop': Icon2,
  'Illustrator': Icon3,
  'React': Icon4,
  'Node.js': Icon5,
  'MongoDB': Icon6,
  'Express': Icon7,
  'Firebase': Icon8,
  'After Effects': Icon9,
  'Premiere Pro': Icon10,
}

// Process icon mapping
const PROCESS_ICONS = {
  'Discovery': Pricon1,
  'Research': Pricon1,
  'Development': Pricon2,
  'Design': Pricon2,
  'Delivery': Pricon3,
  'Production': Pricon3,
}

// Helper function to reconstruct data from chunks
const reconstructSectionData = (mainData, chunks) => {
  const reconstructed = { ...mainData };
  
  chunks.forEach(chunk => {
    const { sectionName, data } = chunk;
    
    if (sectionName === 'hero_thumbnail') {
      reconstructed.heroThumbnail = data.heroThumbnail;
    } 
    else if (sectionName === 'client_logo') {
      if (!reconstructed.client) reconstructed.client = {};
      reconstructed.client.logo = data.logo;
    }
    else if (sectionName.startsWith('about_image_')) {
      if (!reconstructed.aboutProject) reconstructed.aboutProject = { description: '', images: [] };
      if (!reconstructed.aboutProject.images) reconstructed.aboutProject.images = [];
      reconstructed.aboutProject.images[data.index] = data.image;
    }
    else if (sectionName.startsWith('process_card_')) {
      if (!reconstructed.processCards) reconstructed.processCards = [];
      reconstructed.processCards[data.index] = data.card;
    }
    else if (sectionName.startsWith('concepts_')) {
      if (!reconstructed.conceptSlides) reconstructed.conceptSlides = Array(9).fill('');
      const { slides, startIndex } = data;
      slides.forEach((slide, i) => {
        if (slide) reconstructed.conceptSlides[startIndex + i] = slide;
      });
    }
    else if (sectionName === 'design_image') {
      reconstructed.designSystemImage = data.designSystemImage;
    }
    else if (sectionName.startsWith('responsive_')) {
      if (!reconstructed.responsiveImages) reconstructed.responsiveImages = Array(8).fill('');
      const { images, startIndex } = data;
      images.forEach((img, i) => {
        if (img) reconstructed.responsiveImages[startIndex + i] = img;
      });
    }
  });
  
  return reconstructed;
};

// Video Thumbnail Component with GSAP Scroll Animation
const VideoThumbnail = ({ caseStudy, isPlaying, handlePlay }) => {
  const containerRef = useRef(null)

useEffect(() => {
  // Disable on mobile
  if (window.innerWidth < 768) return

  if (!containerRef.current) return
  const element = containerRef.current

  const ctx = gsap.context(() => {
    gsap.to(element, {
      width: '95vw',
      height: '90vh',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    })
  })

  return () => ctx.revert()
}, [])


  return (
    <div 
      className="video-card-container"
      ref={containerRef}
      style={{
        width: '70vw',
        height: '75vh'
      }}
    >
      {!isPlaying ? (
        <div className="video-thumbnail">
          {caseStudy.heroThumbnail ? (
            <img
              src={caseStudy.heroThumbnail}
              alt="Video thumbnail"
              className="thumbnail-image"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#333' }}></div>
          )}
          {caseStudy.heroVideo && (
            <div className="play-button-overlay">
              <button
                onClick={handlePlay}
                className="play-button"
                aria-label="Play video"
              >
                <Play className="play-icon" fill="white" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="video-player">
          <iframe
            width="100%"
            height="100%"
            src={`${caseStudy.heroVideo}?autoplay=1`}
            title="Video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}

const CaseStudy = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const carouselRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [caseStudy, setCaseStudy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nextProject, setNextProject] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCaseStudy()
  }, [id])

  const fetchCaseStudy = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching case study for project ID:', id)
      
      const caseStudiesQuery = query(
        collection(db, 'caseStudies'),
        where('projectId', '==', id),
        limit(1)
      )
      
      const caseStudiesSnap = await getDocs(caseStudiesQuery)
      
      if (caseStudiesSnap.empty) {
        console.log('No case study found for project ID:', id)
        setError('No case study has been created for this project yet.')
        setLoading(false)
        return
      }

      const caseStudyDoc = caseStudiesSnap.docs[0]
      const mainData = { id: caseStudyDoc.id, ...caseStudyDoc.data() }
      
      // Load chunks from subcollection
      const chunksSnap = await getDocs(collection(db, `caseStudies/${caseStudyDoc.id}/chunks`))
      const chunks = chunksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      console.log('Loaded chunks:', chunks.length)
      
      // Reconstruct full data with chunks
      const fullData = reconstructSectionData(mainData, chunks)
      
      console.log('Case study loaded with chunks:', fullData)
      console.log('Concept slides:', fullData.conceptSlides)
      
      setCaseStudy(fullData)

      // Load next project
      const allCaseStudiesQuery = query(
        collection(db, 'caseStudies'),
        orderBy('createdAt', 'desc')
      )
      const allCaseStudiesSnap = await getDocs(allCaseStudiesQuery)
      const allCaseStudies = allCaseStudiesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      
      const currentIndex = allCaseStudies.findIndex(cs => cs.id === caseStudyDoc.id)
      console.log('Current index:', currentIndex, 'Total case studies:', allCaseStudies.length)
      
      if (currentIndex !== -1 && allCaseStudies.length > 1) {
        const nextIndex = (currentIndex + 1) % allCaseStudies.length
        const nextProj = allCaseStudies[nextIndex]
        console.log('Next project:', nextProj)
        setNextProject(nextProj)
      } else {
        console.log('No next project found or only one case study')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching case study:', error)
      setError('Error loading case study: ' + error.message)
      setLoading(false)
    }
  }

  const scroll = (direction) => {
    const container = carouselRef.current
    if (!container) return
    
    const card = container.querySelector("img")
    if (!card) return
    
    const cardWidth = card.offsetWidth + 24
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const getTechIcon = (techName) => {
    return TECH_ICONS[techName] || Icon1
  }

  const getProcessIcon = (title) => {
    for (const key in PROCESS_ICONS) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return PROCESS_ICONS[key]
      }
    }
    return Pricon1
  }

if (loading) {
  return (
    <div>
      <Nav />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "#fff",
          gap: "20px",
          zIndex: 999999999999,
          position: 'relative'
        }}
      >
        {/* Uiverse Spinner */}
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* <p>Loading case study...</p> */}

        {/* Inject CSS for spinner */}
        <style>{`
          .spinner {
            width: 70.4px;
            height: 70.4px;
            --clr: rgba(255, 255, 255, 1);
            --clr-alpha: rgba(255, 255, 255, 0.1);
            animation: spinner 1.6s infinite ease;
            transform-style: preserve-3d;
            position: relative;
          }

          .spinner > div {
            background-color: var(--clr-alpha);
            height: 100%;
            position: absolute;
            width: 100%;
            border: 3.5px solid var(--clr);
          }

          .spinner div:nth-of-type(1) {
            transform: translateZ(-35.2px) rotateY(180deg);
          }

          .spinner div:nth-of-type(2) {
            transform: rotateY(-270deg) translateX(50%);
            transform-origin: top right;
          }

          .spinner div:nth-of-type(3) {
            transform: rotateY(270deg) translateX(-50%);
            transform-origin: center left;
          }

          .spinner div:nth-of-type(4) {
            transform: rotateX(90deg) translateY(-50%);
            transform-origin: top center;
          }

          .spinner div:nth-of-type(5) {
            transform: rotateX(-90deg) translateY(50%);
            transform-origin: bottom center;
          }

          .spinner div:nth-of-type(6) {
            transform: translateZ(35.2px);
          }

          @keyframes spinner {
            0% {
              transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
            }
          
            50% {
              transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
            }
          
            100% {
              transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
            }
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
}


  if (error) {
    return (
      <div>
        <Nav />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px',
          color: '#fff',
          gap: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>📁</div>
          <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Case Study Not Found</h2>
          <p style={{ fontSize: '18px', color: '#999', maxWidth: '600px' }}>{error}</p>
          <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
            Project ID: {id}
          </p>
          <button 
            onClick={() => navigate('/projects')}
            style={{
              marginTop: '30px',
              padding: '15px 30px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#0056b3'}
            onMouseOut={(e) => e.target.style.background = '#007bff'}
          >
            ← Back to Projects
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!caseStudy) {
    return (
      <div>
        <Nav />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px',
          color: '#fff'
        }}>
          No case study data available
        </div>
        <Footer />
      </div>
    )
  }

  const processCardBgs = [Cardbg1, Cardbg2, Cardbg3]

  return (
    <div>
      <Nav />
      {/* =======================hero============= */}
      <div className="case-hero">
        <motion.div 
          className="case-return-btn" 
          onClick={() => navigate('/project')} 
          style={{ cursor: 'pointer' }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <img src={ArrowLeft} alt="Back" />
            <p>Return to Projects</p>
        </motion.div>
        <motion.h1 
          className="case-head"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
           Project Overview 
        </motion.h1>
        <motion.div 
          className="case-links"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
            <p className="link-button">Branding</p>
            <p className="link-button">Websites</p>
            <p className="link-button">All</p>
            <p className="link-button">UI/UX</p>
            <p className="link-button">Media</p>
        </motion.div>

        <div className="case-box-con">
          <VideoThumbnail 
            caseStudy={caseStudy}
            isPlaying={isPlaying}
            handlePlay={handlePlay}
          />
          <img src={Circle} className='updowncircle' alt="Circle" />
        </div>
         <motion.h1 
           className='kun-h1'
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6 }}
         >
           {caseStudy.projectTitle || 'Project Title'}
         </motion.h1>
         <img src={Blur1} className='p-blur1' alt="" />
         <img src={Blur2} className='p-blur2' alt="" />
      </div>

       {/* =======================Details============= */}
       <DetailsSection caseStudy={caseStudy} />

       {/* =======================About Project============= */}
       <AboutProjectSection caseStudy={caseStudy} />

         {/* =======================Process============= */}
         {caseStudy.processCards && caseStudy.processCards.some(card => card?.title) && (
           <ProcessSection 
             caseStudy={caseStudy} 
             processCardBgs={processCardBgs}
             getProcessIcon={getProcessIcon}
           />
         )}

     {/* =======================initial concept============= */}
     {caseStudy.conceptSlides && caseStudy.conceptSlides.some(slide => slide) && (
       <ConceptSection caseStudy={caseStudy} />
     )}

      {/* =======================system============= */}
      {caseStudy.designSystemImage && (
        <SystemSection caseStudy={caseStudy} />
      )}

        {/* =======================Respondsive-case============= */}
        {caseStudy.responsiveImages && caseStudy.responsiveImages.some(img => img) && (
          <ResponsiveSection 
            caseStudy={caseStudy}
            carouselRef={carouselRef}
            scroll={scroll}
          />
        )}

      {/* =======================Technology============= */}
      {caseStudy.technologies && (
        Object.values(caseStudy.technologies).some(arr => arr && arr.length > 0)
      ) && (
        <TechnologySection caseStudy={caseStudy} getTechIcon={getTechIcon} />
      )}

      {/* =======================Results============= */}
      {caseStudy.results && caseStudy.results.some(result => result?.title) && (
        <ResultsSection caseStudy={caseStudy} />
      )}

      {/* =======================Circle============= */}
      {nextProject ? (
        <NextProjectSection nextProject={nextProject} navigate={navigate} />
      ) : (
        <div style={{ padding: '50px', color: '#fff', textAlign: 'center' }}>
          <p>Debug: Next Project = {nextProject ? 'exists' : 'null'}</p>
        </div>
      )}

       {/* =======================booking============= */}
       <motion.div 
         className="booking"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, margin: "-100px" }}
         transition={{ duration: 0.8 }}
       >
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
        </motion.div>
      <Footer />
    </div>
  )
}

// Details Section Component
const DetailsSection = ({ caseStudy }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="details-sec" ref={ref}>
      {[
        { label: 'Client', content: caseStudy.client?.logo ? <img src={caseStudy.client.logo} alt="Client logo" /> : <p>{caseStudy.client?.name || 'N/A'}</p> },
        { label: 'Industry', content: <p>{caseStudy.client?.industry || 'N/A'}</p> },
        { label: 'Country', content: <p>{caseStudy.client?.country || 'N/A'}</p> },
        { label: 'Services', content: <p>{caseStudy.client?.services || 'N/A'}</p> }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
          transition={{ 
            duration: 0.6, 
            delay: i * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <h2>{item.label}</h2>
          {item.content}
        </motion.div>
      ))}
    </div>
  )
}

// About Project Section Component
const AboutProjectSection = ({ caseStudy }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="aboutProject" ref={ref}>
      <motion.div 
        className="ap-top"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
      >
        <h1>About Project</h1> 
        <p>{caseStudy.aboutProject?.description || 'No description available'}</p>
      </motion.div>

      {caseStudy.aboutProject?.images && caseStudy.aboutProject.images.some(img => img) && (
        <div className="ap-med">
          <div className="ap-left">
            {caseStudy.aboutProject.images[0] && (
              <motion.img 
                src={caseStudy.aboutProject.images[0]} 
                alt="Project image 1"
                initial={{ opacity: 0, x: -60, y: -60 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -60, y: -60 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
            {caseStudy.aboutProject.images[1] && (
              <motion.img 
                src={caseStudy.aboutProject.images[1]} 
                alt="Project image 2"
                initial={{ opacity: 0, x: -60, y: 60 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -60, y: 60 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
          </div>
          <div className="ap-right">
            {caseStudy.aboutProject.images[2] && (
              <motion.img 
                src={caseStudy.aboutProject.images[2]} 
                alt="Project image 3"
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
          </div>
        </div>
      )}
      <div className="aboutprojectbtn">
        <ButtonArrow text='Experience' />
      </div>
      <img src={Blur4} className='p-blur4' alt="" />
      <img src={Blur5} className='p-blur5' alt="" />
    </div>
  )
}

// Process Section Component
const ProcessSection = ({ caseStudy, processCardBgs, getProcessIcon }) => {
  const ref = useRef(null)
  const lineRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" })

  return (
    <div className="process" ref={ref}>
      <motion.div 
        className="lineup"
        ref={lineRef}
        initial={{ height: 0 }}
        animate={lineInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.h1 
        className="process-h1"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        The Process
      </motion.h1>
      <div className="process-cards">
        {caseStudy.processCards.map((card, index) => (
          card && card.title && (
            <motion.div 
              className="pr-card" 
              key={index}
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -15 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <img src={processCardBgs[index % 3]} className='pr-cardbg' alt="" />
              <div className="prcard-con">
                <div>
                  <img src={card.icon || getProcessIcon(card.title)} alt="" />
                  <p>{card.hours || ''}</p>
                </div>
                <h1>{card.title}</h1>
                <div className='prcard-con-details'>
                  {card.details && Array.isArray(card.details) && card.details.map((detail, i) => (
                    detail && <p key={i}>{detail}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        ))}
      </div>
      {caseStudy.processDescription && (
        <motion.p 
          className='pr-card-p'
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {caseStudy.processDescription}
        </motion.p>
      )}
    </div>
  )
}

// Concept Section Component
const ConceptSection = ({ caseStudy }) => {
  const ref = useRef(null)
  const lineRef = useRef(null)
  const [scrollSpeed, setScrollSpeed] = useState(1)
  
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Speed increases from 1x to 2x as user scrolls through section
      const speed = 1 + latest
      setScrollSpeed(speed)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div className="concept" ref={ref}>
      <motion.div 
        className="lineup"
        ref={lineRef}
        initial={{ height: 0 }}
        animate={lineInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        Initial concepts
      </motion.h1>
      {caseStudy.conceptSlides.slice(0, 5).some(slide => slide) && (
        <InfiniteSlider 
          images={caseStudy.conceptSlides.slice(0, 5).filter(s => s)} 
          direction="left"
          speedMultiplier={scrollSpeed}
          className="case-slide1"
        />
      )}
      {caseStudy.conceptSlides.slice(5, 9).some(slide => slide) && (
        <InfiniteSlider 
          images={caseStudy.conceptSlides.slice(5, 9).filter(s => s)} 
          direction="right"
          speedMultiplier={scrollSpeed}
          className="case-slide2"
        />
      )}
    </div>
  )
}

// Infinite Slider Component
const InfiniteSlider = ({ images, direction, speedMultiplier, className }) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const baseSpeed = direction === "left" ? -0.5 : 0.5
    const interval = setInterval(() => {
      setOffset(prev => {
        const newOffset = prev + (baseSpeed * speedMultiplier)
        const imageWidth = 400
        const totalWidth = (imageWidth + 24) * images.length
        
        // Reset when we've scrolled one full set
        if (direction === "left" && newOffset <= -totalWidth) {
          return 0
        } else if (direction === "right" && newOffset >= totalWidth) {
          return 0
        }
        
        return newOffset
      })
    }, 16)
    return () => clearInterval(interval)
  }, [direction, speedMultiplier, images.length])

  const duplicatedImages = [...images, ...images, ...images]

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          transform: `translateX(${offset}px)`,
          transition: 'none'
        }}
      >
        {duplicatedImages.map((slide, i) => (
          <img 
            key={i} 
            src={slide} 
            alt={`Concept ${i+1}`}
            style={{ minWidth: '400px', height: 'auto' }}
          />
        ))}
      </div>
    </div>
  )
}

// System Section Component
const SystemSection = ({ caseStudy }) => {
  const ref = useRef(null)
  const lineRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" })

  return (
    <div className="system" ref={ref}>
      <motion.div 
        className="lineup"
        ref={lineRef}
        initial={{ height: 0 }}
        animate={lineInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        Styleguide / Design System
      </motion.h1>
      <motion.img 
        src={caseStudy.designSystemImage} 
        alt="Design System"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

// Responsive Section Component
const ResponsiveSection = ({ caseStudy, carouselRef, scroll }) => {
  const ref = useRef(null)
  const lineRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" })

  return (
    <div className="respondsive-case" ref={ref}>
      <motion.div 
        className="lineup"
        ref={lineRef}
        initial={{ height: 0 }}
        animate={lineInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        Responsive
      </motion.h1>
      <div className="res-carousel">
        <motion.div 
          className="re-cards" 
          ref={carouselRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {caseStudy.responsiveImages.map((img, i) => (
            img && (
              <motion.img 
                key={i} 
                src={img} 
                alt={`Responsive ${i+1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
              />
            )
          ))}
        </motion.div>

        <motion.div 
          className="res-controller"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="res-btnleft" onClick={() => scroll("left")}>
            <img src={ResLeft} alt="Left" />
          </div>
          <div className="res-btnright" onClick={() => scroll("right")}>
            <img src={ResRight} alt="Right" />
          </div>
        </motion.div>
      </div>
      <img src={Blur5} className='p-blur5' alt="" />
    </div>
  )
}

// Technology Section Component
const TechnologySection = ({ caseStudy, getTechIcon }) => {
  const ref = useRef(null)
  const lineRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" })

  return (
    <div className="technology" ref={ref}>
      <motion.div 
        className="lineup"
        ref={lineRef}
        initial={{ height: 0 }}
        animate={lineInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        Technologies and tools
      </motion.h1>
      <div className="tech-con">
        {caseStudy.technologies.design && caseStudy.technologies.design.length > 0 && (
          <motion.div 
            className='tech-cons'
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Design</h2>
            <div>
              {caseStudy.technologies.design.map((tech, i) => (
                <motion.img 
                  key={i} 
                  src={getTechIcon(tech)} 
                  alt={tech} 
                  title={tech}
                  initial={{ opacity: 0, x: 60 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + (i * 0.1),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        {caseStudy.technologies.development && caseStudy.technologies.development.length > 0 && (
          <motion.div 
            className='tech-cons'
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Development</h2>
            <div>
              {caseStudy.technologies.development.map((tech, i) => (
                <motion.img 
                  key={i} 
                  src={getTechIcon(tech)} 
                  alt={tech} 
                  title={tech}
                  initial={{ opacity: 0, x: 60 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + (i * 0.1),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        {caseStudy.technologies.production && caseStudy.technologies.production.length > 0 && (
          <motion.div 
            className='tech-cons'
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2>Production</h2>
            <div>
              {caseStudy.technologies.production.map((tech, i) => (
                <motion.img 
                  key={i} 
                  src={getTechIcon(tech)} 
                  alt={tech} 
                  title={tech}
                  initial={{ opacity: 0, x: 60 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.7 + (i * 0.1),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Results Section Component
const ResultsSection = ({ caseStudy }) => {
  const ref = useRef(null)
  const lineRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" })

  return (
    <div className="results" ref={ref}>
      <motion.div 
        className="lineup"
        ref={lineRef}
        initial={{ height: 0 }}
        animate={lineInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <div className="result-grid">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Results
        </motion.h2>
        <div className='result-cards'>
          {caseStudy.results.map((result, i) => (
            result && result.title && (
              <motion.div 
                key={i} 
                className="result-card"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.2 + (i * 0.15),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <h3>{result.title}</h3>
                <p>{result.description || ''}</p>
              </motion.div>
            )
          ))}
        </div>
      </div>
      <img src={Blur5} className='p-blur5' alt="" />
    </div>
  )
}

// Next Project Section Component
const NextProjectSection = ({ nextProject, navigate }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })

  return (
    <div className="book-container case-circle" ref={ref}>
      <motion.div 
        className="bool-container-card" 
        onClick={() => navigate(`/case-study/${nextProject.projectId || nextProject.id}`)}
        style={{ cursor: 'pointer' }}
        initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
        animate={isInView ? { opacity: 1, scale: 1, rotateZ: 0 } : { opacity: 0, scale: 0.8, rotateZ: -10 }}
        transition={{ 
          duration: 1, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          scale: 1.05,
          rotateZ: 2,
          transition: { duration: 0.3 }
        }}
      >
        <img src={BookBg} className='bookbg' alt=""/>
        <div className="book-ab">
          <img src={NextP} className='next-p' alt="Next Project" />
        </div>
      </motion.div>
      <img src={Blur7} className='blur77' alt=""/>
      <img src={Blur8} className='blur8' alt=""/>
    </div>
  )
}

export default CaseStudy