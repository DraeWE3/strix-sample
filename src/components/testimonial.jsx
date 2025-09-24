import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Pi1 from "../assets/img/pi1.jpg";
import Pi2 from "../assets/img/pi2.webp";
import Pi3 from "../assets/img/pi3.webp";
import T1 from "../assets/img/hiren.webp"
import '../style/carousal.css';
import '../style/test.css'

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2); 
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  // ✅ Testimonial Data
  const testimonialData = [
    { 
      id: 1, 
      image: T1, 
      name: "Hiren", 
      position: "Design Head, Interpolitan Money", 
      text: "We hired Strix Production for few Web-Design projects and it was great working with them. The team's commitment to timely delivery and high quality makes him stand different from others. Everyone in the team is a thorough gentleman and professional to work with!"
    },
    { 
      id: 2, 
      image: T1, 
      name: "Rick Wickelton", 
      position: "CTO , IT Empire", 
      text: "They transformed our clunky interface into a beautiful, lightning-fast website. The entire process was seamless, and our user engagement is up 40% since launch. A total game-changer."
    },
    { 
      id: 3, 
      image: T1, 
      name: "Sameer", 
      position: "CEO, Zenith Wellness", 
      text: "From brand design to web development and video production, they excel at everything. It’s rare to find a single agency that delivers such high quality across the board. They are our go-to creative partner."
    },
    { 
      id: 4, 
      image: T1, 
      name: "Akshay Dave", 
      position: "Marketing Head, Wroot", 
      text: "As a small business owner, I was lost. They patiently guided me from a simple idea to a beautiful brand and a professional e-commerce site. Our online orders have tripled!"
    },
    { 
      id: 5, 
      image: T1, 
      name: "Anjali", 
      position: "Project Lead, FinSecure Logistics", 
      text: "We had a highly complex web portal project. Their development team delivered a robust, secure, and elegant solution that has drastically improved our efficiency. True technical experts."
    }
  ];

  // Infinite loop by duplicating
  const infiniteItems = [...testimonialData, ...testimonialData, ...testimonialData];
  const totalItems = infiniteItems.length;

  const getCardStyle = (index) => {
    const position = index - currentIndex;
    const isCenter = position === 0;
    const absPosition = Math.abs(position);
    
    let transform = '';
    let opacity = 1;
    let zIndex = 10;
    let scale = 1;
    
    if (isCenter) {
      transform = 'translateX(0%) translateZ(0px)';
      scale = 1.1;
      zIndex = 20;
      opacity = 1;
    } else if (absPosition === 1) {
  const translateX = position > 0 ? '120%' : '-120%';
  transform = `translateX(${translateX}) translateZ(-60px)`;
} else if (absPosition === 2) {
  const translateX = position > 0 ? '240%' : '-240%';
  transform = `translateX(${translateX}) translateZ(-120px)`;
} else if (absPosition === 3) {
  const translateX = position > 0 ? '360%' : '-360%';
  transform = `translateX(${translateX}) translateZ(-180px)`;
} else {
  const translateX = position > 0 ? '480%' : '-480%';
  transform = `translateX(${translateX}) translateZ(-240px)`;
}

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      transition: isAnimating ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    };
  };

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      return newIndex >= totalItems - 2 ? testimonialData.length : newIndex;
    });
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      return newIndex < 2 ? totalItems - testimonialData.length - 1 : newIndex;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAnimating]);
const isMobile = window.innerWidth <= 768;
  const styles = {
  container: {
    width: "100%",
    height: "auto",
    minHeight: "20rem",
    overflow: "hidden",
    position: "relative",
    marginTop: "2rem",
    padding: "0 1rem", // spacing for small screens
  },
  mainWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: "24rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: "1200px",
    perspectiveOrigin: "50% 50%",
  },
  card: {
    position: "absolute",
    width: "clamp(260px, 80%, 500px)", // ✅ responsive width
    minHeight: "280px",
    padding: "1rem",
    borderRadius: "1.5rem",
    color: "#fff",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 0.75rem",
  },
  name: {
    fontWeight: "bold",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)", // ✅ scales
  },
  position: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    opacity: 0.7,
    marginBottom: "0.5rem",
  },
  text: {
    fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
    lineHeight: 1.4,
    marginBottom: "0.5rem",
  },
navBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    borderRadius: "50%",
    background: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  prevBtn: isMobile ? { left: "1%" } : { left: "22.5%" },
  nextBtn: isMobile ? { right: "1%" } : { right: "22.5%" },
};


  return (
    <div style={styles.container}>
      <div style={styles.mainWrapper}>
        <div ref={containerRef} style={styles.carouselContainer}>
          {infiniteItems.map((item, index) => (
            <div className='test-card'
              key={`${item.id}-${Math.floor(index / testimonialData.length)}`}
              style={{ ...styles.card, ...getCardStyle(index) }}
              onClick={() => {
                if (!isAnimating && index !== currentIndex) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                }
              }}
            >
              <img src={item.image} alt={item.name} style={styles.avatar} />
                            <p className='test-p' style={styles.text}>"{item.text}"</p>
              <div className='text-name' style={styles.name}>{item.name}</div>
              <div className='position-test' style={styles.position}>{item.position}</div>

            </div>
          ))}
        </div>

        {/* Nav Buttons */}
        <button className='desktop-arrow' onClick={prevTestimonial} disabled={isAnimating} style={{ ...styles.navBtn, ...styles.prevBtn }}>
          <ChevronLeft size={50} />
        </button>
        <button className='desktop-arrow' onClick={nextTestimonial} disabled={isAnimating} style={{ ...styles.navBtn, ...styles.nextBtn }}>
          <ChevronRight size={50} />
        </button>

         <button className='mobile-arrow' onClick={prevTestimonial} disabled={isAnimating} style={{ ...styles.navBtn, ...styles.prevBtn }}>
          <ChevronLeft size={30} />
        </button>
        <button className='mobile-arrow' onClick={nextTestimonial} disabled={isAnimating} style={{ ...styles.navBtn, ...styles.nextBtn }}>
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
