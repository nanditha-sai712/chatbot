import React from 'react';
import { 
  Target, 
  Rocket, 
  Users, 
  Award, 
  Globe, 
  Shield,
  BarChart,
  Heart,
  CheckCircle,
  Clock,
  Zap,
  Cpu,
  Brain,
  FileText,
  MessageSquare
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

function AboutUs() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "AI Research Lead",
      bio: "PhD in NLP, specializes in RAG architectures and hallucination reduction techniques.",
      expertise: "RAG Systems, NLP"
    },
    {
      name: "Sarah Chen",
      role: "Backend Architect",
      bio: "Former Google engineer, built scalable document processing systems for enterprise clients.",
      expertise: "Groq API, Vector DB"
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      bio: "10+ years in AI product management, focused on user experience and product strategy.",
      expertise: "Product Strategy, UX"
    },
    {
      name: "Priya Sharma",
      role: "Frontend Developer",
      bio: "Expert in React and modern UI/UX, passionate about creating intuitive interfaces.",
      expertise: "React, UI/UX"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Concept & Research",
      description: "Started research on hallucination reduction in document chatbots"
    },
    {
      year: "2024 Q1",
      title: "Prototype Development",
      description: "Built first RAG prototype with Groq integration"
    },
    {
      year: "2024 Q2",
      title: "Beta Launch",
      description: "Released beta to 1000+ early adopters"
    },
    {
      year: "2024 Q3",
      title: "Enterprise Launch",
      description: "Launched enterprise version with enhanced security"
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Accuracy First",
      description: "We prioritize reducing hallucinations and providing reliable information"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Innovation Driven",
      description: "Constantly pushing boundaries in AI and document processing"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "User Centric",
      description: "Everything we build is designed with the end-user in mind"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security & Privacy",
      description: "Your documents and data are protected with enterprise-grade security"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { value: "500K+", label: "Documents Processed", icon: <FileText className="h-6 w-6" /> },
    { value: "90%", label: "Hallucination Reduction", icon: <Brain className="h-6 w-6" /> },
    { value: "2M+", label: "AI Conversations", icon: <MessageSquare className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Brain className="h-5 w-5" />
                <span className="font-semibold">About DocuChat AI</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Redefining Document
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"> Intelligence</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                We're on a mission to eliminate AI hallucinations and make document conversations 
                as reliable as human expertise, powered by advanced RAG architecture and Groq's lightning-fast inference.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 text-blue-600 mb-4">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Our Journey</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">From Concept to Innovation</h2>
                <p className="text-gray-600 mb-4">
                  DocuChat AI was born from a simple observation: traditional AI chatbots often provide 
                  inaccurate or "hallucinated" information when processing documents. This led to frustration 
                  and mistrust in AI-powered document analysis.
                </p>
                <p className="text-gray-600 mb-6">
                  We set out to solve this problem by combining Retrieval-Augmented Generation (RAG) 
                  architecture with Groq's powerful Language Processing Units (LPUs). The result is a 
                  document chatbot that's not just fast, but remarkably accurate and reliable.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">90% Less Hallucinations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">Real-time Processing</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Mission</h3>
                <div className="space-y-4">
                  {[
                    "Make document conversations as reliable as consulting a human expert",
                    "Reduce AI hallucinations by 99% across all document types",
                    "Democratize access to intelligent document analysis",
                    "Set new standards for accuracy in AI-powered document processing"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-blue-600 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                    <div className="text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at DocuChat AI
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="text-blue-600 mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Innovation */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Cpu className="h-5 w-5" />
                <span className="font-semibold">Technology Leadership</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-8">Pioneering RAG + Groq Integration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Advanced RAG Architecture
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Multi-stage document processing pipeline",
                      "Intelligent chunking and embedding",
                      "Semantic search with hybrid retrieval",
                      "Context-aware response generation"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Groq LPU Advantages
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Ultra-low latency inference",
                      "Massive parallel processing",
                      "Energy efficient computations",
                      "Scalable architecture"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Passionate experts dedicated to advancing document intelligence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium text-center mb-3">{member.role}</p>
                    <p className="text-gray-600 text-center mb-4">{member.bio}</p>
                    <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {member.expertise}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey Timeline</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Key milestones in our growth and development</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className="w-1/2 px-8">
                      <div className={`bg-white p-6 rounded-xl shadow-lg ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative w-8 h-8 bg-white rounded-full border-4 border-blue-500 flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-xl">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Be part of the revolution in intelligent document processing. 
                Together, we can make AI conversations with documents 100% reliable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/careers" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  View Careers
                </a>
                <a 
                  href="/contact" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                >
                  Partner With Us
                </a>
                <a 
                  href="/demo" 
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors duration-300"
                >
                  Request Enterprise Demo
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;