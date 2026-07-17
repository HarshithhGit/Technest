'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User, Phone, Mail, BookOpen, GraduationCap,
  Layers, Upload, Send, CheckCircle2, AlertCircle, Loader2, KeyRound
} from 'lucide-react';

const WORKSHOP_OPTIONS = [
  'Project Development',
  'PPt Presentation and Design',
  'Project Documentation and Final Report',
];


function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, error, setError } = useAuth();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    semester: '1st Semester',
    projectInterest: '',
    message: ''
  });

  const [selectedWorkshops, setSelectedWorkshops] = useState([]);

  const [resumeFile, setResumeFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-fill fields from URL query params
  useEffect(() => {
    setError(null);
    const interest = searchParams.get('interest');
    const workshop = searchParams.get('workshop');


    if (interest) {
      setForm(prev => ({ ...prev, projectInterest: interest }));
    }
    if (workshop && WORKSHOP_OPTIONS.includes(workshop)) {
      setSelectedWorkshops([workshop]);
    }

  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (option) => {
    setSelectedWorkshops(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    // Append standard fields
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    // Append arrays as JSON strings
    formData.append('workshopSelection', JSON.stringify(selectedWorkshops));

    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    const result = await register(formData);
    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    }
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl glass-premium">
      {success ? (
        <div className="py-12 text-center space-y-4 font-sans max-w-md mx-auto animate-scale-up">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Registration Successful!</h2>
          <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
            Welcome to TechNest Projects. A confirmation email has been dispatched. Redirecting you to your student dashboard in a moment...
          </p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6 font-sans text-sm">

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-blue-accent tracking-wide uppercase border-b border-card-border/60 pb-2">
              1. Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-accent" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-accent" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-accent" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="student@college.edu"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-blue-accent" />
                  <span>Create Password</span>
                </label>
                <input
                  type="password"
                  required
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Set dashboard password"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Background */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-blue-accent tracking-wide uppercase border-b border-card-border/60 pb-2">
              2. Academic Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-accent" />
                  <span>College Name</span>
                </label>
                <input
                  type="text"
                  required
                  name="college"
                  value={form.college}
                  onChange={handleInputChange}
                  placeholder="E.g., PES University"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-accent" />
                  <span>Semester</span>
                </label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60 text-foreground bg-background"
                >
                  {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map((sem) => (
                    <option key={sem} value={sem} className="bg-background text-foreground">{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-accent" />
                  <span>Academic Branch</span>
                </label>
                <input
                  type="text"
                  required
                  name="branch"
                  value={form.branch}
                  onChange={handleInputChange}
                  placeholder="E.g., Computer Science / Electronics"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-accent" />
                  <span>Project Topic Interest</span>
                </label>
                <input
                  type="text"
                  name="projectInterest"
                  value={form.projectInterest}
                  onChange={handleInputChange}
                  placeholder="E.g., Smart Agriculture Grid / AI Vision"
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Program Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 p-4 rounded-2xl glass border border-card-border/50">
              <h4 className="text-xs font-bold text-blue-accent uppercase tracking-wider">
                Workshop Programs (Optional)
              </h4>
              <div className="space-y-2.5">
                {WORKSHOP_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-start gap-2.5 text-xs text-foreground/75 cursor-pointer hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedWorkshops.includes(opt)}
                      onChange={() => handleCheckboxChange(opt, 'workshop')}
                      className="mt-0.5 w-4 h-4 rounded border-card-border accent-blue-600 focus:ring-0"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>


          </div>

          {/* Section 4: Message and File */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-blue-accent tracking-wide uppercase border-b border-card-border/60 pb-2">
              3. Additional Materials
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <span>Queries or Specific Requirements</span>
              </label>
              <textarea
                name="message"
                rows={3}
                value={form.message}
                onChange={handleInputChange}
                placeholder="Let us know if you need custom block diagrams, specific components, or target delivery deadlines."
                className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-accent" />
                <span>Upload Resume (PDF, DOC, DOCX up to 5MB)</span>
              </label>
              <div className="border border-dashed border-card-border rounded-xl p-6 text-center hover:bg-card-border/10 transition-all relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold text-blue-accent">
                    {resumeFile ? resumeFile.name : 'Choose file or drag here'}
                  </span>
                  <span className="block text-[10px] text-foreground/50">
                    {resumeFile ? `(${(resumeFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Sponsor applications and credentials validation'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Profile Registration</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Register() {
  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-4xl mx-auto space-y-12">
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] right-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* HEADER */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-extrabold text-gradient">
          Student Enrollment Portal
        </h1>
        <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans">
          Fill out your academic credentials, choose your workshops, and upload your resume. We will log your profile and generate your login dashboard.
        </p>
      </div>

      <Suspense fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-accent animate-spin" />
          <p className="text-sm text-foreground/60 font-sans">Loading form...</p>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
