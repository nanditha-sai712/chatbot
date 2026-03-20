import React from 'react';
import { MessageSquare, FileText, Brain, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-lg">
              <Brain className="h-8 w-8 text-purple-700" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-wide">
                DocuChat <span className="text-pink-200">AI</span>
              </span>
              <p className="text-sm text-purple-200">
                RAG-Powered Document Assistant
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            
            <Link 
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-white/10 font-medium"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/chat" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition font-medium"
            >
              <FileText className="h-5 w-5" />
              <span>Chat</span>
            </Link>
            
            <Link 
              to="/about" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition font-medium"
            >
              <span>About</span>
            </Link>
            
            <Link
              to="/contact" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition font-medium"
            >
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            
            <Link 
              to="/login" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/40 text-white hover:bg-white/10 transition backdrop-blur-sm"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register" 
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:shadow-pink-300 transition font-semibold"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register</span>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;