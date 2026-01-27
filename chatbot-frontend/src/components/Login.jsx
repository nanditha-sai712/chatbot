import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Key,
  User,
  Smartphone,
  Globe,
  Cpu
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const loginMethods = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email & Password",
      description: "Traditional login with your credentials"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      label: "Google Authenticator",
      description: "Use 2FA app for enhanced security"
    },
    {
      icon: <Key className="h-5 w-5" />,
      label: "Single Sign-On",
      description: "Login with your organization account"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bank-level Security",
      description: "256-bit encryption and secure token storage"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Fast Access",
      description: "Login in under 2 seconds to start chatting"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Access",
      description: "Access your documents from anywhere"
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for demo credentials
      if (formData.email === 'demo@docuchatai.com' && formData.password === 'demo123') {
        setSuccess('Demo login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/chat';
        }, 2000);
      } else if (formData.email === 'admin@docuchatai.com') {
        setTwoFactorEnabled(true);
        setSuccess('Please enter your 2FA code');
      } else {
        setError('Invalid credentials. Try demo@docuchatai.com / demo123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (twoFactorCode === '123456') { // Demo 2FA code
        setSuccess('2FA verified! Redirecting...');
        setTimeout(() => {
          window.location.href = '/chat';
        }, 1500);
      } else {
        setError('Invalid 2FA code. Try 123456 for demo');
      }
    } catch (err) {
      setError('2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setSuccess(`Redirecting to ${provider} login...`);
    setTimeout(() => {
      window.location.href = '/chat';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
                <Lock className="h-5 w-5" />
                <span className="font-semibold">Secure Login</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome Back to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> DocuChat AI</span>
              </h1>
              
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Login to access your documents and continue intelligent conversations 
                with our RAG-powered chatbot
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Login Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {twoFactorEnabled ? (
                    // 2FA Form
                    <div>
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
                          <p className="text-gray-600">Enter the code from your authenticator app</p>
                        </div>
                      </div>

                      <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            6-digit Verification Code
                          </label>
                          <div className="flex space-x-4">
                            {[...Array(6)].map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-16 h-16 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                onChange={(e) => {
                                  const newCode = twoFactorCode.split('');
                                  newCode[index] = e.target.value;
                                  setTwoFactorCode(newCode.join(''));
                                  
                                  // Auto-focus next input
                                  if (e.target.value && index < 5) {
                                    document.getElementById(`2fa-${index + 1}`).focus();
                                  }
                                }}
                                id={`2fa-${index}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Demo code: <span className="font-mono font-bold">123456</span>
                          </p>
                        </div>

                        {error && (
                          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {success && (
                          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                            <span>{success}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading || twoFactorCode.length !== 6}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              <span>Verify & Login</span>
                            </>
                          )}
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setTwoFactorEnabled(false)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            ← Back to email login
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Regular Login Form
                    <>
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                          <LogIn className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
                          <p className="text-gray-600">Access your documents and chat history</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {loginMethods.map((method, index) => (
                          <div 
                            key={index} 
                            className="border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => index === 0 ? null : index === 1 ? setTwoFactorEnabled(true) : handleSocialLogin('SSO')}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`p-2 rounded-lg ${
                                index === 0 ? 'bg-blue-100 text-blue-600' :
                                index === 1 ? 'bg-green-100 text-green-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                {method.icon}
                              </div>
                              <span className="font-semibold text-gray-900">{method.label}</span>
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="you@company.com"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Demo: <span className="font-mono">demo@docuchatai.com</span>
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Password *
                            </label>
                            <Link 
                              to="/forgot-password" 
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Demo: <span className="font-mono">demo123</span>
                          </p>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Remember me on this device
                          </label>
                        </div>

                        {error && (
                          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {success && (
                          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                            <span>{success}</span>
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
                              <span>Logging in...</span>
                            </>
                          ) : (
                            <>
                              <LogIn className="h-5 w-5" />
                              <span>Login to DocuChat</span>
                            </>
                          )}
                        </button>

                        <div className="relative my-8">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200"
                          >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="font-medium text-gray-700">Google</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('GitHub')}
                            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-gray-800 hover:shadow-md transition-all duration-200"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span className="font-medium text-gray-700">GitHub</span>
                          </button>
                        </div>

                        <div className="text-center pt-6 border-t border-gray-200">
                          <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link 
                              to="/register" 
                              className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                              Create Account
                            </Link>
                          </p>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Features & Demo Section */}
              <div className="space-y-8">
                {/* Features */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Login?</h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <div className="text-blue-600">{feature.icon}</div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Account */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Try Demo Account</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Want to explore without registering? Use our demo account to test all features:
                  </p>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-mono font-semibold">demo@docuchatai.com</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Password</div>
                      <div className="font-mono font-semibold">demo123</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFormData({
                        email: 'demo@docuchatai.com',
                        password: 'demo123',
                        rememberMe: false
                      });
                    }}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                  >
                    Auto-fill Demo Credentials
                  </button>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Security First</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>All logins are encrypted with TLS 1.3</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>2FA recommended for all accounts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>No passwords stored in plain text</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Session timeout after 30 minutes</span>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <Link 
                      to="/forgot-password" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Key className="h-5 w-5" />
                      <span>Reset Password</span>
                    </Link>
                    <Link 
                      to="/contact" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Contact Support</span>
                    </Link>
                    <a 
                      href="/security" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Shield className="h-5 w-5" />
                      <span>Security FAQ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;