'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import {
  Calendar, Clock, MapPin, Award, BookOpen,
  ChevronRight, Sparkles, Check, CheckCircle2, User, Printer
} from 'lucide-react';

export default function Workshops() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Certificate Preview State
  const [studentName, setStudentName] = useState('STUDENT NAME');


  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const response = await api.get('/public/workshops');
        setWorkshops(response.data);
      } catch (error) {
        console.warn('API offline, using mock workshops list.');
        setWorkshops([
          {
            _id: '1',
            title: 'Hands-on IoT and Robotics Bootcamp',
            description: 'A comprehensive 2-day workshop detailing ESP32 connectivity, IoT clouds, and building autonomous sensor networks.',
            date: '2026-07-15',
            time: '10:00 AM - 04:00 PM',
            venue: 'TechNest Lab Hub & Live Zoom',
            fee: 499,
            status: 'Upcoming',
            category: 'Internet of Things',
            duration: '2 Days',
            benefits: ['Certificate of Participation', 'Hardware Kit Sourced', 'Recorded Video Access', 'Coding Sandboxes Access']
          },
          {
            _id: '2',
            title: 'Full-Stack Web Development BootCamp with Next.js',
            description: 'Master React, Next.js, and server-side deployment to build premium SaaS sites with Tailwind and MongoDB.',
            date: '2026-08-01',
            time: '09:00 AM - 01:00 PM',
            venue: 'Online Webex Portal',
            fee: 299,
            status: 'Upcoming',
            category: 'Web Development',
            duration: '3 Days',
            benefits: ['Certificate of BootCamp Completion', '1-on-1 Mentorship', 'Live Project Deployment Support', 'Git Repository Review']
          },
          {
            _id: '3',
            title: 'Introduction to AI & Deep Learning Models',
            description: 'A structural overview of convolutional networks, data wrangling with pandas, and training models with TensorFlow.',
            date: '2026-05-10',
            time: '10:00 AM - 03:00 PM',
            venue: 'SIT Seminar Hall',
            fee: 199,
            status: 'Previous',
            category: 'Artificial Intelligence',
            duration: '1 Day',
            benefits: ['E-Certificate of Completion', 'Jupyter Notebook Resources', 'Resume Screening Tips']
          },
          {
            _id: '4',
            title: 'Embedded C Programming for Microcontrollers',
            description: 'Deep dive into registers, interrupts, timers, and peripheral interfaces on PIC and AVR microchips.',
            date: '2026-04-18',
            time: '09:30 AM - 04:30 PM',
            venue: 'Online Meet Portal',
            fee: 0,
            status: 'Previous',
            category: 'Embedded Systems',
            duration: '1 Day',
            benefits: ['Free E-Certificate', 'PDF Booklets & Cheat Sheets', 'Code Sandboxes access']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const handleRegisterRedirect = (workshopTitle) => {
    router.push(`/register?workshop=${encodeURIComponent(workshopTitle)}`);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const upcoming = workshops.filter(w => w.status === 'Upcoming');
  const previous = workshops.filter(w => w.status === 'Previous');

  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto space-y-24">

      {/* Background ambient lighting */}
      <div className="absolute top-[10%] right-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gradient">
          Workshop Verification
        </h1>
        <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans">
          Verify and preview your official TechNest Projects workshop participation certificates. Enter your details below to generate a preview of your credentials.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* CERTIFICATE PREVIEW SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card-bg/10 rounded-3xl p-6 sm:p-10 border border-card-border/50 glass">

        {/* Left Side: Inputs */}
        <div className="lg:col-span-4 space-y-6 font-sans">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 text-xs text-blue-accent font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Verify E-Certificate Preview</span>
            </div>
            <h2 className="text-2xl font-display font-bold">Try the Interactive Certificate Preview</h2>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Every student gets a custom verifiable certificate upon completing our bootcamps. Type your name to view the layout instantly!
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/85">Student Name</label>
              <input
                type="text"
                maxLength={30}
                placeholder="Enter Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl glass border border-card-border text-sm focus:outline-none focus:border-blue-accent/60"
              />
            </div>


          </div>
        </div>

        {/* Right Side: Visual Certificate Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-4">

          <div
            id="certificate-print-area"
            className="w-full aspect-[1.414/1] max-w-2xl rounded-2xl bg-white text-slate-900 border-8 border-slate-900/10 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl font-sans"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(230, 242, 255, 0.4) 0%, rgba(255, 255, 255, 1) 100%)' }}
          >
            {/* Corner Decorative Borders */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-600" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-600" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-600" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-600" />

            {/* Top Branding Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-950/10">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-850">
                  TechNest <span className="text-blue-700 font-normal">Projects</span>
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Verifiable ID: TN-CRT-MOCK</span>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-2 py-4">
              <h3 className="text-amber-700 font-bold tracking-widest text-xs uppercase">Certificate of Participation</h3>
              <p className="text-[10px] text-slate-500 italic">This is proudly presented to</p>
              <h4 className="text-lg sm:text-2xl font-display font-extrabold tracking-wide text-slate-900 border-b border-slate-300 w-3/4 mx-auto pb-1 mt-2">
                {studentName || 'STUDENT NAME'}
              </h4>
              <p className="text-[10px] text-slate-650 max-w-md mx-auto leading-relaxed pt-2">
                for active participation and successful completion of the academic bootcamp program in
                conducted by the TechNest Projects R&D Academic Division.
              </p>
            </div>

            {/* Bottom Signatures Block */}
            <div className="flex justify-between items-end pt-4 border-t border-slate-950/10 text-center">
              <div>
                <span className="block text-[11px] text-slate-800 font-serif italic">Murthy. S</span>
                <span className="block text-[8px] text-slate-500 uppercase tracking-wider pt-1 border-t border-slate-200 w-20 mx-auto">Director</span>
              </div>

              {/* Fake Security Stamp Vector */}
              <div className="w-10 h-10 rounded-full border-4 border-double border-amber-600/60 flex items-center justify-center text-[7px] text-amber-600/70 font-extrabold rotate-12">
                APPROVED
              </div>

              <div>
                <span className="block text-[11px] text-slate-800 font-serif italic">Rajesh. K</span>
                <span className="block text-[8px] text-slate-500 uppercase tracking-wider pt-1 border-t border-slate-200 w-20 mx-auto">Chief Mentor</span>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-foreground/50 flex items-center gap-1 font-sans">
            Note: Screen sizing fits visual preview. Use local browser commands to print layout as PDF.
          </p>
        </div>
      </section>



    </div>
  );
}
