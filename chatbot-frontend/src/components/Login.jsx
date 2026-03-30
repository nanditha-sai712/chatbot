import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await fetch('https://chatbot-eo65.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data));
      navigate('/chat');

    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">

            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <LogIn className="h-8 w-8 text-yellow-500" />
              </div>

              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                Login to RAG Chatbot
              </h1>

              <p className="text-gray-500">
                Access your documents and start chatting
              </p>
            </div>

            {/* Form */}
            <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8">

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-400 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" />

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-400 outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black py-3 rounded-lg font-medium hover:bg-yellow-300 transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-yellow-500 hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>

              </form>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;