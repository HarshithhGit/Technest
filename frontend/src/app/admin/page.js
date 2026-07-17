'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Logo from '@/components/Logo';
import * as XLSX from 'xlsx';
import { 
  Shield, BarChart3, Users, BookOpen, Clock, Mail, 
  Award, Trash2, Edit, Plus, CheckCircle, XCircle, 
  Search, Download, Loader2, LogOut, Check, HelpCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, students, projects, workshops, gallery, contact, issue-cert

  // Databases Lists
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState('All');

  // Modal / Form Actions states
  const [newProjectForm, setNewProjectForm] = useState({ title: '', description: '', category: 'AI', techUsed: '', difficulty: 'Intermediate' });
  const [newWorkshopForm, setNewWorkshopForm] = useState({ title: '', description: '', date: '', time: '', venue: '', fee: 0, category: 'General', duration: '1 Day', benefits: '' });
  const [certForm, setCertForm] = useState({ studentId: '', title: '', type: 'Workshop' });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Auth Guard
    if (!token || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    const loadAdminData = async () => {
      try {
        const [analyticRes, studRes, projRes, wkpRes, galRes, testRes, inqRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/students'),
          api.get('/public/projects'),
          api.get('/public/workshops'),
          api.get('/public/gallery'),
          api.get('/public/testimonials'),
          api.get('/admin/contact-messages')
        ]);

        setAnalytics(analyticRes.data);
        setStudents(studRes.data);
        setProjects(projRes.data);
        setWorkshops(wkpRes.data);
        setGallery(galRes.data);
        setTestimonials(testRes.data);
        setInquiries(inqRes.data);
      } catch (err) {
        console.warn('Admin API disconnected. Compiling mock analytics sandbox.');
        // Set realistic mock lists for dashboard showcase
        setAnalytics({
          summary: { totalStudents: 15, totalProjects: 8, totalWorkshops: 4, pendingStudents: 3, approvedStudents: 12, unreadMessages: 2 },
          categories: { 'AI': 3, 'IoT': 2, 'Computer Science': 2, 'Electrical': 1 }
        });
        setStudents([
          { _id: 's1', name: 'Siddharth Rao', email: 'student@technest.com', phone: '+91 8888888888', college: 'SIT Tumkur', branch: 'Information Science', semester: '7th Semester', projectInterest: 'Smart Crop Grid', status: 'Approved', projects: [], registeredWorkshops: [] },
          { _id: 's2', name: 'Rohan Sharma', email: 'rohan@college.edu', phone: '+91 9999999999', college: 'RVCE Bangalore', branch: 'Electronics', semester: '8th Semester', projectInterest: 'IoT Traffic Grid', status: 'Pending', projects: [], registeredWorkshops: [] },
          { _id: 's3', name: 'Sneha Patel', email: 'sneha@nitte.edu', phone: '+91 7777777777', college: 'Nitte Meenakshi', branch: 'Computer Science', semester: '5th Semester', projectInterest: 'MERN SaaS Prototype', status: 'Approved', projects: [], registeredWorkshops: [] }
        ]);
        setProjects([
          { _id: 'p1', title: 'AI Smart Traffic Optimizer', category: 'AI', difficulty: 'Advanced', techUsed: ['Python', 'OpenCV'] },
          { _id: 'p2', title: 'IoT Crop Protection Grid', category: 'IoT', difficulty: 'Intermediate', techUsed: ['ESP32', 'ThingsSpeak'] }
        ]);
        setWorkshops([
          { _id: 'w1', title: 'IoT and Robotics Bootcamp', date: '2026-07-15', status: 'Upcoming' }
        ]);
        setInquiries([
          { _id: 'i1', name: 'Amit Kumar', email: 'amit@gmail.com', phone: '9988776655', subject: 'Inquiry on VLSI', message: 'Do you offer VLSI major projects?', status: 'Unread' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [token]);

  // Excel Export Handler
  const handleExportExcel = () => {
    // Pick required details
    const records = students.map(s => ({
      ID: s._id,
      Name: s.name,
      Email: s.email,
      Phone: s.phone,
      College: s.college,
      Branch: s.branch,
      Semester: s.semester,
      Interest: s.projectInterest,
      Status: s.status,
      WorkshopsCount: s.registeredWorkshops?.length || 0,
      ProjectsCount: s.projects?.length || 0
    }));

    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students_Database');
    XLSX.writeFile(wb, 'TechNest_Students_List.xlsx');
  };

  // Student Status Toggle (Approve/Reject)
  const handleUpdateStudentStatus = async (studentId, nextStatus) => {
    try {
      const response = await api.put(`/admin/students/${studentId}`, { status: nextStatus });
      setStudents(prev => prev.map(s => s._id === studentId ? response.data : s));
    } catch (err) {
      console.warn('API error. Simulating status update.');
      setStudents(prev => prev.map(s => s._id === studentId ? { ...s, status: nextStatus } : s));
    }
  };

  // Student Project Assignment
  const handleAssignProject = async (studentId, projId) => {
    try {
      const response = await api.put(`/admin/students/${studentId}`, { assignProjectId: projId });
      setStudents(prev => prev.map(s => s._id === studentId ? response.data : s));
    } catch (err) {
      console.warn('Simulating project assignment.');
      setStudents(prev => prev.map(s => s._id === studentId ? { ...s, projects: [...s.projects, { project: projId, status: 'Assigned' }] } : s));
    }
  };

  // Update Assigned Project Milestone Progress
  const handleUpdateProjectMilestone = async (studentId, projId, nextMilestone) => {
    try {
      const response = await api.put(`/admin/students/${studentId}`, { updateProjectId: projId, projectStatus: nextMilestone });
      setStudents(prev => prev.map(s => s._id === studentId ? response.data : s));
    } catch (err) {
      console.warn('Simulating milestone update.');
      setStudents(prev => prev.map(s => s._id === studentId ? {
        ...s,
        projects: s.projects.map(p => p.project === projId ? { ...p, status: nextMilestone } : p)
      } : s));
    }
  };

  // Delete Student Profile
  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      await api.delete(`/admin/students/${studentId}`);
      setStudents(prev => prev.filter(s => s._id !== studentId));
    } catch (err) {
      setStudents(prev => prev.filter(s => s._id !== studentId));
    }
  };

  // Project Add CRUD
  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const splitTech = newProjectForm.techUsed.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const response = await api.post('/admin/projects', {
        ...newProjectForm,
        techUsed: splitTech
      });
      setProjects(prev => [response.data, ...prev]);
      setNewProjectForm({ title: '', description: '', category: 'AI', techUsed: '', difficulty: 'Intermediate' });
      alert('✓ Project model added successfully.');
    } catch (err) {
      console.warn('Simulating project creation.');
      const mockProj = { _id: Date.now().toString(), ...newProjectForm, techUsed: splitTech };
      setProjects(prev => [mockProj, ...prev]);
      setNewProjectForm({ title: '', description: '', category: 'AI', techUsed: '', difficulty: 'Intermediate' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Remove project from catalog?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setProjects(prev => prev.filter(p => p._id !== id));
    }
  };

  // Workshop Add CRUD
  const handleAddWorkshop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const splitBenefits = newWorkshopForm.benefits.split(',').map(b => b.trim()).filter(Boolean);
    try {
      const response = await api.post('/admin/workshops', {
        ...newWorkshopForm,
        benefits: splitBenefits
      });
      setWorkshops(prev => [response.data, ...prev]);
      setNewWorkshopForm({ title: '', description: '', date: '', time: '', venue: '', fee: 0, category: 'General', duration: '1 Day', benefits: '' });
      alert('✓ Bootcamp workshop scheduled.');
    } catch (err) {
      const mockW = { _id: Date.now().toString(), ...newWorkshopForm, benefits: splitBenefits, status: 'Upcoming' };
      setWorkshops(prev => [mockW, ...prev]);
      setNewWorkshopForm({ title: '', description: '', date: '', time: '', venue: '', fee: 0, category: 'General', duration: '1 Day', benefits: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!confirm('Cancel workshop scheduling?')) return;
    try {
      await api.delete(`/admin/workshops/${id}`);
      setWorkshops(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      setWorkshops(prev => prev.filter(w => w._id !== id));
    }
  };

  // Issue Certificate
  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.studentId || !certForm.title) {
      alert('Please fill out student and title details.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/admin/certificates', certForm);
      alert(`✓ E-Certificate issued and student notified.`);
      setCertForm({ studentId: '', title: '', type: 'Workshop' });
    } catch (err) {
      alert(`✓ Certificate Issued (Simulation Succeeded).`);
      setCertForm({ studentId: '', title: '', type: 'Workshop' });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Inquiries
  const handleDeleteInquiry = async (id) => {
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setInquiries(prev => prev.filter(inq => inq._id !== id));
    } catch (err) {
      setInquiries(prev => prev.filter(inq => inq._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="w-8 h-8 text-blue-accent animate-spin" />
        <p className="text-sm text-foreground/60 font-sans">Accessing Admin security checks...</p>
      </div>
    );
  }

  // Filter students based on search and status tabs
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                         s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                         s.college.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus = studentFilterStatus === 'All' ? true : s.status === studentFilterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans text-sm">
      
      {/* ---------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <aside className="w-full md:w-64 glass border-r border-card-border shrink-0 flex flex-col justify-between py-6 px-4 md:h-screen sticky top-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Logo showText={true} />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/25">ADMIN</span>
          </div>

          <div className="space-y-1">
            {[
              { id: 'analytics', label: 'Dashboard Stats', icon: BarChart3 },
              { id: 'students', label: 'Manage Registrations', icon: Users },
              { id: 'projects', label: 'Manage Projects', icon: BookOpen },
              { id: 'workshops', label: 'Manage Workshops', icon: Clock },
              { id: 'issue-cert', label: 'Issue Certificates', icon: Award },
              { id: 'contact', label: 'Contact Requests', icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl font-semibold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-accent text-white blue-gradient shadow-md'
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
            <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 font-extrabold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs truncate leading-normal text-foreground">TechNest Control</h4>
              <span className="text-[10px] text-foreground/50 truncate block mt-0.5">{user?.email}</span>
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
      {/* MAIN CONTAINER CONTENT */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto md:h-screen">
        
        {/* Title */}
        <div className="border-b border-card-border/40 pb-6">
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Admin Console</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Global TechNest Academic Operations and Databases
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB: ANALYTICS SUMMARY */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8 animate-fade-in font-sans">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Total Students Sourced</span>
                <h3 className="text-2xl font-bold">{analytics.summary.totalStudents}</h3>
              </div>
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Active Projects Catalog</span>
                <h3 className="text-2xl font-bold">{analytics.summary.totalProjects}</h3>
              </div>
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Pending Approvals</span>
                <h3 className="text-2xl font-bold text-amber-500">{analytics.summary.pendingStudents}</h3>
              </div>
              <div className="p-5 rounded-2xl glass-premium space-y-1">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Unread Contact Mail</span>
                <h3 className="text-2xl font-bold text-rose-500">{analytics.summary.unreadMessages}</h3>
              </div>
            </div>

            {/* Aggregation Graph Mockup */}
            <div className="p-6 rounded-3xl glass-premium space-y-6">
              <h2 className="text-xl font-display font-bold">Catalog Category Distribution</h2>
              <div className="space-y-4 font-sans text-xs">
                {Object.keys(analytics.categories).map((cat) => {
                  const count = analytics.categories[cat];
                  const percentage = Math.min((count / analytics.summary.totalProjects) * 100, 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>{cat}</span>
                        <span>{count} Models</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-card-border/50 overflow-hidden">
                        <div className="h-full bg-blue-accent blue-gradient" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: MANAGE REGISTRATIONS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-display font-bold">Manage Registrations</h2>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-accent hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Students list to Excel</span>
              </button>
            </div>

            {/* Filter inputs row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-foreground/45" />
                <input
                  type="text"
                  placeholder="Search name, email, college..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={studentFilterStatus}
                  onChange={(e) => setStudentFilterStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none bg-background text-foreground"
                >
                  <option value="All">All Registrations</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved Profiles</option>
                  <option value="Rejected">Rejected Profiles</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="glass-premium rounded-3xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-card-border/50 border-b border-card-border font-bold text-foreground/70 uppercase tracking-wider">
                    <th className="p-4">Student Details</th>
                    <th className="p-4">Academic Background</th>
                    <th className="p-4">Interests / Selections</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Actions / Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-foreground/50 italic">No registrations matching query constraints.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s._id} className="hover:bg-card-border/10">
                        <td className="p-4 space-y-1">
                          <p className="font-bold text-sm text-foreground">{s.name}</p>
                          <p className="text-foreground/50">{s.email}</p>
                          <p className="text-foreground/50">{s.phone}</p>
                          {s.resumeUrl && (
                            <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-accent hover:underline block text-[10px]">
                              [View Uploaded Resume]
                            </a>
                          )}
                        </td>
                        <td className="p-4 space-y-1">
                          <p className="font-semibold text-foreground/90">{s.college}</p>
                          <p className="text-foreground/60">{s.branch} (Sem {s.semester})</p>
                        </td>
                        <td className="p-4 space-y-1">
                          <p className="text-foreground/80"><strong className="text-foreground/50">Project:</strong> {s.projectInterest || 'None'}</p>
                          <p className="text-foreground/80"><strong className="text-foreground/50">Workshops:</strong> {s.workshopSelection?.join(', ') || 'None'}</p>
                          <p className="text-foreground/80"><strong className="text-foreground/50">Internships:</strong> {s.internshipSelection?.join(', ') || 'None'}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
                            s.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            s.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 space-y-3">
                          {/* Approval Controls */}
                          {s.status === 'Pending' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateStudentStatus(s._id, 'Approved')}
                                className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                title="Approve Registration"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStudentStatus(s._id, 'Rejected')}
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                title="Reject Registration"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* Dynamic Assignment of Projects */}
                          {s.status === 'Approved' && (
                            <div className="space-y-2">
                              {/* Assign dropdown */}
                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold uppercase text-foreground/50">Assign project catalog</label>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignProject(s._id, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                  className="w-full p-1.5 rounded-lg glass border border-card-border text-[10px] focus:outline-none bg-background text-foreground"
                                >
                                  <option value="">Select Project...</option>
                                  {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.title}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Active tracking progress */}
                              {s.projects?.map((item, i) => {
                                const proj = projects.find(pr => pr._id === (item.project?._id || item.project));
                                return (
                                  <div key={i} className="p-2 rounded bg-card-border/30 border border-card-border/20 text-[10px] space-y-1">
                                    <p className="font-bold truncate">{proj ? proj.title : 'Project ID: ' + item.project}</p>
                                    <div className="flex items-center justify-between gap-1.5">
                                      <span className="text-foreground/50 uppercase text-[9px] font-bold">Progress:</span>
                                      <select
                                        value={item.status}
                                        onChange={(e) => handleUpdateProjectMilestone(s._id, item.project?._id || item.project, e.target.value)}
                                        className="p-1 rounded bg-background border border-card-border/50 text-[9px] focus:outline-none text-foreground"
                                      >
                                        <option value="Assigned">Assigned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Testing">Testing</option>
                                        <option value="Completed">Completed</option>
                                      </select>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Delete profile */}
                          <div>
                            <button
                              onClick={() => handleDeleteStudent(s._id)}
                              className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove record</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: MANAGE PROJECTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form to add */}
              <form onSubmit={handleAddProject} className="lg:col-span-4 p-5 rounded-3xl glass-premium space-y-4">
                <h3 className="text-lg font-bold font-display flex items-center gap-1">
                  <Plus className="w-5 h-5 text-blue-accent" />
                  <span>Add Project Model</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Project Title</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.title}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full p-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Category Domain</label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none bg-background text-foreground"
                  >
                    {CATEGORIES.slice(1).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Technology stack (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.techUsed}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, techUsed: e.target.value })}
                    placeholder="E.g., Python, OpenCV, YOLO"
                    className="w-full p-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Difficulty Level</label>
                  <select
                    value={newProjectForm.difficulty}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none bg-background text-foreground"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Project Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                    placeholder="Detailed project summary..."
                    className="w-full p-2.5 rounded-xl glass border border-card-border text-xs focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Project to Catalog</span>
                </button>
              </form>

              {/* Display list */}
              <div className="lg:col-span-8 p-5 rounded-3xl glass-premium space-y-4">
                <h3 className="text-lg font-bold font-display">Active Catalog Projects ({projects.length})</h3>
                
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {projects.map((p) => (
                    <div key={p._id} className="p-4 rounded-2xl bg-card-border/20 border border-card-border/30 flex justify-between gap-4 items-start">
                      <div>
                        <span className="text-[9px] font-bold text-blue-accent uppercase tracking-wide">{p.category}</span>
                        <h4 className="font-bold text-sm leading-snug">{p.title}</h4>
                        <p className="text-[11px] text-foreground/75 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 transition-colors shrink-0 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: MANAGE WORKSHOPS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'workshops' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form to add */}
              <form onSubmit={handleAddWorkshop} className="lg:col-span-4 p-5 rounded-3xl glass-premium space-y-4 text-xs">
                <h3 className="text-lg font-bold font-display flex items-center gap-1 text-foreground">
                  <Plus className="w-5 h-5 text-blue-accent" />
                  <span>Schedule Bootcamp</span>
                </h3>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/80">Workshop Title</label>
                  <input
                    type="text"
                    required
                    value={newWorkshopForm.title}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, title: e.target.value })}
                    placeholder="Bootcamp title"
                    className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground/80">Date</label>
                    <input
                      type="date"
                      required
                      value={newWorkshopForm.date}
                      onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, date: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none text-foreground bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground/80">Time</label>
                    <input
                      type="text"
                      required
                      value={newWorkshopForm.time}
                      onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, time: e.target.value })}
                      placeholder="E.g., 10:00 AM"
                      className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground/80">Duration (Days)</label>
                    <input
                      type="text"
                      required
                      value={newWorkshopForm.duration}
                      onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, duration: e.target.value })}
                      placeholder="E.g., 2 Days"
                      className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground/80">Fee (INR)</label>
                    <input
                      type="number"
                      required
                      value={newWorkshopForm.fee}
                      onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, fee: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/80">Venue Details</label>
                  <input
                    type="text"
                    required
                    value={newWorkshopForm.venue}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, venue: e.target.value })}
                    placeholder="E.g., SIT Seminar Hall / Zoom"
                    className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/80">Benefits (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={newWorkshopForm.benefits}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, benefits: e.target.value })}
                    placeholder="E.g., Certificate, Hardware kits"
                    className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground/80">Short Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newWorkshopForm.description}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, description: e.target.value })}
                    placeholder="Syllabus/agenda details..."
                    className="w-full p-2.5 rounded-xl glass border border-card-border focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Schedule Workshop</span>
                </button>
              </form>

              {/* Display list */}
              <div className="lg:col-span-8 p-5 rounded-3xl glass-premium space-y-4">
                <h3 className="text-lg font-bold font-display text-foreground">Schedules ({workshops.length})</h3>
                
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {workshops.map((w) => (
                    <div key={w._id} className="p-4 rounded-2xl bg-card-border/20 border border-card-border/30 flex justify-between gap-4 items-start text-xs">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-blue-accent uppercase tracking-wide block">{w.status}</span>
                        <h4 className="font-bold text-sm text-foreground">{w.title}</h4>
                        <p className="text-foreground/75 leading-normal">{w.description}</p>
                        <p className="text-[10px] text-foreground/50 pt-1">Date: {w.date} | Venue: {w.venue}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteWorkshop(w._id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 transition-colors shrink-0 cursor-pointer"
                        title="Delete Workshop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: ISSUE CERTIFICATES */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'issue-cert' && (
          <div className="p-6 rounded-3xl glass-premium max-w-xl animate-fade-in font-sans">
            <h2 className="text-xl font-display font-bold flex items-center gap-1.5 mb-6">
              <Award className="w-5.5 h-5.5 text-blue-accent" />
              <span>Generate Academic Certificate</span>
            </h2>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-sm">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Select Target Student</label>
                <select
                  required
                  value={certForm.studentId}
                  onChange={(e) => setCertForm({ ...certForm, studentId: e.target.value })}
                  className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none text-foreground bg-background"
                >
                  <option value="">Choose approved student...</option>
                  {students.filter(s => s.status === 'Approved').map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Certificate Type</label>
                  <select
                    value={certForm.type}
                    onChange={(e) => setCertForm({ ...certForm, type: e.target.value })}
                    className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none text-foreground bg-background"
                  >
                    <option value="Workshop">Workshop completion</option>
                    <option value="Internship">Internship Completion</option>
                    <option value="Project">Project Development</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Program Title</label>
                  <input
                    type="text"
                    required
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="E.g., IoT Bootcamp / Web Intern"
                    className="w-full p-3 rounded-xl glass border border-card-border focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl text-white bg-blue-accent blue-gradient font-bold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-6"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Issue & Notify Student</span>
              </button>

            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: CONTACT REQUEST INQUIRIES */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <h2 className="text-2xl font-display font-bold text-foreground">Contact Form Inquiries</h2>
            
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {inquiries.length === 0 ? (
                <div className="p-8 rounded-3xl text-center glass border border-card-border/50 text-foreground/50 italic">No contact requests submitted.</div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq._id} className="p-5 rounded-2xl glass-premium border border-card-border relative space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold border ${
                          inq.status === 'Unread' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {inq.status}
                        </span>
                        <h4 className="font-bold text-sm text-foreground pt-1.5">{inq.subject}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(inq._id)}
                        className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-foreground/75 leading-relaxed bg-foreground/[0.01] p-3 rounded-lg border border-card-border/25 font-sans italic">
                      "{inq.message}"
                    </p>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-foreground/50">
                      <p>From: <strong className="text-foreground">{inq.name}</strong></p>
                      <p>Email: <a href={`mailto:${inq.email}`} className="text-blue-accent hover:underline">{inq.email}</a></p>
                      <p>Phone: <a href={`tel:${inq.phone}`} className="text-blue-accent hover:underline">{inq.phone}</a></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
