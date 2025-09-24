import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Pi1 from "../assets/img/pi1.webp";
import Pi2 from "../assets/img/pi2.webp";
import Pi3 from "../assets/img/pi3.webp";
import '../style/carousal.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonOffset, setButtonOffset] = useState("22.5%"); // ✅ default desktop
  const containerRef = useRef(null);

  // ✅ Responsive button offset
  useEffect(() => {
    const updateOffset = () => {
      if (window.innerWidth <= 768) {
        setButtonOffset("3%"); // mobile
      } else {
        setButtonOffset("22.5%"); // desktop
      }
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const carouselData = [
    { id: 1, image: Pi1 },
    { id: 2, image: Pi2 },
    { id: 3, image: Pi3 },
    { id: 4, image: Pi1 },
    { id: 5, image: Pi2 },
    { id: 6, image: Pi3 },
    { id: 7, image: Pi1 },
  ];

  const infiniteItems = [...carouselData, ...carouselData, ...carouselData];
  const totalItems = infiniteItems.length;

  const getItemStyle = (index) => {
    const position = index - currentIndex;
    const isCenter = position === 0;
    const absPosition = Math.abs(position);

    let transform = '';
    let opacity = 1;
    let zIndex = 10;
    let scale = 1;

    if (isCenter) {
      transform = 'translateX(0%) translateZ(0px)';
      scale = 1.2;
      zIndex = 20;
      opacity = 1;
    } else if (absPosition === 1) {
      const translateX = position > 0 ? '120%' : '-120%';
      transform = `translateX(${translateX}) translateZ(-80px)`;
    } else if (absPosition === 2) {
      const translateX = position > 0 ? '240%' : '-240%';
      transform = `translateX(${translateX}) translateZ(-140px)`;
    } else {
      const translateX = position > 0 ? '320%' : '-320%';
      transform = `translateX(${translateX}) translateZ(-200px)`;
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      transition: isAnimating
        ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        : 'none',
    };
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= totalItems - 2 ? carouselData.length : newIndex;
    });
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 2 ? totalItems - carouselData.length - 1 : newIndex;
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
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const styles = {
    container: {
      width: '100%',
      height: 'auto',
      overflow: 'hidden',
      position: 'relative',
      marginTop: '2rem',
    },
    backgroundEffect: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'clamp(250px, 60vw, 400px)',
      height: 'clamp(250px, 60vw, 400px)',
      background:
        'radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
    },
    mainWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      position: 'relative',
    },
    carouselContainer: {
      position: 'relative',
      width: '100%',
      height: 'clamp(220px, 60vh, 400px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '1200px',
      perspectiveOrigin: '50% 50%',
    },
    carouselItem: {
      position: 'absolute',
      width: 'clamp(180px, 70vw, 320px)',
      height: 'clamp(120px, 50vw, 220px)',
      cursor: 'pointer',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.6)',
      transition: 'box-shadow 0.3s ease',
    },
    imageContainerHover: {
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 30,
      width: '60px',
      height: '60px',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    prevButton: {
      left: buttonOffset, // ✅ responsive offset
    },
    nextButton: {
      right: buttonOffset, // ✅ responsive offset
    },
    indicators: {
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      gap: '6px',
      display: 'none',
    },
    indicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    indicatorActive: {
      background: 'white',
      width: '20px',
      borderRadius: '4px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundEffect}></div>
      <div style={styles.mainWrapper}>
        <div ref={containerRef} style={styles.carouselContainer}>
          {infiniteItems.map((item, index) => (
            <div
              key={`${item.id}-${Math.floor(index / carouselData.length)}`}
              style={{ ...styles.carouselItem, ...getItemStyle(index) }}
              onClick={() => {
                if (!isAnimating && index !== currentIndex) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                }
              }}
            >
              <div
                style={styles.imageContainer}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    styles.imageContainerHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    styles.imageContainer.boxShadow;
                }}
              >
                <img
                  src={item.image}
                  alt={`Carousel item ${item.id}`}
                  style={styles.image}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Responsive Buttons */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          style={{
            ...styles.navButton,
            ...styles.prevButton,
            ...(isAnimating ? { opacity: 0.5 } : {}),
          }}
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={nextSlide}
          disabled={isAnimating}
          style={{
            ...styles.navButton,
            ...styles.nextButton,
            ...(isAnimating ? { opacity: 0.5 } : {}),
          }}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div style={styles.indicators}>
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex(index + carouselData.length);
              }
            }}
            style={{
              ...styles.indicator,
              ...((currentIndex % carouselData.length) === index
                ? styles.indicatorActive
                : {}),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
