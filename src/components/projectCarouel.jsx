import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects, projectHref, isExternalProject } from '../lib/projects';
import { getOptimizedImage } from '../lib/cloudinary';
import '../style/carousal.css';
import '../style/button.css';

const SLIDE_MS = 600;
const AUTOPLAY_MS = 5000;

// The track renders three copies; the active index is kept inside the middle copy.
const middleIndex = (index, count) => count + (((index - count) % count) + count) % count;

const usePrefersReducedMotion = () => {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const sync = () => setReduced(list.matches);
    list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, []);
  return reduced;
};

const ProjectCarousel = () => {
  const { projects: carouselData, loading, error } = useProjects();
  const count = carouselData.length;
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonOffset, setButtonOffset] = useState("22.5%");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef(null);
  const animatingRef = useRef(false);
  const suppressClick = useRef(false);

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
    if (count) setCurrentIndex(count + Math.min(2, count - 1));
  }, [count]);

  const infiniteItems = [...carouselData, ...carouselData, ...carouselData];

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

  const goTo = useCallback((index) => {
    if (animatingRef.current || !count) return;
    animatingRef.current = true;
    setIsAnimating(true);
    setCurrentIndex(index);
  }, [count]);

  const step = useCallback((delta) => {
    if (animatingRef.current || !count) return;
    animatingRef.current = true;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + delta);
  }, [count]);

  const nextSlide = () => step(1);
  const prevSlide = () => step(-1);

  // After a slide settles, swap to the same card in the middle copy without a transition,
  // so wrapping around never animates cards back across the track.
  useEffect(() => {
    const timer = setTimeout(() => {
      animatingRef.current = false;
      setIsAnimating(false);
      if (count) setCurrentIndex((prev) => middleIndex(prev, count));
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [currentIndex, count]);

  const paused = hovered || focused || reducedMotion;
  useEffect(() => {
    if (paused || count < 2) return;
    const interval = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [paused, count, step]);

  const startX = useRef(0);
  const isDragging = useRef(false);
  const handleStart = (x) => { startX.current = x; isDragging.current = true; };
  const handleMove = (x) => {
    if (!isDragging.current) return;
    const diff = startX.current - x;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      isDragging.current = false;
      suppressClick.current = true;
    }
  };

  const onClickCapture = (event) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); nextSlide(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); prevSlide(); }
  };

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
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
    <div
      className='p-carousel-container'
      style={styles.container}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <div style={styles.backgroundEffect}></div>
      <div className='p-carousel-con'  style={styles.carouselContainer}
        ref={containerRef}
        onClickCapture={onClickCapture}
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
          const href = projectHref(item);
          let hitArea;
          if (!isCenter) {
            hitArea = (
              <button type="button" className="p-carousel-hit" aria-label={`Show ${item.title}`} onClick={() => goTo(index)} />
            );
          } else if (isExternalProject(item)) {
            hitArea = <a className="p-carousel-hit" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} (opens in a new tab)`} />;
          } else {
            hitArea = <Link className="p-carousel-hit" to={href} aria-label={item.title} />;
          }
          return (
            <div
              key={`${item.id}-${index}`}
              style={{ ...styles.carouselItem, ...getItemStyle(index) }}
              aria-hidden={Math.abs(index - currentIndex) > 2 || undefined}
            >
              <div style={styles.imageContainer(isCenter)}>
                <img src={getOptimizedImage(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                {hitArea}
              </div>
              <div style={styles.title}>{item.title}</div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="ui-btn-icon-only p-carousel-nav"
        onClick={prevSlide}
        aria-label="Previous project"
        aria-disabled={isAnimating}
        style={{
          position: 'absolute', top: '50%', left: buttonOffset, transform: 'translateY(-50%)',
          color: '#fff', zIndex: 30,
        }}
      >
        <ChevronLeft size={38} aria-hidden="true" />
      </button>

      <button
        type="button"
        className="ui-btn-icon-only p-carousel-nav"
        onClick={nextSlide}
        aria-label="Next project"
        aria-disabled={isAnimating}
        style={{
          position: 'absolute', top: '50%', right: buttonOffset, transform: 'translateY(-50%)',
          color: '#fff', zIndex: 30,
        }}
      >
        <ChevronRight size={38} aria-hidden="true" />
      </button>
    </div>
  );
};

export default ProjectCarousel;
