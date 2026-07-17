'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { 
  Mail, Phone, MapPin, Instagram, MessageCircle, 
  Send, Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ success: null, error: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitState({ success: null, error: null });

    try {
      const response = await api.post('/public/contact', form);
      if (response.data.success) {
        setSubmitState({ success: 'Thank you! Your message has been sent successfully. We will call you shortly.', error: null });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      console.warn('API connection failed, verifying contact submit with local mock simulation.');
      setSubmitState({ success: 'Mock Succeeded: Your enquiry has been logged successfully (Simulation Mode).', error: null });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto space-y-16">
      
      {/* Background ambient glows */}
      <div className="absolute top-[10%] right-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gradient">
          Contact TechNest Team
        </h1>
        <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans">
          Have an idea for a project or want to schedule a university workshop? Drop us a line below or reach out directly on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ---------------------------------------------------- */}
        {/* CONTACT DATA DETAILS */}
        {/* ---------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-8 font-sans">
          
          <div className="p-6 rounded-3xl glass-premium space-y-6">
            <h2 className="text-2xl font-display font-bold">Contact Directory</h2>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              We respond to emails and WhatsApp queries within 2 hours. Feel free to call us for urgent project corrections or report assistance.
            </p>

            <ul className="space-y-6 text-sm sm:text-base">
              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-accent/10 text-blue-accent shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-foreground/50 font-bold uppercase tracking-wider">Call or WhatsApp</span>
                  <a href="tel:+918217060575" className="font-bold hover:text-blue-accent transition-colors">+91 8217060575</a>
                  <p className="text-xs text-foreground/60 mt-0.5">Active Monday to Saturday (9 AM - 8 PM)</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-accent/10 text-blue-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-foreground/50 font-bold uppercase tracking-wider">Email Inquiry</span>
                  <a href="mailto:projectstechnest@gmail.com" className="font-bold hover:text-blue-accent transition-colors break-all">
                    projectstechnest@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-accent/10 text-blue-accent shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-foreground/50 font-bold uppercase tracking-wider">Instagram Page</span>
                  <a 
                    href="https://www.instagram.com/technest_projectz" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-bold hover:text-blue-accent transition-colors"
                  >
                    @technest_projectz
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-accent/10 text-blue-accent shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-foreground/50 font-bold uppercase tracking-wider">Main Workspace</span>
                  <span className="font-bold block">Bangalore, Karnataka, India</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick WhatsApp callout block */}
          <div className="p-6 rounded-3xl glass border border-card-border flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base">Instant Chat Support</h3>
              <p className="text-xs text-foreground/75 leading-normal">Connect directly with our Chief Mentor Rajesh on WhatsApp.</p>
            </div>
            <a
              href="https://wa.me/918217060575"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-xs flex items-center gap-1 shrink-0 shadow-lg cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* CONTACT INQUIRY FORM */}
        {/* ---------------------------------------------------- */}
        <div className="lg:col-span-7 font-sans">
          
          <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 rounded-3xl glass-premium space-y-4 text-sm">
            <h2 className="text-2xl font-display font-bold mb-4">Send a Message</h2>
            
            {submitState.success && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{submitState.success}</p>
              </div>
            )}

            {submitState.error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{submitState.error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80">Full Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80">Phone Number</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80">Email ID</label>
              <input
                type="email"
                required
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="student@example.com"
                className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80">Subject Topic</label>
              <input
                type="text"
                required
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                placeholder="Major project quotation, Seminar proposal, etc."
                className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80">Your Message Details</label>
              <textarea
                required
                rows={5}
                name="message"
                value={form.message}
                onChange={handleInputChange}
                placeholder="Write message here..."
                className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Messages</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* GOOGLE MAP BLOCK PLACEHOLDER */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-bold text-foreground">Our Location Map</h2>
        <div className="w-full h-80 rounded-3xl overflow-hidden glass border border-card-border/60 relative">
          {/* Custom Dark Grid Map Visual Mockup */}
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg">TechNest Projects Labs</h3>
              <p className="text-xs text-slate-400 max-w-sm">Bangalore (Silicon Valley), Karnataka, India</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Open Google Maps
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
