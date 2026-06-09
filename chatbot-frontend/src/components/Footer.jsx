import React from "react";
import { Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12 text-center space-y-5">

        {/* Logo */}
        <div className="flex justify-center items-center gap-2.5">
          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-lg shadow-fuchsia-600/40">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-white">
            DocuChat <span className="text-gradient">AI</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 max-w-md mx-auto">
          AI-powered chatbot that helps you interact with documents using RAG technology.
        </p>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mx-auto"></div>

        {/* Copyright */}
        <p className="text-sm text-slate-500">
          © 2026 DocuChat AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
