import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Headphones,
  HelpCircle
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Support",
      details: ["support@docuchatai.com", "sales@docuchatai.com"],
      subtitle: "We typically respond within 2 hours",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Phone Support",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      subtitle: "Mon-Fri, 9AM-6PM EST",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Office Location",
      details: ["123 AI Street", "Tech Valley, CA 94000", "United States"],
      subtitle: "Visit by appointment only",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Business Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"],
      subtitle: "Emergency support available 24/7",
      color: "from-orange-500 to-red-500"
    }
  ];

  const contactCategories = [
    { value: 'general', label: 'General Inquiry', icon: <HelpCircle className="h-5 w-5" /> },
    { value: 'technical', label: 'Technical Support', icon: <Headphones className="h-5 w-5" /> },
    { value: 'sales', label: 'Sales Inquiry', icon: <MessageSquare className="h-5 w-5" /> },
    { value: 'enterprise', label: 'Enterprise Solutions', icon: <Globe className="h-5 w-5" /> },
    { value: 'api', label: 'API & Integration', icon: <Github className="h-5 w-5" /> },
    { value: 'feedback', label: 'Product Feedback', icon: <Send className="h-5 w-5" /> }
  ];

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer: "We aim to respond to all inquiries within 2 business hours. Priority support is available for enterprise customers."
    },
    {
      question: "Do you offer custom RAG implementations?",
      answer: "Yes, we provide custom RAG architecture implementations tailored to your specific document processing needs."
    },
    {
      question: "What's your SLA for enterprise customers?",
      answer: "Enterprise customers receive 99.9% uptime SLA, 24/7 priority support, and dedicated technical account managers."
    },
    {
      question: "How secure is my document data?",
      answer: "All documents are processed with end-to-end encryption, never stored permanently, and comply with SOC 2, GDPR, and HIPAA standards."
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <MessageSquare className="h-5 w-5" />
                <span className="font-semibold">Get in Touch</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Contact
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"> Our Team</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Have questions about our RAG-based document chatbot? Our team is here to help you 
                implement intelligent document solutions for your organization.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  <div className={`h-2 bg-gradient-to-r ${info.color}`}></div>
                  <div className="p-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${info.color} text-white mb-4`}>
                      {info.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                    <div className="space-y-2 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{info.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                      <Send className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                      <p className="text-gray-600">We'll get back to you as soon as possible</p>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for contacting us. Our team will get back to you within 2 business hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Inquiry Category
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {contactCategories.map((category) => (
                            <label
                              key={category.value}
                              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                formData.category === category.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-blue-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="category"
                                value={category.value}
                                checked={formData.category === category.value}
                                onChange={handleChange}
                                className="hidden"
                              />
                              <div className={`p-1 rounded ${
                                formData.category === category.value
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}>
                                {category.icon}
                              </div>
                              <span className="text-sm font-medium">{category.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                          placeholder="Tell us about your document processing needs, RAG implementation questions, or any other inquiries..."
                        />
                      </div>

                      {error && (
                        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                          <AlertCircle className="h-5 w-5" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Sending...</span>
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
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                {/* Social Media */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Twitter className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Twitter</p>
                        <p className="text-sm text-gray-600">@DocuChatAI</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">LinkedIn</p>
                        <p className="text-sm text-gray-600">DocuChat AI</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Github className="h-5 w-5 text-gray-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">GitHub</p>
                        <p className="text-sm text-gray-600">DocuChat-OpenSource</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Facebook className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Facebook</p>
                        <p className="text-sm text-gray-600">DocuChat AI Community</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-medium text-gray-900 mb-1">{faq.question}</h4>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  <a 
                    href="/faq" 
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mt-4"
                  >
                    <span>View all FAQs</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {/* Emergency Support */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Emergency Support</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    For critical issues affecting your document processing, contact our 24/7 emergency support line:
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-bold text-gray-900">+1 (555) 911-4567</p>
                        <p className="text-sm text-gray-600">Available 24/7 for urgent issues</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Visit Our Headquarters</h2>
                <p className="text-blue-200 mb-6">Schedule a visit to discuss your enterprise document AI needs</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-semibold mb-2">Parking Information</h4>
                    <p className="text-sm text-blue-200">Underground parking available. Visitor spots marked.</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-semibold mb-2">Public Transport</h4>
                    <p className="text-sm text-blue-200">10 min walk from Metro Station. Multiple bus routes nearby.</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-semibold mb-2">Visitor Protocol</h4>
                    <p className="text-sm text-blue-200">Please check in at reception. Photo ID required.</p>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-64 md:h-80 bg-gradient-to-br from-blue-800 to-indigo-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70">123 AI Street, Tech Valley, CA 94000</p>
                    <button className="mt-4 px-6 py-2 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter for the latest on RAG technology, Groq updates, 
                and document AI innovations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-6 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                  Subscribe
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;