import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Shield,
  Building,
  User,
  Smartphone,
  Briefcase,
  Globe,
  Calendar,
  Upload
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    phone: '',
    country: '',
    acceptTerms: false,
    newsletter: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Basic info, 2: Professional info, 3: Account type
  const [passwordStrength, setPasswordStrength] = useState(0);

  const accountTypes = [
    {
      type: 'personal',
      title: 'Personal',
      icon: <User className="h-8 w-8" />,
      price: 'Free',
      features: [
        'Up to 100 documents/month',
        'Basic RAG chatbot',
        '10MB max file size',
        'Standard support',
        '7-day chat history'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'professional',
      title: 'Professional',
      icon: <Briefcase className="h-8 w-8" />,
      price: '$29/month',
      features: [
        'Unlimited documents',
        'Advanced RAG with Groq',
        '100MB max file size',
        'Priority support',
        '30-day chat history',
        'API access'
      ],
      color: 'from-purple-500 to-pink-500',
      recommended: true
    },
    {
      type: 'enterprise',
      title: 'Enterprise',
      icon: <Building className="h-8 w-8" />,
      price: 'Custom',
      features: [
        'Custom document limits',
        'Dedicated RAG models',
        'Unlimited file size',
        '24/7 enterprise support',
        'Unlimited chat history',
        'Custom integrations',
        'SLA guarantee'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Japan', 'India', 'Singapore', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName) {
      setError('Please enter your first and last name');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setError('');
    
    if (step === 1 && !validateStep1()) {
      return;
    }
    
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      setSuccess('Registration successful! Redirecting to verification...');
      
      setTimeout(() => {
        window.location.href = '/verify-email';
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'No password';
      case 1: return 'Very weak';
      case 2: return 'Weak';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="John"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

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
            placeholder="john.doe@company.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
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
            placeholder="Create a strong password"
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
        
        {/* Password Strength Meter */}
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Password strength</span>
            <span className={`text-sm font-medium ${
              passwordStrength === 0 ? 'text-gray-400' :
              passwordStrength === 1 ? 'text-red-500' :
              passwordStrength === 2 ? 'text-yellow-500' :
              passwordStrength === 3 ? 'text-blue-500' : 'text-green-500'
            }`}>
              {getPasswordStrengthText()}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
              style={{ width: `${passwordStrength * 25}%` }}
            ></div>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li className={`flex items-center space-x-2 ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
              <CheckCircle className="h-4 w-4" />
              <span>At least 8 characters</span>
            </li>
            <li className={`flex items-center space-x-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
              <CheckCircle className="h-4 w-4" />
              <span>One uppercase letter</span>
            </li>
            <li className={`flex items-center space-x-2 ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
              <CheckCircle className="h-4 w-4" />
              <span>One number</span>
            </li>
            <li className={`flex items-center space-x-2 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
              <CheckCircle className="h-4 w-4" />
              <span>One special character</span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
            . I understand that my data will be processed according to these policies.
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
            I want to receive updates about new features, RAG technology advancements, 
            and special offers from DocuChat AI.
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company/Organization
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            placeholder="Your company name (optional)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            placeholder="Your role (optional)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Smartphone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white appearance-none"
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Account Type</h3>
      <p className="text-gray-600 mb-6">Select the plan that best fits your document processing needs</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountTypes.map((account) => (
          <div 
            key={account.type}
            className={`relative rounded-xl border-2 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer ${
              formData.accountType === account.type 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, accountType: account.type }))}
          >
            {account.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${account.color} text-white mb-4`}>
              {account.icon}
            </div>
            
            <h4 className="text-xl font-bold text-gray-900 mb-2">{account.title}</h4>
            <div className="text-3xl font-bold text-gray-900 mb-4">{account.price}</div>
            
            <ul className="space-y-3 mb-6">
              {account.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className={`text-center py-3 rounded-lg font-semibold ${
              formData.accountType === account.type
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {formData.accountType === account.type ? 'Selected' : 'Select Plan'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
                <UserPlus className="h-5 w-5" />
                <span className="font-semibold">Join DocuChat AI</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Create Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Account</span>
              </h1>
              
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Start chatting with your documents intelligently using our RAG-powered chatbot with Groq integration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Registration Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
                      <span className="text-sm font-medium text-blue-600">{step * 33}% Complete</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${step * 33}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                        1. Basic Info
                      </span>
                      <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                        2. Professional Info
                      </span>
                      <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                        3. Account Type
                      </span>
                    </div>
                  </div>

                  <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
                    {/* Step Content */}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    {/* Error/Success Messages */}
                    {error && (
                      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg my-6">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg my-6">
                        <CheckCircle className="h-5 w-5" />
                        <span>{success}</span>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                        >
                          ← Previous
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>{step === 3 ? 'Creating Account...' : 'Next Step'}</span>
                          </>
                        ) : (
                          <>
                            {step === 3 ? (
                              <>
                                <UserPlus className="h-5 w-5" />
                                <span>Create Account</span>
                              </>
                            ) : (
                              <>
                                <span>Next Step</span>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </>
                            )}
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center pt-6 mt-6 border-t border-gray-200">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link 
                          to="/login" 
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Login here
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Benefits */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits of Joining</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Shield className="h-5 w-5" />, text: '90% reduction in AI hallucinations' },
                      { icon: <Upload className="h-5 w-5" />, text: 'Upload and chat with any document format' },
                      { icon: <Globe className="h-5 w-5" />, text: 'Multi-language document support' },
                      { icon: <Calendar className="h-5 w-5" />, text: 'Access your chat history anytime' },
                      { icon: <Briefcase className="h-5 w-5" />, text: 'Export conversations and insights' }
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <div className="text-blue-600">{benefit.icon}</div>
                        </div>
                        <span className="text-gray-700">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted By</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="font-bold text-gray-900">10,000+</div>
                      <div className="text-sm text-gray-600">Users</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="font-bold text-gray-900">500K+</div>
                      <div className="text-sm text-gray-600">Documents</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="font-bold text-gray-900">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="font-bold text-gray-900">256-bit</div>
                      <div className="text-sm text-gray-600">Encryption</div>
                    </div>
                  </div>
                </div>

                {/* Free Trial */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">14-Day Free Trial</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    All Professional plan features available for 14 days. No credit card required.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Full access to all features</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Cancel anytime</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No hidden fees</span>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <a 
                      href="/demo" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Watch Demo Video</span>
                    </a>
                    <a 
                      href="/contact" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Contact Sales</span>
                    </a>
                    <a 
                      href="/enterprise" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Building className="h-5 w-5" />
                      <span>Enterprise Solutions</span>
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

export default Register;