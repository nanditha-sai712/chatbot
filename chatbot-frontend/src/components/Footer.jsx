import React from "react";
import { Brain } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-gray-200 mt-20">
      
      <div className="container mx-auto px-6 py-12 text-center space-y-6">

        {/* Logo */}
        <div className="flex justify-center items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg">
            <Brain className="text-black" />
          </div>
          <span className="text-black font-semibold text-lg">
            DocuChat AI
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-500 max-w-md mx-auto">
          AI-powered chatbot that helps you interact with documents using RAG technology.
        </p>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-yellow-400 mx-auto rounded-full"></div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © 2026 DocuChat AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;