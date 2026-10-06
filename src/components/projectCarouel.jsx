import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects, projectHref, isExternalProject } from '../lib/projects';
import { getOptimizedImage } from '../lib/cloudinary';
import '../style/carousal.css';
import '../style/button.css';

const ProjectCarousel = () => {
  const { projects: carouselData, loading, error } = useProjects();
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonOffset, setButtonOffset] = useState("22.5%");
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateOffset = () => {
      if (window.innerWidth <= 768) {
        setButtonOffset("1%");
      } else if (window.innerWidth <= 1500) {
        setButtonOffset("33.4%");
      } else {
        setButtonOffset("32.4rem");
      }
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  useEffect(() => {
    setCurrentIndex(Math.min(2, Math.max(0, carouselData.length - 1)));
  }, [carouselData.length]);

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
    let visibility = "visible";

    if (isCenter) {
      transform = 'translateX(0%) translateZ(0px)';
      scale = 1.2;
      zIndex = 20;
      opacity = 1;
    } else if (absPosition === 1) {
      const translateX = position > 0 ? '135%' : '-135%';
      transform = `translateX(${translateX}) translateZ(-80px)`;
    } else if (absPosition === 2) {
      const translateX = position > 0 ? '270%' : '-270%';
      transform = `translateX(${translateX}) translateZ(-140px)`;
    } else {
      const translateX = position > 0 ? '360%' : '-360%';
      transform = `translateX(${translateX}) translateZ(-200px)`;
      opacity = 0;
      visibility = "hidden";
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      visibility,
      zIndex,
      transition: isAnimating
        ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        : 'none',
    };
  };

  const nextSlide = () => {
    if (isAnimating || !carouselData.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= totalItems - 2 ? carouselData.length : newIndex;
    });
  };

  const prevSlide = () => {
    if (isAnimating || !carouselData.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 2 ? totalItems - carouselData.length - 1 : newIndex;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, carouselData.length]);

  const openProject = (project) => {
    const href = projectHref(project);
    if (isExternalProject(project)) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  const startX = useRef(0);
  const isDragging = useRef(false);
  const handleStart = (x) => { startX.current = x; isDragging.current = true; };
  const handleMove = (x) => {
    if (!isDragging.current) return;
    const diff = startX.current - x;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      isDragging.current = false;
    }
  };

  const styles = {
    container: {  overflow: 'hidden', maxWidth: '1400px', width: '100%', position: 'relative', cursor: 'grab' },
    backgroundEffect: {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'clamp(250px, 60vw, 400px)',
      height: 'clamp(250px, 60vw, 400px)',
      background: 'radial-gradient(circle, rgba(139,69,19,0.1) 0%, transparent 70%)',
      borderRadius: '50%', filter: 'blur(60px)',
    },
    carouselContainer: {
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: '1200px', marginBottom: '1.5rem',

    },
    carouselItem: {
      position: 'absolute',
      width: 'clamp(180px, 70vw, 395px)',
      height: 'clamp(120px, 50vw, 260px)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    imageContainer: (isCenter) => ({
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '2rem',
      overflow: 'hidden',
      boxShadow: isCenter
        ? '0 0 20px 2px rgba(255, 255, 255, 0.4)'
        : '0 15px 30px -10px rgba(0, 0, 0, 0.6)',
      transition: 'box-shadow 0.4s ease',
    }),
    title: {
      marginTop: '0.8rem',
      fontSize: '1.2rem',
      color: '#fff',
      fontWeight: '500',
      fontFamily: "cd-reg",
      textAlign: 'center',
      textShadow: '0 2px 6px rgba(0,0,0,0.6)',
    },
    status: {
      color: '#ccc',
      fontFamily: "cd-reg",
      fontSize: '1.1rem',
      textAlign: 'center',
      margin: 0,
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderTop: '3px solid rgba(255,255,255,0.6)',
      borderRadius: '50%',
      animation: 'p-carousel-spin 1s linear infinite',
    },
  };

  if (loading || error || carouselData.length === 0) {
    return (
      <div className='p-carousel-container' style={styles.container}>
        <div style={styles.backgroundEffect}></div>
        <div className='p-carousel-con' style={styles.carouselContainer} role="status" aria-live="polite">
          {loading ? (
            <>
              <div style={styles.spinner} aria-label="Loading projects" />
              <style>{`@keyframes p-carousel-spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            <p style={styles.status}>
              {error ? 'Projects could not be loaded right now.' : 'No projects published yet.'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='p-carousel-container' style={styles.container}>
      <div style={styles.backgroundEffect}></div>
      <div className='p-carousel-con'  style={styles.carouselContainer}
        ref={containerRef}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => (isDragging.current = false)}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
      >
        {infiniteItems.map((item, index) => {
          const isCenter = index === currentIndex;
          return (
            <div
              key={`${item.id}-${index}`}
              style={{ ...styles.carouselItem, ...getItemStyle(index) }}
              onClick={() => {
                if (isAnimating) return;
                if (isCenter) {
                  openProject(item);
                } else {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                }
              }}
            >
              <div style={styles.imageContainer(isCenter)}>
                <img src={getOptimizedImage(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={styles.title}>{item.title}</div>
            </div>
          );
        })}
      </div>

      <button
        className="ui-btn-icon-only"
        onClick={prevSlide}
        disabled={isAnimating}
        style={{
          position: 'absolute', top: '50%', left: buttonOffset, transform: 'translateY(-50%)',
          display: 'none', color: '#fff', zIndex: 30,
        }}
      >
        <ChevronLeft size={38} />
      </button>

      <button
        className="ui-btn-icon-only"
        onClick={nextSlide}
        disabled={isAnimating}
        style={{
          position: 'absolute', top: '50%', right: buttonOffset, transform: 'translateY(-50%)',
          display: 'none', color: '#fff', zIndex: 30,
        }}
      >
        <ChevronRight size={38} />
      </button>
    </div>
  );
};

export default ProjectCarousel;
