'use client';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Medication, Vaccines, MonitorHeart, LocalShipping, PersonSearch, Healing } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServiceCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '15px',
  padding: '25px 20px',
  textAlign: 'center',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '280px',
  border: '1px solid #e9ecef',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '2.5rem',
  color: '#0d6efd',
  marginBottom: '15px',
  lineHeight: 1,
  display: 'flex',
  justifyContent: 'center',
  '& svg': {
    fontSize: '2.5rem',
  },
}));

const services = [
  {
    icon: <Medication />,
    title: 'Prescription Services',
    description: 'Accurate, fast, and reliable prescription filling, with options for easy refills and medication synchronization.',
  },
  {
    icon: <Vaccines />,
    title: 'Immunizations & Vaccines',
    description: 'Protect yourself and your loved ones with a wide range of vaccines, administered by our certified pharmacists.',
  },
  {
    icon: <MonitorHeart />,
    title: 'Health Screenings',
    description: 'Convenient health monitoring services, including blood pressure, cholesterol, and glucose screenings.',
  },
  {
    icon: <Healing />,
    title: 'OTC & Wellness Products',
    description: 'An extensive selection of over-the-counter medications, vitamins, supplements, and personal care items.',
  },
  {
    icon: <LocalShipping />,
    title: 'Express Delivery',
    description: 'Get your prescriptions and health essentials delivered to your doorstep, quickly and discreetly.',
  },
  {
    icon: <PersonSearch />,
    title: 'Medication Therapy Management',
    description: 'Personalized consultations to review your medications, optimize effectiveness, and minimize side effects.',
  },
];

export default function Services() {
  return (
    <Box id="services" className="py-20 bg-gray-50">
      <Container maxWidth="lg">
        <Box className="text-center mb-12">
          <Typography variant="h3" component="h2" className="font-bold text-gray-900 mb-4">
            Our Comprehensive Services
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
            Delivering excellence in pharmaceutical care, tailored to your needs.
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', px: { xs: 0, md: 4 } }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="services-swiper"
          >
            {services.map((service, index) => (
              <SwiperSlide key={index}>
                <ServiceCard>
                  <CardContent>
                    <IconWrapper>{service.icon}</IconWrapper>
                    <Typography variant="h6" component="h4" className="font-semibold text-gray-900 mb-2" sx={{ fontSize: '1.1rem' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600" sx={{ fontSize: '0.85rem' }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </ServiceCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
      <style jsx global>{`
        .services-swiper .swiper-button-next,
        .services-swiper .swiper-button-prev {
          color: #0d6efd !important;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
        .services-swiper .swiper-button-next::after,
        .services-swiper .swiper-button-prev::after {
          font-size: 1.2rem !important;
          font-weight: bold;
        }
        .services-swiper .swiper-pagination-bullet-active {
          background-color: #0d6efd !important;
        }
        .services-swiper .swiper-slide {
          padding-bottom: 40px;
        }
      `}</style>
    </Box>
  );
}
