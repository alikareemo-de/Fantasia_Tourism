
import React from 'react';
import { Compass, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-tourism-ocean to-tourism-teal py-12 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Compass size={24} className="mr-2" />
              <h2 className="text-2xl font-bold">Fantasia Tourism</h2>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover-scale bg-white/20 p-2 rounded-full">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover-scale bg-white/20 p-2 rounded-full">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover-scale bg-white/20 p-2 rounded-full">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-3 border-b border-white/30 pb-2">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">About Us</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Careers</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Press</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 border-b border-white/30 pb-2">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Help Center</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Safety Information</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Cancellation Options</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 border-b border-white/30 pb-2">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 border-b border-white/30 pb-2">Newsletter</h3>
              <p className="opacity-80 mb-3">Subscribe to get special offers and travel inspiration.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-tourism-sky w-full"
                />
                <button className="bg-tourism-sunset hover:bg-tourism-coral px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/30">
            <p className="text-center opacity-80 text-sm">
              © 2025 Fantasia Tourism. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
