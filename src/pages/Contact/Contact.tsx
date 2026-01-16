// Contact.tsx
import React, { useState } from 'react';
import './Contact.css'; 
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { app } from "../../firebase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const db = getFirestore(app);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitted(true);

    // Save message to Firestore for automated reply via Cloud Function
    try {
      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        subject,
        message,
        createdAt: Timestamp.now()
      });
    } catch {
      setError('Failed to send message. Please try again later.');
      setSubmitted(false);
      return;
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      {submitted && (
        <>
          <p className="success-message">Thank you! Your message has been sent.</p>
          <p className="info-message">Note: If you don’t see our email, please check your Spam or Junk folder and mark it as ‘Not Spam’.</p>
        </>
      )}
      {error && <p className="error-message">{error}</p>}
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}