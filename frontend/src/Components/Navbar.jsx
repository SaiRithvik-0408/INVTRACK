import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axios';
import logo from '../assets/logos/InvTrack_Logo.png';
import './css/navbar.css';

const Navbar = () => {
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await axiosInstance.get('/companyName', { withCredentials: true });
        if (response.data) {
          setCompanyName(response.data);
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src={logo} alt="InvTrack Logo" />
        </div>

        <div className="nav-links">
          <Link to={companyName ? `/profile/${companyName}/dashboard` : '/signin'} className="nav-link">Dashboard</Link>
          <Link to={companyName ? `/profile/${companyName}/inventory` : '/signin'} className="nav-link">Inventory</Link>
          {/* <Link to={companyName ? "/categories" : "/signin"} className="nav-link">Categories</Link> */}
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        <div className="auth-links">
          {companyName ? (
            <Link to={`/profile/${companyName}`} className="company-name">{companyName}</Link>
          ) : (
            <>
              <Link to="/signup" className="auth-link">Sign Up</Link>
              <Link to="/signin" className="auth-link">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
