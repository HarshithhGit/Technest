'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Heart, Award, AwardIcon, CheckCircle2, User } from 'lucide-react';

export default function About() {
  const values = [
    { title: 'Industry-Grade Quality', desc: 'Every project circuit board, model report, and code script is crafted to match strict standard professional guidelines.', icon: ShieldCheck },
    { title: 'End-to-End Mentoring', desc: 'We do not just hand over the source code. Our team provides step-by-step presentation reviews and external viva training.', icon: Target },
    { title: 'Academic Authenticity', desc: 'Our document structures, synopses, and presentations are completely unique and free from plagiarism concerns.', icon: Award }
  ];

  const milestones = [
    { year: '2021', title: 'The Genesis', desc: 'TechNest Projects started as a small group of embedded research consultants guiding local final year students.' },
    { year: '2023', title: 'Expansion & Scale', desc: 'Launched fully equipped R&D laboratories in Bangalore specializing in machine learning and custom IoT hardware grids.' },
    { year: '2025', title: 'Global Reach', desc: 'Connected with over 5,000+ candidates across 50+ engineering colleges, delivering premium learning modules and workshops.' }
  ];

  const team = [
    { name: 'Dr. Srinivas Murthy', role: 'Founder & Academic Director', bio: 'Former R&D Head at Semiconductor labs, specializing in VLSI and Embedded Control logic.', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { name: 'Prof. Rajesh K.', role: 'Chief IoT R&D Consultant', bio: 'IoT firmware architect with 12+ years of hardware prototyping and circuit troubleshooting experience.', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
    { name: 'Ananya Deshpande', role: 'Head of Software Development', bio: 'Full-stack software engineer expert in machine learning, React, Next.js, and cloud database integrations.', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto space-y-24">
      {/* Glow Circles */}
      <div className="absolute top-[20%] left-[-15%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-15%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* ---------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-display font-extrabold text-gradient"
        >
          About TechNest Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans"
        >
          We are an educational technology solutions company helping undergraduate engineering, degree, and diploma students turn their innovative ideas into functional project configurations.
        </motion.p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* MISSION & VISION */}
      {/* ---------------------------------------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-8 rounded-3xl glass-premium space-y-4 relative"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-accent/15 flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold">Our Mission</h2>
          <p className="text-sm text-foreground/75 leading-relaxed font-sans">
            To bridge the gap between academic theory and practical engineering by providing candidates with real hardware workspaces, expert programming guidance, and transparent learning paths.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-8 rounded-3xl glass-premium space-y-4 relative"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-accent/15 flex items-center justify-center">
            <Eye className="w-6 h-6 text-blue-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold">Our Vision</h2>
          <p className="text-sm text-foreground/75 leading-relaxed font-sans">
            To emerge as India's leading R&D incubator for undergraduate project research, creating a community where learning is driven by hands-on experimentation, design models, and coding proficiency.
          </p>
        </motion.div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* WHY CHOOSE US */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold">Why Choose TechNest Projects</h2>
          <p className="text-sm text-foreground/70 font-sans">Our primary core pillars that differentiate us as a professional academic consultant.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                className="p-6 rounded-2xl glass border border-card-border space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-accent/10 flex items-center justify-center text-blue-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground">{val.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TIMELINE SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold">Our Journey Timeline</h2>
          <p className="text-sm text-foreground/70 font-sans">Key milestones achieved along our path of educational innovation.</p>
        </div>

        <div className="relative border-l border-card-border ml-4 md:ml-0 md:grid md:grid-cols-3 md:gap-8 md:border-l-0 md:border-t md:pt-8 md:space-y-0 space-y-8 pl-6 md:pl-0">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative md:text-center space-y-2">
              {/* Timeline indicator circle */}
              <div className="absolute top-1 left-[-31px] md:top-[-41px] md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-blue-accent border-4 border-background z-10" />
              <span className="text-3xl font-display font-extrabold text-blue-accent">{milestone.year}</span>
              <h4 className="font-display font-bold text-lg">{milestone.title}</h4>
              <p className="text-xs sm:text-sm text-foreground/75 font-sans leading-relaxed md:max-w-xs md:mx-auto">
                {milestone.desc}
              </p>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
}
