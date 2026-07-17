'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { Mail, KeyRound, ArrowRight, Loader2, AlertCircle, Shield, User } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login, user, error, setError } = useAuth();
  
  const [activeTab, setActiveTab] = useState('student'); // student or admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Clear errors on tab switch
  useEffect(() => {
    setError(null);
  }, [activeTab]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await login(email, password, activeTab);
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleAutofill = (type) => {
    if (type === 'admin') {
      setEmail('admin@technestprojects.com');
      setPassword('Admin@123');
      setActiveTab('admin');
    } else {
      setEmail('student@technest.com');
      setPassword('Student@123');
      setActiveTab('student');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 font-sans">
      
      {/* Background glow animations */}
      <div className="absolute top-[10%] left-[-10%] w-80 h-80 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* Main Glass Login Card */}
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-premium space-y-6 animate-scale-up shadow-2xl relative overflow-hidden">
        
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo showText={true} />
          <p className="text-xs text-foreground/60 tracking-wider">Access academic systems</p>
        </div>

        {/* Tab triggers */}
        <div className="grid grid-cols-2 p-1 rounded-2xl glass border border-card-border">
          <button
            onClick={() => setActiveTab('student')}
            className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'student'
                ? 'bg-blue-accent text-white blue-gradient shadow-md'
                : 'text-foreground/75 hover:text-foreground hover:bg-card-border/20'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-blue-accent text-white blue-gradient shadow-md'
                : 'text-foreground/75 hover:text-foreground hover:bg-card-border/20'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-accent" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'admin' ? 'admin@technestprojects.com' : 'student@technest.com'}
              className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-blue-accent" />
              <span>Security Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Secure Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials quick login */}
        <div className="border-t border-card-border/60 pt-4 text-center space-y-3 font-sans">
          <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block">
            Demo Credentials Autofill
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleAutofill('student')}
              className="px-3 py-1.5 rounded-lg border border-card-border hover:border-blue-accent/40 text-[10px] font-bold glass cursor-pointer text-foreground/75"
            >
              Autofill Student (Demo)
            </button>
            <button
              onClick={() => handleAutofill('admin')}
              className="px-3 py-1.5 rounded-lg border border-card-border hover:border-blue-accent/40 text-[10px] font-bold glass cursor-pointer text-foreground/75"
            >
              Autofill Admin (Demo)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
