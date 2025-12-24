'use client';

import { Box, Container, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MedicineCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.07)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid #e9ecef',
  height: '380px',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#0d6efd',
  marginBottom: '12px',
}));

const medicines = [
  {
    name: 'NewGen PainRelief X',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/newgen-painrelief-x.webp',
    description: 'Advanced formula for rapid pain relief.',
    price: 29.99,
  },
  {
    name: 'ImmunoBoost Pro',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/immunoboost-pro.webp',
    description: 'Next-generation immune system support.',
    price: 34.50,
  },
  {
    name: 'CardioCare Plus',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/cardiocare-plus.webp',
    description: 'Innovative support for heart health.',
    price: 45.00,
  },
  {
    name: 'NeuroSupport Max',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/neurosupport-max.webp',
    description: 'Cognitive function and brain health enhancer.',
    price: 52.75,
  },
];

// Helper function to format GBP
const formatGBP = (amount: number) =>
  amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

export default function LatestMedicines() {
  return (
    <Box id="latest-medicines" className="py-20 bg-gray-50">
      <Container maxWidth="lg">
        <Box className="text-center mb-12">
          <Typography variant="h3" component="h2" className="font-bold text-gray-900 mb-4">
            New Arrivals & Innovations
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
            Stay ahead with the latest advancements in pharmaceutical care and wellness products.
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', px: { xs: 0, md: 4 } }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="medicines-swiper"
          >
            {medicines.map((medicine, index) => (
              <SwiperSlide key={index}>
                <MedicineCard>
                  <CardMedia
                    component="img"
                    image={medicine.image}
                    alt={medicine.name}
                    sx={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <CardContent sx={{ padding: '18px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h5" className="font-semibold text-gray-900 mb-2" sx={{ fontSize: '1rem' }}>
                      {medicine.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-3" sx={{ flexGrow: 1, fontSize: '0.85rem' }}>
                      {medicine.description}
                    </Typography>
                    <PriceText>{formatGBP(medicine.price)}</PriceText>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        backgroundColor: '#0d6efd',
                        fontSize: '0.85rem',
                        padding: '6px 12px',
                        '&:hover': {
                          backgroundColor: '#0a58ca',
                        },
                      }}
                    >
                      Details
                    </Button>
                  </CardContent>
                </MedicineCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
      <style jsx global>{`
        .medicines-swiper .swiper-button-next,
        .medicines-swiper .swiper-button-prev {
          color: #0d6efd !important;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
        .medicines-swiper .swiper-button-next::after,
        .medicines-swiper .swiper-button-prev::after {
          font-size: 1.2rem !important;
          font-weight: bold;
        }
        .medicines-swiper .swiper-pagination-bullet-active {
          background-color: #0d6efd !important;
        }
        .medicines-swiper .swiper-slide {
          padding-bottom: 40px;
        }
      `}</style>
    </Box>
  );
}
