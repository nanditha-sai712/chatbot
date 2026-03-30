import React from 'react';
import { Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/chat" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg">
            <Brain className="text-black" />
          </div>
          <h1 className="font-bold text-lg text-black">
            DocuChat AI
          </h1>
        </div>

        {/* Nav */}
        <div className="hidden md:flex items-center gap-3">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  location.pathname === link.path
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
            >
              {link.name}
            </Link>
          ))}

        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          
          <Link 
            to="/login" 
            className="px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
          >
            Login
          </Link>

          <Link 
            to="/register"
            className="bg-yellow-400 px-4 py-2 rounded-lg text-black font-medium hover:bg-yellow-300 transition"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Header;