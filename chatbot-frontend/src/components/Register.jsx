import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

function Register() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://chatbot-eo65.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.message || 'Registration failed');
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
                <UserPlus className="h-8 w-8 text-yellow-500" />
              </div>

              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                Create Account
              </h1>

              <p className="text-gray-500">
                Register to start using the RAG Chatbot
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Username */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 outline-none"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 outline-none"
                      placeholder="Enter password"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 outline-none"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black py-3 rounded-lg font-medium hover:bg-yellow-300 transition flex items-center justify-center gap-2"
                >
                  {loading ? "Creating..." : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Register
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-yellow-500 hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>

              </form>

              {/* Note */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Note:</span> Connected to FastAPI backend
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;