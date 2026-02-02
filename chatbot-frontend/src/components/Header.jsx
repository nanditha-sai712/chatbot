import React from 'react';
import { MessageSquare, FileText, Brain, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-lg">
              <Brain className="h-8 w-8 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DocuChat AI</h1>
              <p className="text-sm text-blue-200">RAG-Powered Document Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
           <Link to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 bg-blue-800"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/chat" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              <FileText className="h-5 w-5" />
              <span>Chat</span>
            </Link>
            
            <Link 
              to="/about" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              <span>About</span>
            </Link>
            
            <Link
              to="/contact" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link 
              to="/login" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-blue-900 transition-colors duration-200"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-blue-900 hover:bg-blue-100 transition-colors duration-200 font-semibold"
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