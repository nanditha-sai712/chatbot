import React from 'react';
import { Brain, FileText, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function AboutUs() {

  const features = [
    { icon: <FileText className="h-6 w-6" />, title: "Upload Documents", desc: "Upload PDF, DOCX, PPTX or TXT and interact with their content." },
    { icon: <Brain className="h-6 w-6" />, title: "Smart Answers", desc: "Accurate, grounded answers using a RAG-based AI pipeline." },
    { icon: <Cpu className="h-6 w-6" />, title: "Fast Processing", desc: "Powered by Groq for near-instant responses." }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full text-center animate-fade-up">

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            About <span className="text-gradient">DocuChat AI</span>
          </h1>

          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg">
            DocuChat AI is a RAG-based chatbot that lets you upload documents and ask
            questions — getting answers grounded in your own content, not guesswork.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((item, index) => (
              <div key={index} className="glass p-6 rounded-2xl hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/30">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-grad inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="px-7 py-3.5 glass rounded-xl text-slate-200 font-medium hover:bg-white/10 transition">
              Login
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
