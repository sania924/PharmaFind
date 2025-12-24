"use client";

import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Alice S.",
    role: "Long-term Patient",
    quote:
      "The team at PharmaSleek is truly exceptional. They are not only knowledgeable but also incredibly caring. Their home delivery service is a game-changer for me!",
    avatar:
      "https://www.codewithfaraz.com/tools/placeholder?size=60x60&bgColor=FFCCBC&textColor=D84315&text=AS",
  },
  {
    name: "Bob J.",
    role: "Satisfied Customer",
    quote:
      "I switched to PharmaSleek a year ago and couldn't be happier. The pharmacists take time to explain everything, and their app makes refills so easy.",
    avatar:
      "https://www.codewithfaraz.com/tools/placeholder?size=60x60&bgColor=CFD8DC&textColor=37474F&text=BJ",
  },
  {
    name: "Clara W.",
    role: "Health Conscious Individual",
    quote:
      "Booking a health screening was simple and quick. The staff made me feel comfortable, and I got my results promptly.",
    avatar:
      "https://www.codewithfaraz.com/tools/placeholder?size=60x60&bgColor=E1BEE7&textColor=6A1B9A&text=CW",
  },
  {
    name: "David M.",
    role: "Wellness Enthusiast",
    quote:
      "Their selection of wellness products is fantastic, and I always find the latest health supplements.",
    avatar:
      "https://www.codewithfaraz.com/tools/placeholder?size=60x60&bgColor=D7CCC8&textColor=4E342E&text=DM",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Voices of Our Valued Patients
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Hear directly from those who have experienced the dedicated care at
            PharmaSleek.
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <Card
                elevation={0}
                className="border border-gray-200 rounded-2xl shadow-lg h-full"
              >
                <CardContent className="p-8 text-center">
                  <Avatar
                    src={item.avatar}
                    alt={item.name}
                    sx={{
                      width: 80,
                      height: 80,
                      margin: "0 auto 16px",
                      border: "4px solid #0dcaf0",
                    }}
                  />

                  <Typography
                    variant="body1"
                    className="italic text-gray-600 mb-5 leading-relaxed"
                  >
                    “{item.quote}”
                  </Typography>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-gray-800"
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-blue-600 font-medium"
                    >
                      {item.role}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
