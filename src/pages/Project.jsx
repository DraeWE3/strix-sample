import React from 'react'
import "../style/Project.css"
import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import ProjectCarousel from '../components/projectCarouel'
import ProjectCircle from '../assets/img/project-circle.webp'
import BtnNormsall from '../components/normSmall-btn'
import Project1 from '../assets/img/project1.webp'
import Connect from '../assets/img/connect.svg'
import Project2 from '../assets/img/project2.webp'
import Project3 from '../assets/img/project3.webp'
import Project4 from '../assets/img/project4.webp'
import Project5 from '../assets/img/project5.webp'
import Project6 from '../assets/img/project6.webp'
import Project7 from '../assets/img/project7.webp'
import Project8 from '../assets/img/project8.webp'
import Project9 from '../assets/img/project9.webp'
import Project10 from '../assets/img/project10.webp'
import Arrow from '../assets/img/arrow-right.svg'
import Loop from '../components/Loop'
import BookBg from '../assets/img/book-con.webp'
import BookTxt from '../assets/img/Book-txt.png'
import Blur1 from '../assets/img/p-blur2.png'
import Blur2 from '../assets/img/p-blur1.png'
import Blur3 from '../assets/img/p-blur3.png'
import Blur4 from '../assets/img/p-blur4.png'
import Blur5 from '../assets/img/p-blur3.png'
import Blur6 from '../assets/img/p-blur4.png'
import Blur7 from '../assets/img/blur5.png'
import Blur8 from '../assets/img/p-blur6.png'
import { Link } from 'react-router-dom'


const Project = () => {
  return (
    <div>
      <Nav />
      <div className="project-hero">
        <h1 className='project-hero-h1'>Projects</h1>
        <p className='project-hero-p'>Explore how we craft experiences that work and wow - one project at a time</p>
        <div className='project-carousel-con'>
          <img src={ProjectCircle} className='ProjectCircle'/>
          <h1>Latest Projects</h1>
          <ProjectCarousel />
        </div>
        <img src={Blur1} className='p-blur1' />
        <img src={Blur2} className='p-blur2' />
      </div>

         <div className="project-p-btn">
           <p className='link-button-all'>All projects</p>
          </div>


          {/* =============================section 2========= */}

          <div className="section2">
            <div className="sec2-btn-con">
                <BtnNormsall text='Design' /> <BtnNormsall text='Development' /> <BtnNormsall text='Production' />
            </div>
            <p className='sec2-p'>Explore our work across categories - each project designed to make an impact</p>
            <div className="p-card-con">
              <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project1} alt="" />
                <p>UI/UX Design, Development</p>
                <Link className='linkkk' to='/caseStudy'><div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div></Link>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project2} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project3} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project4} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project5} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project6} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project7} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project8} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project9} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>
               <div className="p-sec2-card">
                <img className='p-sec2-card-img' src={Project10} alt="" />
                <p>UI/UX Design, Development</p>
                <div><h2>Abhiwan</h2> <img src={Arrow} className='icon'/></div>
              </div>

                <img src={Blur3} className='p-blur3' />
                <img src={Blur4} className='p-blur4' />
                <img src={Blur5} className='p-blur5' />
                <img src={Blur6} className='p-blur6' />
              </div>
              <p className='sec2-ptxt'>Projects tailored to your industry or need are available on request.</p>
              <BtnNormsall text="Know More" />
            
          </div>

           <div className="project-logo-loop">
          <Loop />
        </div>


{/* ===============================Book Call================= */}

        <div className="book-container">
          <div className="bool-container-card">
            <img src={BookBg} className='bookbg'/>
            <div className="book-ab">
              <h1>Turn Your Vision Into an Experience That Lasts</h1>
              <p>You have a story worth sharing — we help you tell it in a way that’s impossible to ignore.</p>
              <img src={BookTxt} alt="" />
            </div>
          </div>

          <img src={Blur7} className='blur7'/>
          <img src={Blur8} className='blur8'/>
        </div>

    </div>
  )
}

export default Project;
