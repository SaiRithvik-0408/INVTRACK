import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { House } from "lucide-react";
import { axiosInstance } from "../axios";
import "../CSS/style.css"; // Import the CSS file

const SignUp = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/signup/create", formData, { withCredentials: true });
      if (response.status === 200) {
        navigate(`/profile/${response.data.companyName}`);
      }
    } catch (error) {
      setErrorMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="home-icon">
          <Link to="/"> <House size={28} color="#ffffff" /> </Link>
        </div>
        <h1>Welcome to IMS</h1>
        <p>Manage your inventory efficiently with our powerful software solution. Sign up today and take control of your inventory management.</p>
      </div>
      <div className="signup-right">
        <h2>Create an Account</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="companyName">Company Name</label>
          <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />

          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          <br /><br />
          <button type="submit">Sign Up</button>
        </form>
        <p>Already a user? <Link to="/signin" className="signin-link">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
