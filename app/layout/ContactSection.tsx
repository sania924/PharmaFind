'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
} from '@mui/icons-material';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
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
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add form validation and submission logic
  };

  return (
    <Box id="contact" className="py-16 bg-gray-50 scroll-mt-20">
      <Box className="container mx-auto px-4 max-w-7xl">
        <Box className="text-center mb-12">
          <Typography variant="h2" className="text-3xl font-bold text-gray-800 mb-4">
            Connect With Us Today
          </Typography>
          <Typography variant="body1" className="text-gray-600 text-lg">
            We are here to assist you. Reach out with your questions, or plan your visit to our pharmacy.
          </Typography>
        </Box>

        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Box>
            <Box className="bg-white p-10 rounded-xl shadow-lg h-full flex flex-col">
              <Typography variant="h4" className="mb-6 text-gray-800 font-semibold">
                Send a Secure Message
              </Typography>
              <form onSubmit={handleSubmit} className="flex-grow space-y-4">
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  multiline
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  className="mb-4"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  className="mt-6 py-3 text-lg font-semibold"
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  Send Message
                </Button>
              </form>
            </Box>
          </Box>

          {/* Contact Information */}
          <Box>
            <Typography variant="h4" className="mb-6 text-gray-800 font-semibold">
              Our Pharmacy Details
            </Typography>

            <Box className="space-y-6 mb-8">
              {/* Address */}
              <Box className="flex items-start">
                <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
                  <LocationOn className="text-blue-600" />
                </Box>
                <Box>
                  <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                    Visit Us:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    123 Health St, Wellness City, HC 45678, USA
                  </Typography>
                </Box>
              </Box>

              {/* Phone */}
              <Box className="flex items-start">
                <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
                  <Phone className="text-blue-600" />
                </Box>
                <Box>
                  <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                    Call Us:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <a href="tel:+15551234567" className="text-blue-600 hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </Typography>
                </Box>
              </Box>

              {/* Email */}
              <Box className="flex items-start">
                <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
                  <Email className="text-blue-600" />
                </Box>
                <Box>
                  <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                    Email Us:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <a href="mailto:info@pharmaFind.com" className="text-blue-600 hover:underline">
                      info@pharmaFind.com
                    </a>
                  </Typography>
                </Box>
              </Box>

              {/* Hours */}
              <Box className="flex items-start">
                <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
                  <AccessTime className="text-blue-600" />
                </Box>
                <Box>
                  <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                    Operating Hours:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Mon - Fri: 8:30 AM - 7:30 PM<br />
                    Sat: 9:00 AM - 4:00 PM<br />
                    Sun: Closed
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Map */}
            <Box className="rounded-xl overflow-hidden shadow-lg h-96">
              <iframe
                title="Google Maps Location of PharmaSleek"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2199008396003!2d-73.98513088459314!3d40.75048187932787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259015532470d%3A0x5c6f395012f052a0!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1620056789012!5m2!1sen!2sus"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}