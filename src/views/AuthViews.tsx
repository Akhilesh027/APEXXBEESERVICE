import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Mail, User, Phone, Briefcase, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';
import { GlassCard } from '../components/GlassCard';

interface AuthViewsProps {
  onLogin: (isCompany: boolean) => void;
}

export const Login: React.FC<AuthViewsProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://server.apexbee.in/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await res.json();
      const token = data.token;
      const user = data.user;

      const permittedRoles = ['service_provider', 'admin'];
      const hasRole = user.roles?.some((r: string) => permittedRoles.includes(r.toLowerCase()));
      if (!hasRole) {
        throw new Error('Access Denied: You do not have an active Service Provider profile.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Determine if company or individual based on gst or business type
      const isCompanyMode = !!user.sellerProfile?.gstNumber || email.includes('company') || email.includes('amit');
      onLogin(isCompanyMode);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden py-10 bg-slate-950">
      {/* Decorative cybernetic blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2.5 bg-brand-600 rounded-2xl glow-indigo text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-3xl font-black tracking-wider text-white">
              Apex<span className="text-brand-400">Bee</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">Service Provider Control Portal</p>
        </div>

        <GlassCard hoverEffect={false} className="border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl relative">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}
            
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="dark"
            />

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="dark"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
                Forgot Password?
              </a>
            </div>

            <CustomButton type="submit" variant="primary" className="w-full mt-2 py-3">
              <KeyRound className="w-4 h-4" /> Sign In
            </CustomButton>
          </form>



          <div className="mt-8 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-brand-400 font-bold cursor-pointer hover:underline"
            >
              Create Account
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isCompany, setIsCompany] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    gst: '',
    city: 'Mumbai',
    category: 'Home Services'
  });
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <GlassCard className="border-slate-800 bg-slate-900/60 p-8 text-center text-white">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Registration Submitted!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your details are submitted to the ApexBee KYC system. We will verify your credentials within 24-48 business hours.
            </p>
            <CustomButton onClick={() => navigate('/login')} className="w-full">
              Proceed to Login
            </CustomButton>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-10 bg-slate-950">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="p-2 bg-brand-600 rounded-xl text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              Apex<span className="text-brand-400">Bee</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs">Join our service network across India</p>
        </div>

        <GlassCard hoverEffect={false} className="border-slate-800/80 bg-slate-900/60 p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Register New Account</h2>

          {/* Type Toggle */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 mb-6">
            <button
              type="button"
              onClick={() => setIsCompany(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                !isCompany ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👨 Individual Provider
            </button>
            <button
              type="button"
              onClick={() => setIsCompany(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                isCompany ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏢 Company / Agency
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={isCompany ? "Contact Person Name" : "Full Name"}
                placeholder="Rajesh Kumar"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark"
              />
              <InputField
                label="Phone Number"
                type="tel"
                placeholder="+91 99887 76655"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="dark"
              />
            </div>

            <InputField
              label="Email Address"
              type="email"
              placeholder="rajesh@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="dark"
            />

            {isCompany && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Name"
                  placeholder="Amit AC Services Pvt Ltd"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="dark"
                />
                <InputField
                  label="GSTIN Number (Optional)"
                  placeholder="27AAAAA1111A1Z1"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  className="dark"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-slate-350">Service Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="glass-input dark select-field bg-slate-900 border-slate-800 text-white"
                >
                  <option value="Home Services">🔧 Home Services (AC/Electric/Plumber)</option>
                  <option value="Vehicle Services">🚗 Vehicle Services</option>
                  <option value="Digital Services">💻 Digital Services</option>
                  <option value="Professional Services">📈 Professional Services</option>
                  <option value="Education Services">🎓 Education Services</option>
                  <option value="Event Services">📸 Event Services</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-slate-350">Operating City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="glass-input dark select-field bg-slate-900 border-slate-800 text-white"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="dark"
            />

            <div className="text-xs text-slate-400 flex items-start gap-2 pt-2">
              <input type="checkbox" required className="mt-0.5 accent-brand-500 rounded" />
              <span>
                I agree to the ApexBee Provider Partnership Agreement and consent to KYC checks under Government of India guidelines.
              </span>
            </div>

            <CustomButton type="submit" variant="primary" className="w-full mt-2 py-3">
              Create Partner Profile
            </CustomButton>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-brand-400 font-bold cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
