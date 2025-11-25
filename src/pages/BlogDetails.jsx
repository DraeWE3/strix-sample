import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from '../components/Navbar';
import Footer from '../components/Footer';
import BlogNav from '../components/BlogNav';
import { ArrowLeft, Heart, Bookmark, Share2 } from 'lucide-react';
import '../style/blog.css';
import Circleblur from '../assets/img/sr-img.webp';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../admin/firebaseconfig';
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadBlogDetails();
    const savedLiked = localStorage.getItem(`blog_liked_${id}`) === 'true';
    const savedBookmarked = localStorage.getItem(`blog_bookmarked_${id}`) === 'true';
    setLiked(savedLiked);
    setBookmarked(savedBookmarked);
  }, [id]);

  const loadBlogDetails = async () => {
    try {
      setLoading(true);
      const blogsSnap = await getDocs(collection(db, 'blogs'));
      const blogData = blogsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(b => b.id === id);
      
      setBlog(blogData);
      setLikeCount(blogData?.likes || 0);
    } catch (error) {
      console.error('Error loading blog details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog) return;
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    localStorage.setItem(`blog_liked_${id}`, newLikedState);
    
    const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount);
    
    try {
      await updateDoc(doc(db, 'blogs', id), {
        likes: increment(newLikedState ? 1 : -1)
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleBookmark = () => {
    const newBookmarkedState = !bookmarked;
    setBookmarked(newBookmarkedState);
    localStorage.setItem(`blog_bookmarked_${id}`, newBookmarkedState);
    
    if (newBookmarkedState) {
      alert('Post bookmarked! 📌');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: blog?.headerText || blog?.topic,
      text: 'Check out this blog post!',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! 📋');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderContent = (contentBlock) => {
    switch (contentBlock.type) {
      case 'paragraph':
        return <p className='blog-writeup' key={contentBlock.id}>{contentBlock.content}</p>;
      
      case 'image':
        return <img className='blog-content-image' key={contentBlock.id} src={contentBlock.content} alt="Blog content" />;
      
      case 'subheading':
        return <h2 className='blog-subheading' key={contentBlock.id}>{contentBlock.content}</h2>;
      
      case 'keypoints':
        return (
          <ul className='blog-keypoints' key={contentBlock.id}>
            {contentBlock.content.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div>

        <Nav />
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
        <div className="blog">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Loading blog details...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <Nav />
        <div className="blog">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Blog not found
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="blog">
        <div className="blog-top">
          <Link to='/blog'>
            <button className="back-button">
              <ArrowLeft size={16} /> Return to Blog
            </button>
          </Link>
        </div>

        {/* HERO SECTION - UNCHANGED, USES YOUR ORIGINAL STATIC DESIGN */}
        <div className="blog-deatil-hero">
          <div className="slidein sh-top uiux-hero">
            <img src={Circleblur} alt="" />
            <h1>Our Space to <br/>Think and Share</h1>
          </div>
        </div>

        <div className="blog-con">
          <div className="blog-nav">
            <BlogNav />
          </div>

          {/* ONLY THIS SECTION GETS DATA FROM FIREBASE */}
          <div className="blogcards blog-con-de">
            <img className='blogdetails-img' src={blog.detailsImage} alt="" />
            <p className='blog-tag de-blog-tag'>{blog.tag}</p>
            <h1>{blog.headerText || blog.topic}</h1>
            
            {/* First paragraph */}
            {blog.content && blog.content.length > 0 && blog.content[0].type === 'paragraph' && (
              <p className='blog-writeup'>{blog.content[0].content}</p>
            )}

            {/* Social Icons */}
            <div className="blog-iconn">
              <button 
                className={`blog-action-btn love ${liked ? 'active' : ''}`} 
                onClick={handleLike}
                title="Like"
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                {likeCount > 0 && <span className="like-count">{likeCount}</span>}
              </button>
              
              <button 
                className={`blog-action-btn favourite ${bookmarked ? 'active' : ''}`} 
                onClick={handleBookmark}
                title="Bookmark"
              >
                <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
              </button>
              
              <button 
                className="blog-action-btn share" 
                onClick={handleShare}
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Remaining content */}
            {blog.content && blog.content.length > 0 && 
              blog.content.slice(blog.content[0].type === 'paragraph' ? 1 : 0).map((block) => (
                <div key={block.id}>
                  {renderContent(block)}
                </div>
              ))
            }

            {(!blog.content || blog.content.length === 0) && (
              <p className='blog-writeup'>No content available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetails;