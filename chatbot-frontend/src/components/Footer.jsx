import React from 'react';
import { Shield, FileText, Mail, Phone, MapPin, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ FIXED

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">DocuChat AI</span>
            </div>
            <p className="text-gray-400">
              Advanced RAG-based document chatbot using Groq for hallucination reduction and accurate document analysis.
            </p>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quick Links
            </h3>

            <ul className="space-y-3">

              {/* ✅ href → to */}
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-white">
                  Documentation
                </Link>
              </li>

              <li>
                <Link to="/api" className="text-gray-400 hover:text-white">
                  API Reference
                </Link>
              </li>

              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>

              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>

            </ul>
          </div>


          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Legal
            </h3>

            <ul className="space-y-3">

              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              <li><Link to="/gdpr" className="text-gray-400 hover:text-white">GDPR Compliance</Link></li>

            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Info
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@docuchatai.com</span>
              </li>

              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>

              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>123 AI Street, Tech Valley, CA 94000</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} DocuChat AI. All rights reserved.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
