import React from 'react';
import { Brain, FileText, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';


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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About DocuChat AI
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-10">
            DocuChat AI is a simple RAG-based chatbot that allows users to upload 
            PDF documents and ask questions. It provides accurate answers based 
            on document content using modern AI technologies.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="text-purple-600 mb-3 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>

        </div>
      </main>

     
    </div>
  );
}

export default AboutUs;