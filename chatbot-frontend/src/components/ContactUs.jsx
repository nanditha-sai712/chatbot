import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function ContactUs() {

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16">

        <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-slate-400 text-lg">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="max-w-2xl mx-auto glass-strong p-8 rounded-2xl shadow-2xl shadow-black/40">

          <div className="flex justify-center items-center gap-2 text-fuchsia-300 mb-6">
            <Mail className="h-5 w-5" />
            <span className="font-medium">student@example.com</span>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-lg text-slate-200">Message sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className={inputCls} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className={inputCls} />
              <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Your Message" required className={`${inputCls} resize-none`} />
              <button type="submit" disabled={loading} className="btn-grad w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2">
                {loading ? "Sending..." : (<><Send className="h-5 w-5" /> Send Message</>)}
              </button>
            </form>
          )}
        </div>

        <div className="flex gap-4 justify-center mt-10">
          <Link to="/" className="px-6 py-2.5 glass rounded-xl text-slate-200 hover:bg-white/10 transition">Home</Link>
          <Link to="/chat" className="btn-grad px-6 py-2.5 rounded-xl font-semibold">Go to Chat</Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;
