'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const OfferSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(13, 71, 161, 0.6), rgba(0, 150, 136, 0.5)), url('https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/vitamin-and-supplement.webp') no-repeat center center`,
  backgroundSize: 'cover',
  color: '#fff',
  padding: '80px 0',
  textAlign: 'center',
}));

const DiscountText = styled(Typography)(({ theme }) => ({
  fontSize: '4.5rem',
  fontWeight: 800,
  color: '#fff',
  marginBottom: '10px',
  textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('md')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const OfferButton = styled(Button)(({ theme }) => ({
  padding: '12px 30px',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#0d6efd',
  backgroundColor: '#fff',
  borderRadius: '50px',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    color: '#0a58ca',
    transform: 'scale(1.05)',
  },
}));

export default function Offers() {
  return (
    <OfferSection id="offers">
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.8rem' },
            color: '#fff',
            marginBottom: '20px',
            fontWeight: 'bold',
          }}
        >
          Limited Time Health Offers!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.3rem' },
            color: '#e0f7fa',
            marginBottom: '30px',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Don't miss out on our exclusive discounts on selected health products and services. Your well-being, made more affordable.
        </Typography>
        <Box className="flex flex-col items-center justify-center">
          <DiscountText variant="h2">
            Save up to 25%
          </DiscountText>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              fontWeight: 500,
              marginBottom: '30px',
            }}
          >
            On all Vitamin & Supplement Brands this week!
          </Typography>
          <OfferButton
            variant="contained"
            size="large"
            href="#products"
          >
            Shop Now & Save
          </OfferButton>
        </Box>
      </Container>
    </OfferSection>
  );
}
