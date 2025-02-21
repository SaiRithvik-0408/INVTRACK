import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/style.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2 className="contact-title">Contact Us</h2>
        <form className="contact-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="contact-input" />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="contact-input" />
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows="4" className="contact-textarea"></textarea>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
        <div className="contact-link">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
