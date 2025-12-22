import Header from './header';
import HeroSection from './HeroSection';
import FeaturedMedicines from './FeaturedMedicines';
import Footer from './Footer';
import AboutUs from './about';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />
      
      <HeroSection />
      <AboutUs></AboutUs>
      <FeaturedMedicines />

      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}