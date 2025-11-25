import '../style/blogNav.css'
import { Link } from 'react-router-dom'
import Bloglogo from '../assets/img/blog-logo.webp'
import Cicon from "../assets/img/c-icon.webp";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Upwork from '../assets/img/cib--upwork.svg'
import Behance from '../assets/img/ri--behance-fill.svg'
import Dribble from '../assets/img/icon-park-outline--dribble.svg'
import Tweet from '../assets/img/prime--twitter.svg'
import Linkedin from '../assets/img/uil--linkedin.svg'
import Insta from '../assets/img/mdi--instagram.svg'
import Search from '../assets/img/search.svg'

const BlogNav = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
    const socialsRef = useRef(null);
    const containerRef = useRef(null);
    const heading1Ref = useRef(null);
    const heading2Ref = useRef(null);
    const paragraphRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
          gsap.set(imageRef.current, {
            xPercent: -50,
            yPercent: -50,
            top: "50%",
            left: "50%",
            position: "absolute",
          });
    
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
          tl.from(heading1Ref.current, { y: 50, opacity: 0, duration: 1 })
            .from(
              heading2Ref.current,
              { y: 50, opacity: 0, duration: 1 },
              "-=0.6"
            )
            .from(
              paragraphRef.current,
              { y: 30, opacity: 0, duration: 0.8 },
              "-=0.4"
            )
            .fromTo(
              imageRef.current,
              { opacity: 0, scale: 1.3 },
              {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "power4.out",
              },
              "-=0.3"
            )
            .from(
              socialsRef.current.children,
              {
                opacity: 0,
                y: 20,
                stagger: 0.15,
                duration: 0.6,
              },
              "-=0.8"
            );
        }, containerRef);
    
        return () => ctx.revert();
      }, []);

      
  return (
    <div className='blog-navv'>
      <div className="icon">
         <img src={Bloglogo} alt="" className='blog-logo' />
      </div>
      <div className="routeblog">
        <Link>HOME</Link><span>/</span><Link>BLOG</Link>
      </div>
      <p className='blognav-p'>
       Here's where we let you in — the sketches, the sparks, the lessons, & the late-night thoughts that shape the work you see.
      </p>

      <div className="blog-icons">
         <div ref={socialsRef} className="mobile-socials">
                <img src={Cicon} className="cion1" alt="cicon" />
                 <img src={Upwork} className="cion1" alt="cicon" />
                  <img src={Behance} className="cion1" alt="cicon" />
                   <img src={Dribble} className="cion1 cion3" alt="cicon" />
                     <img src={Insta} className="cion1 cion3" alt="cicon" />
                    <img src={Tweet} className="cion1 cion3" alt="cicon" />
                     <img src={Linkedin} className="cion1 cion3" alt="cicon" />
                    
              </div>
              <div className="line-rigt"></div>

              <div className="blogsearch">
                <img src={Search} alt="" />
                <input 
                  type="text" 
                  placeholder='Search Topic'
                  value={searchTerm || ''}
                  onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                />
              </div>

              <div className="blog-cat">
                <h3>Categories</h3>
                <p 
                  onClick={() => setSelectedCategory && setSelectedCategory('All Topics')}
                  style={{ 
                    cursor: 'pointer',
                    fontWeight: selectedCategory === 'All Topics' ? 'bold' : 'normal'
                  }}
                >
                  All Topics
                </p>
                <p 
                  onClick={() => setSelectedCategory && setSelectedCategory('Tips')}
                  style={{ 
                    cursor: 'pointer',
                    fontWeight: selectedCategory === 'Tips' ? 'bold' : 'normal'
                  }}
                >
                  Tips
                </p>
                <p 
                  onClick={() => setSelectedCategory && setSelectedCategory('News')}
                  style={{ 
                    cursor: 'pointer',
                    fontWeight: selectedCategory === 'News' ? 'bold' : 'normal'
                  }}
                >
                  News
                </p>
                <p 
                  onClick={() => setSelectedCategory && setSelectedCategory('Saved')}
                  style={{ 
                    cursor: 'pointer',
                    fontWeight: selectedCategory === 'Saved' ? 'bold' : 'normal'
                  }}
                >
                  Saved
                </p>
              </div>
              <div className="line-rigt"></div>

               <div className="blog-cat">
                <h3>Explore More</h3>
                  <Link className='blog-link' to='/about'>About Us</Link> <span> | </span> <Link to='/Project' className='blog-link'>Case Study</Link>
              </div>
      </div>
    </div>
  )
}

export default BlogNav