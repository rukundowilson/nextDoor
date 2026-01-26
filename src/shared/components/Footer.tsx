import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaTiktok, FaRss, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">kapee.</h3>
            <p className="text-gray-400 text-sm mb-6">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-gray-400">Lorem Ipsum, 2046 Lorem Ipsum</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-gray-400">576-245-2478</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-gray-400">info@kapee.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="flex-shrink-0" />
                <span className="text-gray-400">Mon - Fri / 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6">INFORMATION</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Store Location</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping & Delivery</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Latest News</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Our Sitemap</a></li>
            </ul>
          </div>

          {/* Our Service Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6">OUR SERVICE</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Sale</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Customer Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Delivery Information</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Payments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Saved Cards</a></li>
            </ul>
          </div>

          {/* My Account Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6">MY ACCOUNT</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition">My Account</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">My Shop</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">My Cart</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Checkout</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">My Wishlist</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Tracking Order</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="text-lg font-semibold mb-6">NEWSLETTER</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our mailing list to get the new updates!
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 text-gray-900 text-sm"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 font-semibold transition">
                SIGN UP
              </button>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition">
                <FaLinkedin size={16} />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded transition">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded transition">
                <FaTiktok size={16} />
              </a>
              <a href="#" className="bg-orange-600 hover:bg-orange-700 p-2 rounded transition">
                <FaRss size={16} />
              </a>
              <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded transition">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm">
          Kapee © 2026 by PressLayouts All Rights Reserved.
        </p>
        
        {/* Payment Methods */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <img src="https://via.placeholder.com/40x25?text=VISA" alt="Visa" className="h-6" />
          <img src="https://via.placeholder.com/40x25?text=PayPal" alt="PayPal" className="h-6" />
          <img src="https://via.placeholder.com/40x25?text=Discover" alt="Discover" className="h-6" />
          <img src="https://via.placeholder.com/40x25?text=Maestro" alt="Maestro" className="h-6" />
          <img src="https://via.placeholder.com/40x25?text=MasterCard" alt="MasterCard" className="h-6" />
          <img src="https://via.placeholder.com/40x25?text=Amex" alt="American Express" className="h-6" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
