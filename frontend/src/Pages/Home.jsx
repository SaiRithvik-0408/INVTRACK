import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Poster1 from '../assets/images/InvTrack_Poster1.png';
import Poster2 from '../assets/images/group.png';
import Poster3 from '../assets/images/inventory1.png';
import Poster4 from '../assets/images/admin.png';
import '../CSS/style.css';

const Home = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <div className='navbar-fixed'>
        <Navbar />
      </div>
      <div className='home-container'>
        <div className='home-header'>
          <h1>Effortlessly Manage and Optimize<br />Your Inventory.</h1>
        </div>
        <div className='home-banner'>
          <img src={Poster1} alt="Inventory Management" />
        </div>
        <div className='about-section'>
          <h1>About Us</h1>
          <div className='divider'></div>
          <p style={{ fontSize: "3vh"}}>
            InvTrack is driven by a commitment to revolutionizing inventory management by providing a cutting-edge, efficient, and intuitive solution for businesses of all sizes. Our platform integrates advanced technology, including real-time tracking, automation, and data analytics, with a user-friendly design that simplifies complex inventory processes. 
          </p>
          <p style={{ fontSize: "3vh" }}> 
            With InvTrack, industries can efficiently monitor their products and assets, reduce manual errors, optimize stock levels, and gain valuable insights into inventory trends. Whether managing warehouses, retail stores, or supply chains, our comprehensive system ensures seamless inventory control, improved operational efficiency, and cost savings.  
          </p>
          <p style={{ fontSize: "3vh" }}>
            By leveraging cloud-based solutions and AI-powered analytics, InvTrack empowers businesses to make data-driven decisions, prevent stock shortages or overages, and enhance overall productivity. Our commitment to innovation and customer success makes InvTrack the ultimate choice for modern inventory management.
          </p>
        </div>

        <div className='features-section'>
          <h1>We Provide</h1>
          <div className='divider'></div>
          <div className='feature'>
            <p>Keep your inventory organized and up-to-date with our real-time tracking system.</p>
            <img src={Poster2} alt="Real-time Tracking" />
          </div>
          <div className='feature reverse'>
            <img src={Poster3} alt="Category Management" />
            <p>Easily locate and organize products with our advanced category and search capabilities.</p>
          </div>
          <div className='feature'>
            <p>Gain valuable insights into your business with our comprehensive dashboard.</p>
            <img src={Poster4} alt="Dashboard" />
          </div>
        </div>

        <div className='why-choose-us'>
          <h1>Why Choose Us?</h1>
          <div className='divider'></div>
          <ul>
            <li>Real-Time Data Sync</li>
            <li>Advanced Analytics</li>
            <li>Intuitive Design</li>
            <li>24/7 Customer Support</li>
          </ul>
        </div>

        {/* Testimonials Section (Commented Out) */}
        {/*
        <div className='testimonials'>
          <h1>Testimonials</h1>
          <div className='divider'></div>
          <blockquote>
            <p>"InvTrack has transformed our inventory system—it's seamless and reliable!"</p>
            <cite>– User A, Business Owner</cite>
          </blockquote>
          <blockquote>
            <p>"The real-time tracking saves us so much time and effort!"</p>
            <cite>– User B, Operations Manager</cite>
          </blockquote>
        </div>
        */}

        <div className='faq'>
          <h1>FAQ</h1>
          <div className='divider'></div>
          <details>
            <summary>What is InvTrack?</summary>
            <p>InvTrack is a user-friendly inventory management platform...</p>
          </details>
          <details>
            <summary>How secure is my data?</summary>
            <p>We prioritize data security with advanced encryption...</p>
          </details>
          <details>
            <summary>Can I use InvTrack on mobile?</summary>
            <p>Yes, InvTrack is optimized for both desktop and mobile use...</p>
          </details>
        </div>
      </div>

      {/* Back to Top Button */}
      {showButton && (
        <button className="back-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Home;