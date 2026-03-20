import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-4 py-12">

        {/* Top Section */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600">
            Have questions about DocuChat AI? Send us a message.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

          {/* Email Info */}
          <div className="flex items-center justify-center mb-6 text-purple-600">
            <Mail className="h-5 w-5 mr-2" />
            <span className="font-medium">student@example.com</span>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-gray-700 text-lg">
                Message sent successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {/* Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Your Message"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Home
          </Link>

          <Link
            to="/chat"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go to Chat
          </Link>
        </div>

      </main>
    </div>
  );
}

export default ContactUs;