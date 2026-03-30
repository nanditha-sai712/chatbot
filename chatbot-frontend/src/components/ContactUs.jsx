import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16">

        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-3">
            Contact Us
          </h1>
          <p className="text-gray-500">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">

          <div className="flex justify-center items-center gap-2 text-yellow-500 mb-6">
            <Mail className="h-5 w-5" />
            <span className="font-medium">student@example.com</span>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg text-gray-700">Message sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-400 outline-none"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-400 outline-none"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Your Message"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-400 outline-none resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-yellow-400 text-black flex justify-center items-center gap-2 hover:bg-yellow-300 transition"
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

        <div className="flex gap-4 justify-center mt-10">
          <Link
            to="/"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Home
          </Link>

          <Link
            to="/chat"
            className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition"
          >
            Go to Chat
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;