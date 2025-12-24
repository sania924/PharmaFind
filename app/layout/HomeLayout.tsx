import Header from './header';
import HeroSection from './HeroSection';
import AboutUs from './about';
import Services from './Services';
import FeaturedMedicines from './FeaturedMedicines';
import LatestMedicines from './LatestMedicines';
import Offers from './Offers';
import Blog from './Blog';
import Testimonials from './testimonals';
import ContactSection from './ContactSection';
import Footer from './Footer';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />

      <HeroSection />
      <AboutUs />
      <Services />
      <FeaturedMedicines />
      <LatestMedicines />
      <Offers />
      <Blog />
      <Testimonials />
      <ContactSection />

      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}