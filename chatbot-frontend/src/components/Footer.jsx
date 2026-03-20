import React from "react";
import { Brain } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 text-white mt-16">

      {/* Top subtle divider */}
      <div className="h-[1px] bg-white/20"></div>

      <div className="container mx-auto px-6 py-10 flex flex-col items-center text-center gap-4">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Brain className="h-6 w-6 text-purple-700" />
          </div>
          <span className="text-lg font-semibold tracking-wide">
            DocuChat <span className="text-pink-200">AI</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-white/80 text-sm max-w-md">
          Smart document conversations powered by RAG technology. 
          Fast, accurate, and reliable AI responses.
        </p>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-white/30 rounded-full"></div>

        {/* Copyright */}
        <p className="text-xs text-white/70">
          © 2026 DocuChat AI • Built with ❤️ using React & FastAPI
        </p>

      </div>
    </footer>
  );
}

export default Footer;