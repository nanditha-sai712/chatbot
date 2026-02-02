import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle, GraduationCap, Code, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: ["student@example.com"],
      subtitle: "For project-related questions"
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      title: "Academic",
      details: ["Computer Science Project"],
      subtitle: "Student academic project"
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Technical",
      details: ["RAG Chatbot Implementation"],
      subtitle: "Full-stack development demo"
    }
  ];

  const faqs = [
    {
      question: "What is this project about?",
      answer: "A student project demonstrating RAG-based document chatbot using Groq AI and FastAPI backend."
    },
    {
      question: "Can I use this for my own documents?",
      answer: "Yes, you can register and upload PDFs to chat with them. All data is stored locally for demo purposes."
    },
    {
      question: "What technologies are used?",
      answer: "React frontend, FastAPI backend, MongoDB database, Groq AI API, and PyPDF2 for text extraction."
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact & Support
            </h1>
            <p className="text-lg text-gray-700">
              Have questions about the RAG Chatbot project? Get in touch or explore the documentation.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <div className="text-blue-600">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {info.title}
                  </h3>
                </div>
                <div className="space-y-2 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-500 text-sm">
                  {info.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Send a Message
                </h2>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your message. This is a demo form - in a real application, 
                    this would send an email to the project maintainer.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                      placeholder="Tell us about your experience with the RAG chatbot or ask a technical question..."
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* FAQ Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Resources */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Project Resources
                  </h3>
                </div>
                <div className="space-y-4">
                  <Link 
                    to="/chat" 
                    className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      Try the Chatbot
                    </div>
                    <div className="text-gray-600 text-sm">
                      Upload PDFs and ask questions
                    </div>
                  </Link>
                  
                  <Link 
                    to="/about" 
                    className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      About the Project
                    </div>
                    <div className="text-gray-600 text-sm">
                      Learn about RAG architecture
                    </div>
                  </Link>
                  
                  <a 
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      Source Code
                    </div>
                    <div className="text-gray-600 text-sm">
                      View on GitHub
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-10 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Note</h3>
            <p className="text-gray-700">
              This is a <span className="font-semibold">student academic project</span> designed to demonstrate 
              full-stack development skills with RAG architecture. The contact form is a demo and 
              doesn't send actual emails. For real inquiries about the technology, please refer to 
              the project documentation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Chat Interface
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;