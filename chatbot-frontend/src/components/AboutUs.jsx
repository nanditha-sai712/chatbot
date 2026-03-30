import React from 'react';
import { Brain, FileText, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function AboutUs() {

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Upload Documents",
      desc: "Upload PDF files and interact with their content easily"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Answers",
      desc: "Get accurate answers using RAG-based AI system"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Fast Processing",
      desc: "Powered by Groq API for quick responses"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full text-center">

          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            About DocuChat AI
          </h1>

          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            DocuChat AI is a RAG-based chatbot that allows users to upload 
            PDF documents and ask questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
              >
                <div className="text-yellow-500 mb-3 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:border-yellow-400 hover:text-yellow-500 transition"
            >
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