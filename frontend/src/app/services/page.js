'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Cpu, Layers, BookOpen, FileText, BarChart3, HelpCircle, 
  UserCheck, Terminal, Smartphone, Brain, Globe, Laptop, Database, 
  ArrowRight, Check, X, ShieldAlert 
} from 'lucide-react';

const SERVICES_DATA = [
  // Category 1: Academic Projects
  {
    id: 'engg-proj',
    category: 'Projects',
    title: 'Engineering Projects',
    desc: 'Comprehensive project development across major streams: Computer Science, Electronics, Electrical, Civil, and Mechanical.',
    details: 'Get fully functional hardware prototypes and production-ready codebases designed by R&D consultants to match engineering syllabus standards.',
    deliverables: ['Custom Hardware Prototype / Verified Codebase', 'Complete Project Report & Synopsis', 'Explanation Videos & Circuits Diagram', 'Viva Voce QA Prep Guide'],
    icon: Code
  },
  {
    id: 'mini-proj',
    category: 'Projects',
    title: 'Mini Projects',
    desc: 'Sub-system prototyping and hobby-scale projects ideal for 5th & 6th semester lab submissions.',
    details: 'Compact, focused projects focusing on single controller operations (Arduino, PIC, ESP8266) or simple web dashboards.',
    deliverables: ['Working Code & Simulation File', 'Simple 15-page Project Report', 'Component Data Sheets', 'Installation & Setup Guide'],
    icon: Layers
  },
  {
    id: 'major-proj',
    category: 'Projects',
    title: 'Major Projects',
    desc: 'Large-scale, multi-disciplinary final year projects combining cloud networks, hardware controllers, and AI dashboards.',
    details: 'Architected for end-to-end presentation reviews and final year evaluations. We build fully secure and robust hardware models.',
    deliverables: ['Industrial Grade Prototype / Core Codebase', 'Plagiarism-free 80-page Report (IEEE structure)', '3D Enclosures / Mechanical Models', '1-on-1 Mentoring & Code Walkthroughs'],
    icon: Laptop
  },
  {
    id: 'ieee-proj',
    category: 'Projects',
    title: 'IEEE Projects',
    desc: 'Recreation and enhancement of recent IEEE publications in machine learning, signal processing, and cryptography.',
    details: 'Translate complex mathematical models and research algorithms from journals into working practical implementations.',
    deliverables: ['Implemented Code matching Research papers', 'Comparative Analysis Plots & Graph Reports', 'Original IEEE Paper Reference Log', 'Algorithm Explanation Reports'],
    icon: BookOpen
  },

  // Category 2: Coding & Tech Domains
  {
    id: 'iot-proj',
    category: 'Domains',
    title: 'IoT Projects',
    desc: 'Smart connected nodes using ESP32, Raspberry Pi, LoRaWAN, and cloud dashboards (ThingsSpeak, AWS, Firebase).',
    details: 'Integrate real sensors, relays, solar trackers, and wireless antennas to compile true telemetry records.',
    deliverables: ['Firmware Code (C++/MicroPython)', 'Circuit Schematic Layout (EAGLE/EasyEDA)', 'Cloud Dashboard Setup API Access', 'Sensors Calibration Guides'],
    icon: Cpu
  },
  {
    id: 'embedded-systems',
    category: 'Domains',
    title: 'Embedded Systems',
    desc: 'Microcontroller programming (8051, AVR, PIC, STM32) using Embedded C and Assembly coding.',
    details: 'Bare-metal architecture firmware compiling register overrides, interrupt configurations, and ADC telemetry reads.',
    deliverables: ['Embedded C source code (Keil/MPLAB)', 'Hardware Simulation (Proteus files)', 'PCB Layout Design files', 'Detailed Pinout mappings'],
    icon: Terminal
  },
  {
    id: 'python-proj',
    category: 'Domains',
    title: 'Python Projects',
    desc: 'Data analytics, image filters, computer vision script arrays, and Streamlit dashboards.',
    details: 'Build lightweight, modern data analysis apps using Pandas, NumPy, OpenCV, and Flask libraries.',
    deliverables: ['Clean, commented Python codebase', 'Requirements text & config environments setup', 'Data analytics charts & metrics', 'Local deployment scripts'],
    icon: Code
  },
  {
    id: 'java-proj',
    category: 'Domains',
    title: 'Java Projects',
    desc: 'Enterprise console interfaces, Spring Boot REST APIs, and database structures using MySQL or PostgreSQL.',
    details: 'Enterprise scale designs showing Model-View-Controller layers and secure entity authentications.',
    deliverables: ['MVC Architecture Java code (Maven/Gradle)', 'SQL Database Schema dump', 'REST API documentation (Swagger layout)', 'JUnit Testing testcases'],
    icon: Database
  },
  {
    id: 'ai-ml',
    category: 'Domains',
    title: 'AI & Machine Learning',
    desc: 'Deep learning classification models, CNNs for medical imaging, and prediction pipelines.',
    details: 'Train, validate, and compile predictive algorithms utilizing TensorFlow, Keras, and Scikit-Learn libraries.',
    deliverables: ['Jupyter Notebooks (IPYNB) with markdown logs', 'Dataset sourcing details', 'Model Training accuracy graphs', 'Model Deployment (Flask/API) code'],
    icon: Brain
  },
  {
    id: 'web-dev',
    category: 'Domains',
    title: 'Web Development',
    desc: 'Premium full-stack web applications using React.js, Next.js, Express, Node, and Tailwind CSS.',
    details: 'Modern responsive interfaces styled with state management and API connections.',
    deliverables: ['Production-ready Frontend and Backend directories', 'Tailwind custom layouts', 'MongoDB Atlas database configuration', 'Deployment guides (Vercel/Render)'],
    icon: Globe
  },
  {
    id: 'android-dev',
    category: 'Domains',
    title: 'Android App Development',
    desc: 'Mobile applications built with Flutter or native Kotlin, integrated with maps, cameras, and databases.',
    details: 'User friendly interfaces connecting to Firebase databases and location sensors.',
    deliverables: ['Flutter/Kotlin source code', 'Signed APK file for evaluation', 'Firebase rules configurations', 'Mobile responsive UI wireframes'],
    icon: Smartphone
  },

  // Category 3: Support & Artifacts
  {
    id: 'documentation',
    category: 'Support',
    title: 'Documentation Support',
    desc: 'Formatting final year academic project files matching University and VTU template layouts.',
    details: 'Polishing layout sections like Abstract, Literature Survey, Methodology, Design, Results, and Future Scope.',
    deliverables: ['Word Document (.docx) formatting', 'Index pages, lists of tables and figures', 'Latex compilation assistance', 'Grammar and formatting audit'],
    icon: FileText
  },
  {
    id: 'project-reports',
    category: 'Support',
    title: 'Project Reports',
    desc: 'Comprehensive academic project report writing following IEEE styles and citation frameworks.',
    details: 'Plagiarism-checked report structures with detailed explanation sections for block diagrams and results.',
    deliverables: ['Complete 70+ Page Report (Ready to Bind)', 'Reference Citations (Mendeley/Zotero formats)', 'Plagiarism audit certificates', 'Flowchart and block diagram files'],
    icon: FileText
  },
  {
    id: 'ppt-creation',
    category: 'Support',
    title: 'PPT Creation',
    desc: 'High end presentation decks detailing the architecture, block structures, code files, and results.',
    details: 'Professional PPT layouts built using vectors and slide structures to impress external evaluating panels.',
    deliverables: ['25-Slide PowerPoint Presentation (.pptx)', 'Presenter speaker notes and cue lines', 'Embedded project demo videos', 'Editable diagram slides'],
    icon: BarChart3
  },
  {
    id: 'internships',
    category: 'Support',
    title: 'Technical Internships',
    desc: 'Structured domain programs with certificate letters, logbooks, and final app portfolios.',
    details: 'Build and deploy a real project under consultant reviews while logging regular progress.',
    deliverables: ['Internship Sponsoring & Completion letters', 'Daily/Weekly Intern logbook notes', 'Mentored project model code', 'Review sign-off logs'],
    icon: UserCheck
  },
  {
    id: 'technical-workshops',
    category: 'Support',
    title: 'Technical Workshops',
    desc: 'Hands-on bootcamp programs in web dev, IoT systems, embedded coding, and data analytics.',
    details: 'Intense training bootcamps equipped with online IDE sandboxes and digital certificate downloads.',
    deliverables: ['E-Certificates of Participation', 'Coding resources and cheat sheets', 'Access to live lecture recordings', 'Post-workshop task worksheets'],
    icon: BookOpen
  },
  {
    id: 'presentation-training',
    category: 'Support',
    title: 'Presentation Training',
    desc: 'Mock reviews, QA rehearsals, and defense training sessions to clear university panels.',
    details: 'Rehearse presenting your slides and code architecture. We train you on common panel questions.',
    deliverables: ['2 Live Mock Review presentation rounds', 'Common Panel Questions cheat sheet', 'Body language & presentation coaching', 'Project Defense Strategy tips'],
    icon: BarChart3
  },
  {
    id: 'technical-support',
    category: 'Support',
    title: 'Technical Support',
    desc: 'Troubleshooting hardware compilation, software dependency conflicts, and database connections.',
    details: 'Get live support from our consultants via Zoom, AnyDesk, or in-lab visits for hardware debugging.',
    deliverables: ['Hardware troubleshooting checks', 'Dependency installations & config fixes', 'Code testing verification runs', '15 days post-delivery support'],
    icon: HelpCircle
  },
  {
    id: 'ats-resume',
    category: 'Support',
    title: 'ATS-Friendly Resume Building',
    desc: 'Crafting premium, ATS-compliant resumes tailored to grab recruiters\' attention in the tech industry.',
    details: 'Our expert team builds industry-standard resumes optimized for Applicant Tracking Systems, ensuring high scan rates.',
    deliverables: ['ATS-optimized PDF resume', 'Editable source file (.docx)', 'LinkedIn Profile audit tips', 'Custom cover letter template'],
    icon: FileText
  },
  {
    id: 'resume-writing',
    category: 'Support',
    title: 'Resume & Document Writing',
    desc: 'Professional drafting of technical resumes, SOPs, LORs, and academic profiles.',
    details: 'Tailor-made academic and professional documents highlighting technical project achievements and core capabilities.',
    deliverables: ['Plagiarism-free document drafts', 'Formatted structural resume', 'SOP / LOR reference templates', 'Two revision rounds'],
    icon: FileText
  },
  {
    id: 'ppt-design',
    category: 'Support',
    title: 'PPT Presentation Design',
    desc: 'Visually stunning, high-converting slide decks for project reviews, seminars, and technical pitches.',
    details: 'Design of clean and interactive presentation slides equipped with custom diagrams and architecture vector overlays.',
    deliverables: ['Fully editable PowerPoint deck (.pptx)', 'Presenter notes & slide cue scripts', 'Custom graphics & vector flowcharts'],
    icon: BarChart3
  },
  {
    id: 'doc-services',
    category: 'Support',
    title: 'Documentation Services',
    desc: 'Comprehensive project report layout formatting and technical chapter compiling.',
    details: 'End-to-end support compiling literature surveys, methodologies, system design components, and output analysis.',
    deliverables: ['Complete academic-ready doc files', 'Formatted index & table of figures', 'Latex structure conversion help'],
    icon: FileText
  },
  {
    id: 'doc-prep',
    category: 'Support',
    title: 'Document Preparation',
    desc: 'Polishing and validating academic papers, synopses, and project proposal drafts.',
    details: 'Strict formatting adjustments to align with IEEE, VTU, or custom college template instructions.',
    deliverables: ['Fully compliant formatted synopses', 'Reference list citation formatting', 'Grammar & plagiarism audit logs'],
    icon: FileText
  }
];

export default function Services() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);

  const MAIN_SERVICES_IDS = ['engg-proj', 'web-dev', 'documentation', 'project-reports', 'ppt-creation'];
  const displayedServices = SERVICES_DATA.filter(s => MAIN_SERVICES_IDS.includes(s.id));

  const handleRegisterRedirect = (serviceTitle) => {
    // Navigate to registration page with selected service interest pre-selected
    router.push(`/register?interest=${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto space-y-16">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] right-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* ---------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gradient">
          Our Specializations & Services
        </h1>
        <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans">
          Explore our suite of academic and technical solutions. We cover everything from hardware circuit assemblies to software deployments, and detailed reporting documentation.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SERVICES GRID */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedServices.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.div
              layout
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-3xl glass-premium flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-accent/10 flex items-center justify-center text-blue-accent group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xl font-display font-bold">{service.title}</h3>
                <p className="text-sm text-foreground/75 font-sans leading-relaxed line-clamp-3">
                  {service.desc}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-card-border/40">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-bold text-blue-accent hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => handleRegisterRedirect(service.title)}
                  className="px-4 py-2 rounded-xl text-xs font-bold glass border border-card-border group-hover:bg-blue-accent group-hover:text-white transition-all duration-300"
                >
                  Enquire Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* LEARN MORE OVERLAY MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            {/* Modal content body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-premium text-foreground max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-xl glass hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-card-border cursor-pointer focus:outline-none"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-accent/10 flex items-center justify-center text-blue-accent">
                  {React.createElement(selectedService.icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">{selectedService.title}</h2>
                  <span className="text-xs uppercase tracking-wider text-blue-accent font-sans font-semibold">
                    {selectedService.category === 'Projects' ? 'Academic Program' : selectedService.category === 'Domains' ? 'Coding Tech Focus' : 'Documentation Support'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 font-sans">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {selectedService.details}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold tracking-wide uppercase text-foreground/80">
                    What we deliver in this package:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/75">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-card-border/60">
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold glass border border-card-border hover:bg-card-border/40 transition-all cursor-pointer"
                >
                  Close Info
                </button>
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    handleRegisterRedirect(title);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-accent blue-gradient hover:opacity-95 hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Apply For This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
