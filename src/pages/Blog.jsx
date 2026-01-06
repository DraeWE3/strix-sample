import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Navbar'
import Footer from '../components/Footer'
import BlogNav from '../components/BlogNav'
import { ArrowLeft } from 'lucide-react';
import '../style/blog.css'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../admin/firebaseconfig'; // Adjust path as needed
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";
import ScrollAnimation from '../animations/scrollReveal'
import SlideInFramerOnLoad from '../animations/SlideInFramerOnLoad'

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Topics');

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, selectedCategory, blogs]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const blogsSnap = await getDocs(
        query(
          collection(db, 'blogs'),
          where('status', '==', 'published')
        )
      );
      const blogsData = blogsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in memory to avoid index requirement
      blogsData.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    if (selectedCategory !== 'All Topics') {
      filtered = filtered.filter(blog => 
        blog.tag?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.topic?.toLowerCase().includes(search) ||
        blog.tag?.toLowerCase().includes(search) ||
        blog.paragraphs?.some(p => p.text?.toLowerCase().includes(search))
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div>
        <Nav />
          <ScrollAnimation />
           <SlideInFramerOnLoad />
        <div className="blog">
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
          <div className="blog-top">
             <Link to='/'><button className="back-button">
                  <ArrowLeft size={16} /> Return to Homepage
                </button></Link>
          </div>

          <h1 className='blog-header slideinLoad'>Our Space to Think and Share</h1>

            <div className="blog-con">
                <div className="blog-nav slideInLeft">
                  <BlogNav
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                </div>

                <div className="blogcards">
                  {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      Loading blogs...
                    </div>
                  ) : filteredBlogs.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      No blogs found
                    </div>
                  ) : (
                    filteredBlogs.map(blog => (
                      <Link 
                        key={blog.id} 
                        to={`/blog/${blog.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="blogcard scrollReveal">
                          <div className="blog-card">
                            <img 
                              src={blog.image || '/placeholder.png'} 
                              alt={blog.topic}
                              onError={(e) => {
                                e.target.src = '/placeholder.png';
                              }}
                            />
                          </div>
                          <div className="blog-details">
                            <p className='blog-tag'>{blog.tag || 'General'}</p>
                            <p className="blog-date">{formatDate(blog.date)}</p>
                            <p className="description-blog">{blog.topic}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
            </div>
        </div>
        <Footer /> 
    </div>
  )
}

export default Blog