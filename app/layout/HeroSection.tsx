'use client';

import { Button, Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSectionContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(13, 71, 161, 0.6), rgba(0, 150, 136, 0.5)), url('https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/pharmacy-website-hero-section.webp') no-repeat center center`,
  backgroundSize: 'cover',
  color: '#fff',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  position: 'relative',
  overflow: 'hidden',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: '700px',
}));

const HeroButton = styled(Button)(({ theme }) => ({
  padding: '15px 35px',
  fontSize: '1.15rem',
  fontWeight: 600,
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  marginRight: '15px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.03)',
  },
}));

export default function HeroSection() {
  return (
    <HeroSectionContainer id="hero">
      <Container maxWidth="lg">
        <HeroContent>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: '4rem',
              fontWeight: 800,
              marginBottom: '25px',
              color: '#fff',
              lineHeight: 1.2,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Empowering Health, Inspiring Wellness
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.4rem',
              marginBottom: '40px',
              color: '#e0e0e0',
              fontWeight: 300,
            }}
          >
            Discover a new era of pharmacy care with PharmaFind. <br />
            Your trusted source for medications, expert advice, and a healthier tomorrow.
          </Typography>
          <Box>
            <HeroButton
              variant="contained"
              sx={{
                backgroundColor: '#0dcaf0',
                borderColor: '#0dcaf0',
                '&:hover': {
                  backgroundColor: '#0db9d2',
                  borderColor: '#0db9d2',
                  boxShadow: '0 6px 20px rgba(13, 202, 240, 0.4)',
                },
              }}
              href="#services"
            >
              Explore Services
            </HeroButton>
            <HeroButton
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: '#fff',
                '&:hover': {
                  backgroundColor: '#fff',
                  color: '#0d6efd',
                  boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)',
                },
              }}
              href="#latest-medicines"
            >
              New Medicines
            </HeroButton>
          </Box>
        </HeroContent>
      </Container>
    </HeroSectionContainer>
  );
}