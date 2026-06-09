import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required'); return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const pwLen = formData.password.length;
  const pwStrong = pwLen >= 6;
  const confirmFilled = formData.confirmPassword.length > 0;
  const pwMatch = confirmFilled && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-14 px-4">
        <div className="max-w-md mx-auto animate-fade-up">

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/40 mb-5">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create your account</h1>
            <p className="text-slate-400">Start chatting with your documents in seconds</p>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-2xl p-7 md:p-8 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text" name="username" value={formData.username} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-500/60 focus:ring-4 focus:ring-fuchsia-500/10"
                    placeholder="Create a password"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className={`text-xs mt-1.5 ${pwLen === 0 ? "text-slate-500" : pwStrong ? "text-emerald-400" : "text-amber-400"}`}>
                  {pwLen === 0 ? "Must be at least 6 characters" : pwStrong ? "✓ Looks good" : "Too short — at least 6 characters"}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 outline-none transition focus:ring-4 ${
                      confirmFilled
                        ? pwMatch
                          ? "border-emerald-500/50 focus:border-emerald-500/60 focus:ring-emerald-500/10"
                          : "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                        : "border-white/10 focus:border-fuchsia-500/60 focus:ring-fuchsia-500/10"
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition">
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmFilled && (
                  <p className={`text-xs mt-1.5 ${pwMatch ? "text-emerald-400" : "text-red-400"}`}>
                    {pwMatch ? "✓ Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-500/30 px-3.5 py-3 rounded-xl">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-3 rounded-xl">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Button */}
              <button type="submit" disabled={loading}
                className="btn-grad w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <><UserPlus className="h-5 w-5" /> Create Account</>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-5 border-t border-white/10">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-fuchsia-400 hover:text-fuchsia-300">Sign in</Link>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Register;
