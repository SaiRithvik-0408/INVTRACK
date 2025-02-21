import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { axiosInstance } from "../axios";
import Banner from "../assets/images/Banner.jpg";
import "../CSS/Profile.css"; // Import the CSS file

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { companyName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axiosInstance.get(`/profile/${companyName}`, {
          withCredentials: true,
        });
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/signin");
        }
      }
    };

    fetchData();
  }, [navigate, companyName]);

  if (!userData) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="banner">
        <img className="banner-image" src={Banner} alt="Company Banner" />
      </div>

      <div className="profile-content">
        <h1 className="profile-title">Welcome, {userData.companyName}!</h1>
        <div className="profile-info">
          <div className="profile-header">
            <h1>Company Information</h1>
            <Link to="/logout" className="logout-link">
              <IoIosLogOut />
              <span>Log Out</span>
            </Link>
          </div>

          <div className="profile-details">
            <p>
              <strong>Company Name</strong>
              <span>{userData.companyName}</span>
            </p>
            <p>
              <strong>Company Email</strong>
              <span>{userData.email}</span>
            </p>
            <p>
              <strong>Phone</strong>
              <span>{userData.phone}</span>
            </p>
          </div>

        </div>
      </div>
      <div className="footer">
        <div className="inventory-section">
          <Link to={`/profile/${companyName}/inventory`}>Check out Your Inventory!</Link>
        </div>

        <div className="back-home">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
