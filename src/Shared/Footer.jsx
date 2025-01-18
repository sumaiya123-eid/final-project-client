import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaDumbbell } from 'react-icons/fa';
import bg from "../assets/images/footer.webp";  // Ensure your image path is correct

const Footer = () => {
  return (
    <footer className="bg-cover bg-center py-20" style={{ backgroundImage: `url(${bg})` }}>
      <div className="container mx-auto text-center text-black">
        <div className="mb-6">
          <FaDumbbell className="mx-auto mb-4 text-5xl text-gray-800" /> {/* Added FaDumbbell as logo */}
          <h2 className="text-3xl font-semibold">Your Website Name</h2>
          <p className="mt-2 text-lg">Innovating for a better future.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <p className="mt-2">Email: contact@yourwebsite.com</p>
            <p>Phone: (123) 456-7890</p>
            <p>Address: 123 Your Street, City, Country</p>
          </div>

          {/* Social Media Links */}
          <div className="footer-section">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="social-icons flex justify-center gap-8 text-3xl mt-4">
              <a href="#" className="transition-transform transform hover:scale-125 duration-300 hover:text-blue-500">
                <FaFacebookF />
              </a>
              <a href="#" className="transition-transform transform hover:scale-125 duration-300 hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="#" className="transition-transform transform hover:scale-125 duration-300 hover:text-pink-500">
                <FaInstagram />
              </a>
              <a href="#" className="transition-transform transform hover:scale-125 duration-300 hover:text-blue-700">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="footer-section">
            <h3 className="text-xl font-semibold">Our Location</h3>
            <p className="mt-2">Visit Us at:</p>
            <p>123 Your Street, City, Country</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10">
          <p className="text-sm opacity-70">© 2025 Your Website Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
