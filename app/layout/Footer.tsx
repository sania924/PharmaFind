import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHeart,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1a2533] text-gray-400 pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <h5 className="flex items-center text-white font-semibold text-xl mb-6">
            
              PharmaSleek
            </h5>
            <p className="text-sm leading-relaxed">
              Your dedicated partner in achieving optimal health and wellness.
              We are committed to providing exceptional pharmaceutical care,
              expert advice, and a comprehensive range of health products.
            </p>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h5 className="text-white font-semibold text-lg mb-6">Explore</h5>
            <ul className="space-y-3">
              {["About", "Services", "Products", "New In", "Offers"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="transition-all duration-300 hover:text-cyan-400 hover:pl-1 block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h5 className="text-white font-semibold text-lg mb-6">Support</h5>
            <ul className="space-y-3">
              {[
                "FAQ",
                "Book Consultation",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="transition-all duration-300 hover:text-cyan-400 hover:pl-1 block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-3">
            <h5 className="text-white font-semibold text-lg mb-6">
              Follow Our Journey
            </h5>
            <p className="text-sm mb-4">
              Stay updated with our latest news and health tips on social media.
            </p>
            <div className="flex items-center space-x-4 text-2xl">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-cyan-400 transition-transform duration-300 hover:scale-110"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-cyan-400 transition-transform duration-300 hover:scale-110"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-cyan-400 transition-transform duration-300 hover:scale-110"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-cyan-400 transition-transform duration-300 hover:scale-110"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm">
          © {new Date().getFullYear()} PharmaSleek. All Rights Reserved.
        
        </div>
      </div>
    </footer>
  );
}
