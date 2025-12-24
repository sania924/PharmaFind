'use client';

import { Box, Container, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BlogCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '15px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.07)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '360px',
  border: '1px solid #e9ecef',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
  },
}));

const ReadMoreLink = styled('a')(({ theme }) => ({
  color: '#0d6efd',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    color: '#0a58ca',
    textDecoration: 'underline',
    '& .arrow-icon': {
      transform: 'translateX(5px)',
    },
  },
}));

const blogPosts = [
  {
    title: 'Mindful Eating: A Path to Better Health',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/mindful-eating-a-path-to-better-health.webp',
    description: 'Discover how mindful eating can transform your relationship with food and improve digestion.',
  },
  {
    title: 'The Benefits of a Digital Detox',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/the-benefits-of-a-digital-detox.webp',
    description: 'Learn why taking a break from screens can boost your mental clarity and reduce stress.',
  },
  {
    title: 'Simple Ways to Stay Active Daily',
    image: 'https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/simple-ways-to-stay-active-daily.webp',
    description: 'Incorporate more movement into your routine with these easy and effective tips.',
  },
];

export default function Blog() {
  return (
    <Box id="blog" className="py-20">
      <Container maxWidth="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Your Daily Dose of Wellness
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Explore insightful articles, tips, and news to empower your health journey.
          </p>
        </div>
        <Box sx={{ position: 'relative', px: { xs: 0, md: 4 } }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-swiper"
          >
            {blogPosts.map((post, index) => (
              <SwiperSlide key={index}>
                <BlogCard>
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px',
                    }}
                  />
                  <CardContent sx={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      component="h5"
                      className="font-semibold text-gray-900 mb-2"
                      sx={{ fontSize: '1.05rem' }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-3" sx={{ flexGrow: 1, fontSize: '0.85rem' }}>
                      {post.description}
                    </Typography>
                    <ReadMoreLink href="#">
                      Read Full Article
                      <ArrowForward className="arrow-icon" sx={{ fontSize: '0.95rem', transition: 'transform 0.3s ease' }} />
                    </ReadMoreLink>
                  </CardContent>
                </BlogCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
      <style jsx global>{`
        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev {
          color: #0d6efd !important;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
        .blog-swiper .swiper-button-next::after,
        .blog-swiper .swiper-button-prev::after {
          font-size: 1.2rem !important;
          font-weight: bold;
        }
        .blog-swiper .swiper-pagination-bullet-active {
          background-color: #0d6efd !important;
        }
        .blog-swiper .swiper-slide {
          padding-bottom: 40px;
        }
      `}</style>
    </Box>
  );
}
