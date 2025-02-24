import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../Components/Navbar';
import "../CSS/style.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formDataToSend = new FormData();
    
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    
    formDataToSend.append("access_key", "6616ddb3-0204-4c31-a552-c8cb9d4a9a7a");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      setFormData({ name: "", email: "", message: "" });
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contact-container">
      <Navbar />
      <div className="contact-container-inner">
      <div className="contact-box">
        <h2 className="contact-title">Contact Us</h2>
        <form className="contact-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="contact-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="contact-input"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="contact-textarea"
          ></textarea>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
        <span className="contact-result">{result}</span>
        <div className="contact-link">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Contact;
