import { House } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios";
import "../CSS/style.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };
    if (email === "admin@gmail.com" && password === "admin") {
      // Store admin info if needed (no token)
      localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
      
      alert("Admin login successful!");
      navigate("/admin");
      return;
    }
    try {
      const response = await axiosInstance.post("/login", loginData, {
        withCredentials: true,
      });
      const { companyName } = response.data;
      if (response.status === 200) {
        navigate(`/profile/${companyName}`);
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response ? error.response.data : error
      );
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="home-icon">
        <Link to="/">
          <House size={28} color="#124468" />
        </Link>
      </div>
      <div className="login-card">
        <div className="login-content">
          <h2 className="login-title">Sign In to Your Account</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="login-description">
            Experience seamless inventory management with our cutting-edge
            software. Sign in to unlock your full potential!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Sign In
            </button>
            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
