import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Poster1 from '../assets/images/InvTrack_Poster1.png';
import Poster2 from '../assets/images/group.png';
import Poster3 from '../assets/images/inventory1.png';
import Poster4 from '../assets/images/admin.png';
import '../CSS/style.css';

const Home = () => {
  return (
    <div>
      <Navbar />
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
          <p>
            InvTrack is driven by a commitment to revolutionize inventory management. Our platform combines
            advanced technology with user-friendly design to help industries effectively monitor their products and assets.
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
          <ul >
            <li>Real-Time Data Sync</li>
            <li>Advanced Analytics</li>
            <li>Intuitive Design</li>
            <li>24/7 Customer Support</li>
          </ul>
        </div>

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
      <Footer />
    </div>
  );
};

export default Home;
