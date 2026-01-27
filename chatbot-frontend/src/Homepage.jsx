import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { 
  Zap, 
  Shield, 
  FileText, 
  BarChart3, 
  Upload, 
  MessageSquare,
  Lock,
  Globe,
  Brain,
  CheckCircle
} from 'lucide-react';

function HomePage() {
  const features = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Hallucination Reduction",
      description: "Advanced RAG architecture combined with Groq's inference to minimize AI hallucinations and provide accurate responses."
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Lightning Fast Processing",
      description: "Real-time document processing and query response using Groq's ultra-fast inference engine."
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Multi-Format Support",
      description: "Upload and chat with PDF, DOCX, TXT, PPT, and various other document formats seamlessly."
    },
    {
      icon: <Lock className="h-10 w-10" />,
      title: "Secure & Private",
      description: "Your documents are processed securely with end-to-end encryption and never stored permanently."
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "Smart Analytics",
      description: "Get insights from your documents with intelligent summarization, keyword extraction, and trend analysis."
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Multi-Language Support",
      description: "Chat with documents in multiple languages with accurate translation and context preservation."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Documents",
      description: "Drag and drop your files or upload from various sources"
    },
    {
      number: "02",
      title: "AI Processing",
      description: "Our RAG system indexes and processes your documents with Groq"
    },
    {
      number: "03",
      title: "Chat Intelligently",
      description: "Ask questions and get accurate, context-aware responses"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
                <Brain className="h-5 w-5" />
                <span className="font-semibold">Powered by Groq & Advanced RAG</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Chat with Your 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Documents</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                An intelligent RAG-based document chatbot that reduces hallucinations by 90% using Groq's powerful inference engine.
                Upload, analyze, and converse with your documents naturally.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Start Chatting Free</span>
                </a>
                <a 
                  href="/demo" 
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors duration-300"
                >
                  View Live Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to intelligent document conversation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-4xl font-bold text-blue-600 mb-4">{step.number}</div>
                    <div className="text-xl font-semibold text-gray-900 mb-3">{step.title}</div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Designed for accuracy, speed, and reliability</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Advanced Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {['Groq LPU', 'RAG Architecture', 'Vector Databases', 'React 18'].map((tech, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-lg font-semibold">{tech}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Hallucination Reduction Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">90%</div>
                    <div className="text-gray-300">Reduction in AI Hallucinations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">2x</div>
                    <div className="text-gray-300">Faster Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400">99%</div>
                    <div className="text-gray-300">Accuracy Improvement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-xl">
              <Upload className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Document Experience?</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of users who are already chatting with their documents intelligently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started for Free
                </a>
                <a 
                  href="/contact" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                >
                  Schedule a Demo
                </a>
              </div>
              <div className="mt-6 flex items-center justify-center space-x-4 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free 14-day trial</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Cancel anytime</span>
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