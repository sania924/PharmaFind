import { FaCheckCircle } from "react-icons/fa";

export default function AboutUs() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          
          {/* Image */}
          <div>
            <img
              src="https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/Pharmacy%20Website%20Template/welcome-to-pharmasleek.webp"
              alt="About PharmaFind Team"
              className="w-full rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
            />
          </div>

          {/* Content */}
          <div className="lg:pl-6">
            {/* Section Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 relative inline-block pb-3">
                Welcome to PharmaFind
                <span className="absolute left-0 bottom-0 w-16 h-1 bg-cyan-400"></span>
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              PharmaFind is more than just a pharmacy; we are your partners in
              health. Our mission is to provide accessible, high-quality
              pharmaceutical care, innovative health solutions, and compassionate
              support to every individual we serve.
            </p>

            <p className="text-gray-600 mb-6">
              We believe in a holistic approach to wellness, combining expert
              knowledge with a deep commitment to our community's health. Our
              values of integrity, patient-centricity, and excellence guide
              everything we do.
            </p>

            {/* List */}
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <FaCheckCircle className="text-cyan-500 mr-2" />
                Personalized medication management
              </li>
              <li className="flex items-center text-gray-700">
                <FaCheckCircle className="text-cyan-500 mr-2" />
                Comprehensive range of health & wellness products
              </li>
              <li className="flex items-center text-gray-700">
                <FaCheckCircle className="text-cyan-500 mr-2" />
                Dedicated to fostering a healthier community
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
