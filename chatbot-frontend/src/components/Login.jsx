import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      localStorage.setItem('user', JSON.stringify(data));
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-14 px-4">
        <div className="max-w-md mx-auto animate-fade-up">

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/40 mb-5">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to access your documents and chats</p>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-2xl p-7 md:p-8 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-fuchsia-400 hover:text-fuchsia-300">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-500/30 px-3.5 py-3 rounded-xl">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Button */}
              <button type="submit" disabled={loading}
                className="btn-grad w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <><LogIn className="h-5 w-5" /> Sign In</>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-5 border-t border-white/10">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-fuchsia-400 hover:text-fuchsia-300">Create one</Link>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;
