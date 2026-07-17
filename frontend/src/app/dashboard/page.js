'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Logo from '@/components/Logo';
import { 
  User, Award, BookOpen, Clock, Settings, Bell, 
  Download, Edit3, CheckCircle2, ChevronRight, LogOut, Loader2, AlertCircle 
} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', college: '', branch: '', semester: '', projectInterest: '' });
  const [saving, setSaving] = useState(false);

  // Active Tab
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, workshops, projects, certs, edit

  useEffect(() => {
    // Auth Guard
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await api.get('/auth/dashboard');
        setDashboardData(response.data);
        setProfileForm({
          name: response.data.profile.name || '',
          phone: response.data.profile.phone || '',
          college: response.data.profile.college || '',
          branch: response.data.profile.branch || '',
          semester: response.data.profile.semester || '',
          projectInterest: response.data.profile.projectInterest || ''
        });
      } catch (err) {
        console.warn('Dashboard API failed. Loading mock student profile sandbox.');
        const mockData = {
          profile: {
            name: user?.name || 'Siddharth Rao',
            email: user?.email || 'student@technest.com',
            phone: '+91 8217060575',
            college: 'Siddaganga Institute of Technology',
            branch: 'Information Science',
            semester: '7th Semester',
            projectInterest: 'Smart Crop Analysis Grid',
            status: 'Approved',
            resumeUrl: ''
          },
          notifications: [
            { _id: '1', text: 'Welcome to TechNest Projects dashboard!', date: new Date().toLocaleDateString() },
            { _id: '2', text: 'Your final year project milestones have been assigned.', date: new Date().toLocaleDateString() }
          ],
          registeredWorkshops: [
            { _id: '1', title: 'Hands-on IoT and Robotics Bootcamp', date: '2026-07-15', duration: '2 Days', venue: 'Online Webex' }
          ],
          projects: [
            { project: { _id: '1', title: 'AI Smart Traffic Optimizer', category: 'AI', difficulty: 'Advanced' }, status: 'In Progress' }
          ],
          certificates: [
            { _id: 'c1', certificateId: 'TN-WKP-9E8D1', title: 'Introduction to AI Models Workshop', issueDate: new Date(), type: 'Workshop' }
          ]
        };
        setDashboardData(mockData);
        setProfileForm({
          name: mockData.profile.name,
          phone: mockData.profile.phone,
          college: mockData.profile.college,
          branch: mockData.profile.branch,
          semester: mockData.profile.semester,
          projectInterest: mockData.profile.projectInterest
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', profileForm);
      setDashboardData(prev => ({
        ...prev,
        profile: { ...prev.profile, ...profileForm }
      }));
      setIsEditing(false);
      setActiveSubTab('overview');
    } catch (err) {
      console.warn('API disconnected. Simulating local profile edit.');
      setDashboardData(prev => ({
        ...prev,
        profile: { ...prev.profile, ...profileForm }
      }));
      setIsEditing(false);
      setActiveSubTab('overview');
    } finally {
      setSaving(false);
    }
  };

  const handlePrintCert = (cert) => {
    // Open a printable page/mock for certificate download
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>TechNest Certificate - ${cert.certificateId}</title>
          <style>
            body { font-family: sans-serif; display: flex; items-center; justify-content: center; height: 95vh; margin: 0; background: #fafafa; }
            .cert-box { border: 15px solid #222; border-double; padding: 50px; text-align: center; max-width: 700px; background: white; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: relative; }
            h2 { color: #d97706; margin-bottom: 5px; }
            h1 { font-size: 32px; border-bottom: 2px solid #ccc; display: inline-block; width: 80%; padding-bottom: 10px; margin-top: 20px; }
            .id { position: absolute; top: 20px; right: 20px; font-size: 11px; color: #666; }
            .btn { background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 30px; }
            @media print { .btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="id">ID: ${cert.certificateId}</div>
            <h2>CERTIFICATE OF COMPLETION</h2>
            <p>This is to certify that</p>
            <h1>${dashboardData.profile.name.toUpperCase()}</h1>
            <p>has successfully completed the program</p>
            <h3 style="color:#0066cc;">"${cert.title}"</h3>
            <p>under Academic Reviews of TechNest Projects.</p>
            <p>Date of Issue: ${new Date(cert.issueDate).toLocaleDateString()}</p>
            <button class="btn" onclick="window.print()">Print E-Certificate</button>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="w-8 h-8 text-blue-accent animate-spin" />
        <p className="text-sm text-foreground/60 font-sans">Verifying session locks...</p>
      </div>
    );
  }

  const { profile, notifications, registeredWorkshops, projects, certificates } = dashboardData;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans text-sm">
      
      {/* ---------------------------------------------------- */}
      {/* DASHBOARD SIDEBAR NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <aside className="w-full md:w-64 glass border-r border-card-border shrink-0 flex flex-col justify-between py-6 px-4 md:h-screen sticky top-0">
        <div className="space-y-6">
          <Logo showText={true} className="px-2" />
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block px-2 mb-2">
              Student Center
            </span>
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: User },
              { id: 'projects', label: 'My Project Status', icon: BookOpen },
              { id: 'workshops', label: 'Enrolled Workshops', icon: Clock },
              { id: 'certs', label: 'My Certificates', icon: Award },
              { id: 'edit', label: 'Edit Profile settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    setIsEditing(tab.id === 'edit');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl font-semibold transition-all text-left cursor-pointer ${
                    activeSubTab === tab.id
                      ? 'bg-blue-accent text-white blue-gradient'
                      : 'text-foreground/75 hover:text-foreground hover:bg-card-border/30'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-card-border/50 pt-4 mt-6">
          <div className="flex items-center gap-2.5 px-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-accent/15 flex items-center justify-center text-blue-accent font-extrabold text-xs">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs truncate leading-normal text-foreground">{profile.name}</h4>
              <span className="text-[10px] text-foreground/50 truncate block mt-0.5">{profile.email}</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN DASHBOARD CONTENT AREA */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto md:h-screen">
        
        {/* Header Title block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-card-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Student Dashboard</h1>
            <p className="text-xs text-foreground/60 font-sans mt-1">
              Academic ID: TN-STU-{profile.email.split('@')[0].toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              profile.status === 'Approved' 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                : profile.status === 'Rejected'
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              Status: {profile.status}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SUBTAB: OVERVIEW */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">My Enrolled Projects</span>
                <h3 className="text-2xl font-bold">{projects.length} Assigned</h3>
              </div>
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Workshops Registered</span>
                <h3 className="text-2xl font-bold">{registeredWorkshops.length} Attending</h3>
              </div>
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Credentials Earned</span>
                <h3 className="text-2xl font-bold">{certificates.length} E-Certificates</h3>
              </div>
            </div>

            {/* Profile Detail block */}
            <div className="p-6 rounded-3xl glass-premium space-y-6">
              <h2 className="text-xl font-display font-bold">Academic Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm font-sans">
                <div>
                  <span className="block text-xs text-foreground/50">Full Name</span>
                  <span className="font-bold text-foreground">{profile.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-foreground/50">College name</span>
                  <span className="font-bold text-foreground">{profile.college}</span>
                </div>
                <div>
                  <span className="block text-xs text-foreground/50">Branch & Semester</span>
                  <span className="font-bold text-foreground">{profile.branch} ({profile.semester})</span>
                </div>
                <div>
                  <span className="block text-xs text-foreground/50">Registered Email</span>
                  <span className="font-bold text-foreground break-all">{profile.email}</span>
                </div>
                <div>
                  <span className="block text-xs text-foreground/50">Mobile Number</span>
                  <span className="font-bold text-foreground">{profile.phone}</span>
                </div>
                <div>
                  <span className="block text-xs text-foreground/50">Project Sourced Interest</span>
                  <span className="font-bold text-foreground">{profile.projectInterest || 'None specified'}</span>
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="p-6 rounded-3xl glass-premium space-y-4">
              <h2 className="text-xl font-display font-bold flex items-center gap-1.5">
                <Bell className="w-5 h-5 text-blue-accent" />
                <span>Notification Logs</span>
              </h2>
              <div className="space-y-3 font-sans text-xs">
                {notifications.length === 0 ? (
                  <p className="text-foreground/50 italic">No alerts logged.</p>
                ) : (
                  notifications.map((notif, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card-border/30 border border-card-border/20 flex items-start justify-between gap-3">
                      <p className="text-foreground/80 leading-normal">{notif.text}</p>
                      <span className="text-[9px] text-foreground/50 whitespace-nowrap">{new Date(notif.date).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUBTAB: PROJECTS */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'projects' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <h2 className="text-2xl font-display font-bold">Active Academic Projects</h2>
            
            {projects.length === 0 ? (
              <div className="p-8 rounded-3xl text-center glass border border-card-border/50 space-y-2">
                <BookOpen className="w-10 h-10 text-blue-accent/30 mx-auto" />
                <h4 className="font-bold">No projects assigned</h4>
                <p className="text-xs text-foreground/60 max-w-sm mx-auto leading-relaxed">
                  Once your registration is approved, our R&D consultant will assign your requested project configuration and begin tracking benchmarks.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((projObj, i) => {
                  const p = projObj.project;
                  const status = projObj.status;
                  const statusColors = {
                    'Assigned': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
                    'In Progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    'Testing': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    'Completed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  };

                  return (
                    <div key={i} className="p-6 rounded-3xl glass-premium space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-card-border/40 pb-4">
                        <div>
                          <span className="text-[10px] font-bold text-blue-accent uppercase tracking-wider block mb-1">
                            {p.category}
                          </span>
                          <h3 className="text-xl font-bold font-display">{p.title}</h3>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[status]}`}>
                          {status}
                        </span>
                      </div>

                      {/* Milestone visual progress bar */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-foreground/60 uppercase tracking-wide block">
                          Milestones Tracker
                        </span>
                        <div className="relative flex items-center justify-between">
                          {/* Progress connector line */}
                          <div className="absolute top-1/2 left-4 right-4 h-1 bg-card-border/60 -z-10" />
                          
                          {['Assigned', 'In Progress', 'Testing', 'Completed'].map((step, stepIdx) => {
                            const stepsMap = { 'Assigned': 0, 'In Progress': 1, 'Testing': 2, 'Completed': 3 };
                            const currentIdx = stepsMap[status];
                            const stepCode = stepsMap[step];

                            const completed = stepCode <= currentIdx;
                            const active = stepCode === currentIdx;

                            return (
                              <div key={step} className="flex flex-col items-center space-y-1 bg-background px-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                  completed
                                    ? 'bg-blue-accent text-white border-blue-accent shadow-md'
                                    : 'bg-card-border text-foreground/50 border-card-border'
                                }`}>
                                  {stepCode + 1}
                                </div>
                                <span className={`text-[10px] font-bold tracking-tight ${
                                  active ? 'text-blue-accent' : 'text-foreground/60'
                                }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUBTAB: WORKSHOPS */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'workshops' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <h2 className="text-2xl font-display font-bold">Enrolled Workshops</h2>
            
            {registeredWorkshops.length === 0 ? (
              <div className="p-8 rounded-3xl text-center glass border border-card-border/50 space-y-2">
                <Clock className="w-10 h-10 text-blue-accent/30 mx-auto" />
                <h4 className="font-bold">No workshops registered</h4>
                <p className="text-xs text-foreground/60 max-w-sm mx-auto leading-relaxed">
                  Join our upcoming coding bootcamps or hardware diagnostics workshops to earn verifiable credits.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registeredWorkshops.map((w) => (
                  <div key={w._id} className="p-5 rounded-2xl glass-premium border border-card-border space-y-3">
                    <h3 className="text-lg font-bold font-display">{w.title}</h3>
                    <div className="text-xs text-foreground/70 space-y-1">
                      <p>Date: {w.date}</p>
                      <p>Duration: {w.duration || '1 Day'}</p>
                      <p>Venue: {w.venue || 'Online'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUBTAB: CERTIFICATES */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'certs' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <h2 className="text-2xl font-display font-bold">Issued E-Certificates</h2>

            {certificates.length === 0 ? (
              <div className="p-8 rounded-3xl text-center glass border border-card-border/50 space-y-2">
                <Award className="w-10 h-10 text-blue-accent/30 mx-auto" />
                <h4 className="font-bold">No Certificates Sourced</h4>
                <p className="text-xs text-foreground/60 max-w-sm mx-auto leading-relaxed">
                  Upon completion of your internship or bootcamp reviews, our director will generate and seal your verifiable e-certificate here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div key={cert._id} className="p-5 rounded-2xl glass-premium border border-card-border flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-blue-accent uppercase tracking-wider block">
                        {cert.type} Program
                      </span>
                      <h3 className="text-base font-bold font-display">{cert.title}</h3>
                      <div className="text-xs text-foreground/50">
                        <p>ID: {cert.certificateId}</p>
                        <p>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePrintCert(cert)}
                      className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl bg-blue-accent/10 hover:bg-blue-accent hover:text-white border border-blue-accent/20 text-blue-accent text-xs font-bold transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUBTAB: EDIT PROFILE SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'edit' && (
          <div className="p-6 rounded-3xl glass-premium max-w-2xl animate-fade-in font-sans">
            <h2 className="text-xl font-display font-bold mb-6">Profile Settings</h2>
            
            <form onSubmit={handleProfileSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/85">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/85">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/85">College Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/85">Academic Branch</label>
                  <input
                    type="text"
                    required
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/85">Semester</label>
                  <select
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none text-foreground bg-background"
                  >
                    {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/85">Project Sourced Interest</label>
                <input
                  type="text"
                  value={profileForm.projectInterest}
                  onChange={(e) => setProfileForm({ ...profileForm, projectInterest: e.target.value })}
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none focus:border-blue-accent/60"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-6"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

      </main>

    </div>
  );
}
