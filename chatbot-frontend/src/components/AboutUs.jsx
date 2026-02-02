import React from 'react';
import { Brain, Code, Database, Cpu, FileText, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function AboutUs() {
  const projectDetails = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Project Goal",
      description: "Build a RAG-based document chatbot that accurately answers questions from uploaded PDFs"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Full-Stack Implementation",
      description: "Complete web application with React frontend and FastAPI backend"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Storage",
      description: "MongoDB for user data, documents, and chat history storage"
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "AI Integration",
      description: "Groq API for fast inference with RAG architecture"
    }
  ];

  const techStack = [
    { name: "React", description: "Frontend framework" },
    { name: "FastAPI", description: "Backend framework" },
    { name: "MongoDB", description: "Database" },
    { name: "Groq AI", description: "LLM provider" },
    { name: "PyPDF2", description: "PDF text extraction" },
    { name: "Tailwind CSS", description: "Styling" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About RAG Document Chatbot
            </h1>
            <p className="text-lg text-gray-700">
              A student project demonstrating Retrieval-Augmented Generation (RAG) 
              for document-based question answering
            </p>
          </div>

          {/* Project Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                This is an academic project that implements a RAG (Retrieval-Augmented Generation) 
                based document chatbot. The system allows users to upload PDF documents and ask 
                questions about their content.
              </p>
              <p className="mb-4">
                The project demonstrates full-stack web development skills by combining a React 
                frontend with a FastAPI backend, MongoDB database, and Groq AI integration.
              </p>
              <p>
                The main focus is on reducing AI hallucinations by grounding responses in the 
                actual document content through RAG architecture.
              </p>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {projectDetails.map((detail, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="text-blue-600 mb-4">{detail.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{detail.title}</h3>
                <p className="text-gray-700">{detail.description}</p>
              </div>
            ))}
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech, index) => (
                <div 
                  key={index} 
                  className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  <div className="text-lg font-semibold text-blue-800 mb-1">{tech.name}</div>
                  <div className="text-sm text-blue-600">{tech.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 mb-10 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white rounded-lg p-2 mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1. Upload PDF</h3>
                  <p className="text-gray-700">Users upload PDF documents through the web interface</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-lg p-2 mr-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">2. Text Extraction</h3>
                  <p className="text-gray-700">Backend extracts text from PDF and stores it in database</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-lg p-2 mr-4">
                  <Cpu className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">3. AI Processing</h3>
                  <p className="text-gray-700">Groq AI processes questions with document context using RAG</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-lg p-2 mr-4">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4. Response & Storage</h3>
                  <p className="text-gray-700">AI responses are shown to user and stored in database</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Purpose */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Learning Objectives</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                Implement RAG architecture for document-based Q&A
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                Build full-stack application with user authentication
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                Integrate third-party AI APIs (Groq)
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                Implement MongoDB database operations
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                Create responsive React components
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                Deploy and test complete web application
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Try It?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/contact"
                className="border border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;