// ContactSection.tsx
'use client';
import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 50px;
        }

        .header h1 {
          font-size: 36px;
          color: #333;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .header p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
        }

        .content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .formSection {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .formSection h2 {
          font-size: 24px;
          margin-bottom: 25px;
          color: #333;
          font-weight: 600;
        }

        .formGroup {
          margin-bottom: 20px;
        }

        .formGroup label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }

        .formGroup input,
        .formGroup textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }

        .formGroup input:focus,
        .formGroup textarea:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .formGroup textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submitBtn {
          width: 100%;
          padding: 15px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submitBtn:hover {
          background: #1565c0;
        }

        .submitBtn:active {
          transform: translateY(1px);
        }

        .infoSection {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .infoSection h2 {
          font-size: 24px;
          margin-bottom: 25px;
          color: #333;
          font-weight: 600;
        }

        .infoItem {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }

        .infoItem:last-child {
          margin-bottom: 0;
        }

        .icon {
          width: 24px;
          height: 24px;
          color: #1976d2;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .infoContent h3 {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }

        .infoContent p {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 30px 15px;
          }

          .header h1 {
            font-size: 28px;
          }

          .header p {
            font-size: 14px;
          }

          .formSection,
          .infoSection {
            padding: 20px;
          }

          .formSection h2,
          .infoSection h2 {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 24px;
          }

          .formGroup input,
          .formGroup textarea {
            padding: 10px;
          }

          .submitBtn {
            padding: 12px;
          }
        }

        .mapSection {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-top: 40px;
        }

        .mapSection h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
          font-weight: 600;
        }

        .mapContainer {
          width: 100%;
          height: 400px;
          border-radius: 8px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .mapSection {
            padding: 20px;
            margin-top: 30px;
          }

          .mapContainer {
            height: 300px;
          }
        }
      `}</style>

      <div id="contact" className="container">
        <div className="header">
          <h1>Connect With Us Today</h1>
          <p>We are here to assist you. Reach out with your questions, or plan your visit to our pharmacy.</p>
        </div>

        <div className="content">
          {/* Contact Form */}
          <div className="formSection">
            <h2>Send a Secure Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submitBtn">
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="infoSection">
            <h2>Our Pharmacy Details</h2>

            <div className="infoItem">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div className="infoContent">
                <h3>Visit Us:</h3>
                <p>123 Health Street, Wellness District, London WC1A 1AA, United Kingdom</p>
              </div>
            </div>

            <div className="infoItem">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <div className="infoContent">
                <h3>Call Us:</h3>
                <p>+44 7520 645778</p>
              </div>
            </div>

            <div className="infoItem">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <div className="infoContent">
                <h3>Email Us:</h3>
                <p>info@pharmaFind.com</p>
              </div>
            </div>

            <div className="infoItem">
              <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <div className="infoContent">
                <h3>Operating Hours:</h3>
                <p>
                  Mon - Fri: 8:30 AM - 7:30 PM<br/>
                  Sat: 9:00 AM - 4:00 PM<br/>
                  Sun: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mapSection">
          <h2>Find Us on the Map</h2>
          <div className="mapContainer">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d-0.12765708468152673!3d51.50735097963595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2slondon!5e0!3m2!1sen!2suk!4v1234567890123!5m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pharmacy Location Map"
            />
          </div>
        </div>
      </div>
    </>
  );
}