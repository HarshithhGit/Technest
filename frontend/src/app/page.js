'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { 
  ArrowRight, Sparkles, Code, Cpu, Award, Users, BookOpen, School,
  ArrowLeftRight, Star, ChevronLeft, ChevronRight, CheckCircle2 
} from 'lucide-react';

// Typing effect phrases
const PHRASES = ["Innovations", "Engg Projects", "SaaS Prototypes", "IEEE Research"];

export default function Home() {
  // Stats counter state
  const [studentsCount, setStudentsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [workshopsCount, setWorkshopsCount] = useState(0);
  const [collegesCount, setCollegesCount] = useState(0);

  // Dynamic content
  const [latestProjects, setLatestProjects] = useState([]);
  const [latestWorkshops, setLatestWorkshops] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  // Testimonials carousel index
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Typing Effect state
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await api.get('/public/projects');
        setLatestProjects(projRes.data.slice(0, 3));
      } catch (e) {
        // Fallback mockup list
        setLatestProjects([
          {
            _id: '1',
            title: 'AI-Powered Smart Traffic Management System',
            description: 'An intelligent traffic optimization framework using OpenCV and YOLO object detection.',
            category: 'AI',
            techUsed: ['Python', 'YOLO v8', 'OpenCV'],
            difficulty: 'Advanced'
          },
          {
            _id: '2',
            title: 'IoT Enabled Smart Agriculture Grid',
            description: 'Precision farming system equipped with NPK soil sensors and automatic cloud hydration.',
            category: 'IoT',
            techUsed: ['ESP32', 'ThingsSpeak', 'MQTT'],
            difficulty: 'Intermediate'
          },
          {
            _id: '3',
            title: 'Blockchain Secure Medical Storage',
            description: 'Decentralized electronic health records ensuring patient consent and IPFS file hosting.',
            category: 'Computer Science',
            techUsed: ['React.js', 'Solidity', 'Ethereum'],
            difficulty: 'Advanced'
          }
        ]);
      }

      try {
        const wkpRes = await api.get('/public/workshops');
        setLatestWorkshops(wkpRes.data.filter(w => w.status === 'Upcoming').slice(0, 2));
      } catch (e) {
        // Fallback mockup list
        setLatestWorkshops([
          {
            _id: '1',
            title: 'Hands-on IoT and Robotics Bootcamp',
            description: 'ESP32 connectivity, IoT clouds, and building autonomous sensor grids.',
            date: '2026-07-15',
            time: '10:00 AM - 04:00 PM',
            venue: 'TechNest Hub & Zoom',
            fee: 499,
            duration: '2 Days'
          },
          {
            _id: '2',
            title: 'Full-Stack Next.js Developer BootCamp',
            description: 'Master React, Next.js, and server-side deployment to build SaaS sites.',
            date: '2026-08-01',
            time: '09:00 AM - 01:00 PM',
            venue: 'Online Webex Portal',
            fee: 299,
            duration: '3 Days'
          }
        ]);
      }

      try {
        const testRes = await api.get('/public/testimonials');
        setTestimonials(testRes.data);
      } catch (e) {
        setTestimonials([
          {
            name: 'Rohan Sharma',
            college: 'R.V. College of Engineering, Bangalore',
            comment: 'TechNest Projects helped me bring my final year project to life. The hardware debugging support was top-notch!',
            rating: 5
          },
          {
            name: 'Ananya Hegde',
            college: 'Siddaganga Institute of Technology, Tumkur',
            comment: 'I learned more in their 3-day Next.js and AI workshops than in an entire semester. Ready-to-submit report files were super helpful.',
            rating: 5
          },
          {
            name: 'Praveen Kumar',
            college: 'PES University, Bangalore',
            comment: 'The internship program was well structured. Regular reviews and live mentoring helped me complete my project easily.',
            rating: 4
          }
        ]);
      }
    };
    fetchData();
  }, []);

  // Animate stats counter on scroll/mount
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setStudentsCount(Math.min(Math.floor((5000 / steps) * currentStep), 5000));
      setProjectsCount(Math.min(Math.floor((1200 / steps) * currentStep), 1200));
      setWorkshopsCount(Math.min(Math.floor((80 / steps) * currentStep), 80));
      setCollegesCount(Math.min(Math.floor((50 / steps) * currentStep), 50));

      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Typing effect loop
  useEffect(() => {
    let timer;
    const currentPhrase = PHRASES[phraseIdx];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 100);
    }

    if (!isDeleting && typedText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setPhraseIdx(prev => (prev + 1) % PHRASES.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx]);

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      
      {/* ---------------------------------------------------- */}
      {/* BACKGROUND PARTICLES AND LIGHTING EFFECTS */}
      {/* ---------------------------------------------------- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-accent/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-accent/10 blur-[150px] pointer-events-none -z-10" />

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-card-border text-xs sm:text-sm text-foreground/80"
          >
            <Sparkles className="w-4 h-4 text-blue-accent animate-spin-slow" />
            <span>Turning Ideas into Successful Projects</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] text-gradient"
          >
            TechNest Projects
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground/90 max-w-4xl mx-auto"
          >
            Powering <span className="text-blue-accent min-w-[200px] inline-block font-extrabold border-r-2 border-blue-accent pr-1 animate-pulse">{typedText}</span>
            <br />
            <span className="text-lg sm:text-xl font-normal text-foreground/75 mt-4 block leading-relaxed font-sans max-w-2xl mx-auto">
              Custom Technical & Academic Solutions built from scratch for Engineering, Diploma, and Degree candidates.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-blue-accent blue-gradient shadow-lg hover:opacity-95 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold glass border border-card-border hover:bg-card-border/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PARTNER LOGO MARQUEE */}
      {/* ---------------------------------------------------- */}
      <section className="py-10 border-y border-card-border bg-card-bg/25 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <p className="text-xs uppercase tracking-widest text-foreground/50 font-semibold font-sans">
            Connected with Students from Leading Institutes
          </p>
        </div>
        <div className="relative w-full flex items-center overflow-hidden">
          {/* Marquee Inner container */}
          <div className="flex w-[200%] gap-12 sm:gap-20 items-center justify-around animate-marquee whitespace-nowrap">
            {['RVCE Bangalore', 'PES University', 'SIT Tumkur', 'BMSCE', 'MSRIT', 'NITTE Meenakshi', 'SJCE Mysore', 'RVCE Bangalore', 'PES University', 'SIT Tumkur', 'BMSCE', 'MSRIT', 'NITTE Meenakshi', 'SJCE Mysore'].map((college, idx) => (
              <span key={idx} className="font-display text-base sm:text-lg font-bold text-foreground/45 hover:text-blue-accent/70 transition-colors duration-300 cursor-default">
                {college}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* STATISTICS GRID */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { label: 'Students Guided', count: studentsCount, suffix: '+', icon: Users },
            { label: 'Projects Completed', count: projectsCount, suffix: '+', icon: Code },
            { label: 'Workshops Conducted', count: workshopsCount, suffix: '+', icon: BookOpen },
            { label: 'Colleges Connected', count: collegesCount, suffix: '+', icon: School }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl glass-premium text-center space-y-2 relative overflow-hidden"
              >
                <div className="mx-auto w-10 h-10 rounded-xl bg-blue-accent/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-blue-accent" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-gradient">
                  {stat.count.toLocaleString()}{stat.suffix}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-foreground/70 font-sans">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FEATURED SERVICES PREVIEW */}
      {/* ---------------------------------------------------- */}

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">Services We Specialize In</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base font-sans">
            Whether you need hands-on project files, documentation support, or code explanations, we have got you covered.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: 'Degree Projects',
              desc: 'Custom prototypes designed in Computer Science, IoT, Embedded Systems, Machine Learning, Electrical, and Mechanical.',
              icon: Cpu,
              path: '/services'
            },
            {
              title: 'Academic Documentation',
              desc: 'Fully structured project reports, synopses, reference material bibliographies, and ready-to-present PPT slides.',
              icon: BookOpen,
              path: '/services'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl glass-premium flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-accent/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-blue-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold">{item.title}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed font-sans">{item.desc}</p>
                </div>
                <Link
                  href={item.path}
                  className="flex items-center gap-1.5 text-sm font-semibold text-blue-accent group-hover:underline pt-4"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* OUR SERVICES SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 text-center animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient">Our Services</h2>
          <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans max-w-3xl mx-auto">
            TechNest Projects provides high-quality academic and technical solutions for Engineering, Diploma, and Degree students. We specialize in project development, documentation support, web development, project reports, PPT creation, internships, and technical guidance, helping students successfully complete their academic projects with professional standards.
          </p>
        </motion.div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PROJECT DESIGN & IMPLEMENTATION SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-12 rounded-3xl glass border border-card-border/50 space-y-4 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Project Design & Implementation</h2>
          <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans">
            TechNest Projects provides complete project planning, design, development, testing, documentation, and implementation support for students.
          </p>
        </motion.div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FINAL CALL TO ACTION (CTA) */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="p-8 md:p-16 rounded-3xl glass-premium blue-gradient relative overflow-hidden text-center space-y-6 text-white shadow-2xl">
          {/* Glow circle overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/30 to-indigo-700/30 -z-10" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight">
            Ready to Accelerate Your Academics?
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base opacity-90 leading-relaxed font-sans">
            Enroll today to reserve your upcoming workshop slot, secure a domain internship program, or customize your final year engineering project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 font-bold hover:bg-opacity-95 transition-all text-sm sm:text-base shadow-lg"
            >
              Sign Up For Program
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/40 hover:bg-white/10 text-white font-bold transition-all text-sm sm:text-base"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
