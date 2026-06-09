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
  Sparkles,
  Database,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

function HomePage() {

  const features = [
    { icon: <Brain className="h-6 w-6" />, title: "RAG Architecture", description: "Accurate, grounded answers retrieved from your own documents." },
    { icon: <FileText className="h-6 w-6" />, title: "Multi-format", description: "Upload PDF, DOCX, PPTX or TXT and chat with the content." },
    { icon: <Database className="h-6 w-6" />, title: "Vector Search", description: "MongoDB Atlas vector search finds the most relevant chunks." },
    { icon: <Cpu className="h-6 w-6" />, title: "Fast AI", description: "Powered by Groq for near-instant responses." },
    { icon: <Shield className="h-6 w-6" />, title: "Secure Auth", description: "Bcrypt-hashed passwords and per-user document isolation." },
    { icon: <Code className="h-6 w-6" />, title: "Full Stack", description: "React + FastAPI, production-ready architecture." }
  ];

  const steps = [
    { number: "01", icon: <Upload className="h-6 w-6" />, title: "Upload", description: "Drop in your document" },
    { number: "02", icon: <Brain className="h-6 w-6" />, title: "Embed", description: "RAG chunks & indexes it" },
    { number: "03", icon: <MessageSquare className="h-6 w-6" />, title: "Ask", description: "Chat with your data" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* HERO */}
        <section className="relative py-24 text-center px-6 overflow-hidden">
          {/* glow orbs */}
          <div className="pointer-events-none absolute -top-20 left-1/4 w-72 h-72 bg-violet-600/30 rounded-full blur-3xl animate-floaty" />
          <div className="pointer-events-none absolute top-10 right-1/4 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl animate-floaty" style={{ animationDelay: "2s" }} />

          <div className="relative max-w-4xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 glass text-fuchsia-200 px-4 py-1.5 rounded-full mb-7 text-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Document Intelligence
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Chat with your
              <span className="block text-gradient mt-2">documents, instantly</span>
            </h1>

            <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
              Upload any document and get accurate, source-grounded answers using
              Retrieval-Augmented Generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/login"
                className="btn-grad px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                Try DocuChat <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/about"
                className="px-7 py-3.5 glass rounded-xl text-slate-200 font-medium hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="text-slate-400 mt-2">Three steps from document to answers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="glass p-6 rounded-2xl hover:bg-white/[0.07] transition group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-gradient">{step.number}</span>
                  <div className="ml-auto w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/30 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-white text-lg">{step.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Built with modern AI</h2>
            <p className="text-slate-400 mt-2">Everything you need, engineered properly</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="glass p-6 rounded-2xl hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 mt-1.5">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="relative max-w-4xl mx-auto glass rounded-3xl p-12 text-center overflow-hidden">
            <div className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-96 h-40 bg-fuchsia-600/25 rounded-full blur-3xl" />
            <h2 className="relative text-3xl font-bold text-white mb-3">
              Ready to try DocuChat?
            </h2>
            <p className="relative text-slate-400 mb-8">
              Create a free account and start chatting with your documents.
            </p>
            <Link
              to="/register"
              className="relative btn-grad inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold"
            >
              Create Account <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
