import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { 
  FileText, 
  Upload, 
  MessageSquare,
  Shield,
  Zap,
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
      description: "Retrieval-Augmented Generation for accurate document-based responses"
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "PDF Document Processing",
      description: "Upload and extract text from PDF documents for intelligent Q&A"
    },
    {
      icon: <Database className="h-10 w-10" />,
      title: "MongoDB Storage",
      description: "User data and document content securely stored in MongoDB database"
    },
    {
      icon: <Cpu className="h-10 w-10" />,
      title: "Groq AI Integration",
      description: "Fast inference using Groq's LLM for intelligent responses"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "User Authentication",
      description: "Secure login and registration system for personalized experience"
    },
    {
      icon: <Code className="h-10 w-10" />,
      title: "Full-Stack Project",
      description: "Built with React frontend and FastAPI backend - complete web application"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: <Upload className="h-8 w-8" />,
      title: "Upload PDF",
      description: "Register/Login and upload your PDF documents"
    },
    {
      number: "02",
      icon: <Brain className="h-8 w-8" />,
      title: "AI Processing",
      description: "Text extraction and processing by RAG system"
    },
    {
      number: "03",
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Chat & Learn",
      description: "Ask questions and get answers from your documents"
    }
  ];

  const techStack = [
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "FastAPI", color: "bg-green-100 text-green-800" },
    { name: "MongoDB", color: "bg-green-100 text-green-800" },
    { name: "Groq AI", color: "bg-purple-100 text-purple-800" },
    { name: "Tailwind CSS", color: "bg-teal-100 text-teal-800" },
    { name: "PyPDF2", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section - Simplified */}
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white border border-blue-200 text-blue-800 px-4 py-2 rounded-full mb-6 shadow-sm">
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">Academic Project - RAG Chatbot</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Document Q&A Chatbot
                <span className="block text-blue-600 mt-2">with RAG Architecture</span>
              </h1>
              
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                A full-stack web application that allows users to upload PDF documents and chat with them using Retrieval-Augmented Generation (RAG) technology.
                Built as an academic project demonstrating modern web development and AI integration.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/login" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Try the Chatbot</span>
                </Link>
                <Link 
                  to="/about" 
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-blue-400 hover:text-blue-600 transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Project Overview</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                This project demonstrates the implementation of a RAG-based document chatbot using modern web technologies
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-600" />
                Key Objectives
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                  Implement RAG architecture for document-based Q&A
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                  Build full-stack web application with user authentication
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                  Integrate Groq AI for fast inference
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                  Demonstrate MongoDB for data persistence
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works - Simplified */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl font-bold text-blue-600 mr-3">{step.number}</div>
                    <div className="text-blue-600">{step.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Academic Focus */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Features</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Modern technologies used in this full-stack project
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {techStack.map((tech, index) => (
                <span 
                  key={index}
                  className={`px-4 py-2 rounded-full font-medium ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
            
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">System Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold mb-1">Frontend</div>
                  <div className="text-gray-300">React + Tailwind CSS</div>
                </div>
                <div>
                  <div className="text-lg font-semibold mb-1">Backend</div>
                  <div className="text-gray-300">FastAPI + MongoDB</div>
                </div>
                <div>
                  <div className="text-lg font-semibold mb-1">AI Layer</div>
                  <div className="text-gray-300">Groq API + RAG</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Demo CTA */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore the Project?</h2>
              <p className="text-gray-700 mb-6">
                This academic project demonstrates the implementation of a RAG-based document chatbot. 
                Register to upload PDFs and experience intelligent document Q&A.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Register & Try Demo
                </Link>
                <Link 
                  to="/login" 
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300"
                >
                  Existing User Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;