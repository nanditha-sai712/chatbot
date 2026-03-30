import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { 
  FileText, 
  Upload, 
  MessageSquare,
  Shield,
  Brain,
  Code,
  GraduationCap,
  Database,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

function HomePage() {

  const features = [
    {
      icon: <Brain className="h-10 w-10" />,
      title: "RAG Architecture",
      description: "Accurate document-based answers using AI"
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "PDF Processing",
      description: "Upload & extract text from PDFs"
    },
    {
      icon: <Database className="h-10 w-10" />,
      title: "MongoDB Storage",
      description: "Secure document & user data storage"
    },
    {
      icon: <Cpu className="h-10 w-10" />,
      title: "Fast AI",
      description: "Powered by Groq for quick responses"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Authentication",
      description: "Secure login & user system"
    },
    {
      icon: <Code className="h-10 w-10" />,
      title: "Full Stack",
      description: "React + FastAPI complete project"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: <Upload className="h-8 w-8" />,
      title: "Upload PDF",
      description: "Upload your document"
    },
    {
      number: "02",
      icon: <Brain className="h-8 w-8" />,
      title: "AI Processing",
      description: "RAG processes content"
    },
    {
      number: "03",
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Ask Questions",
      description: "Chat with your data"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main>

        {/* HERO */}
        <section className="py-20 text-center px-6">
          <div className="max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              Academic Project - RAG Chatbot
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A]">
              AI-Powered Chatbot
              <span className="block text-black-500 mt-2">
                For Document Q&A
              </span>
            </h1>

            <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
              Upload PDFs, ask questions, and get accurate answers instantly using AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                to="/login"
                className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300"
              >
                Try Chatbot
              </Link>

              <Link 
                to="/about"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:border-yellow-400 hover:text-yellow-500"
              >
                Learn More
              </Link>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0F172A]">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6">
            {steps.map((step, index) => (
              <div key={index} className="bg-[#F8FAFC] p-6 rounded-xl border">
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 font-bold mr-2">{step.number}</span>
                  <div className="text-yellow-500">{step.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Technical Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border hover:shadow-md transition">
                <div className="text-yellow-500 mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-xl font-semibold mb-3">
            Ready to try DocuChat?
          </h2>

          <Link 
            to="/register"
            className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300"
          >
            Create Account
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default HomePage;