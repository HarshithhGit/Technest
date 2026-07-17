import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Mail, Phone, MapPin, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-card-border bg-background/50 backdrop-blur-sm overflow-hidden">
      {/* Background ambient glow shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-accent/5 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-accent/5 blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Logo showText={true} />
            <p className="text-foreground/75 text-sm leading-relaxed font-sans mt-2">
              Turning Ideas into Successful Projects. We offer industry-standard technical solutions, academic project code guidance, internships, and workshops for engineering, degree, and diploma students.
            </p>
            {/* Floating Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.instagram.com/technest_projectz"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-card-border glass text-foreground/80 hover:text-blue-accent hover:border-blue-accent/40 transition-all duration-300 glow-on-hover"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/918217060575"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-card-border glass text-foreground/80 hover:text-emerald-500 hover:border-emerald-500/40 transition-all duration-300 glow-on-hover"
                aria-label="WhatsApp Chat"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:projectstechnest@gmail.com"
                className="p-2.5 rounded-xl border border-card-border glass text-foreground/80 hover:text-blue-accent hover:border-blue-accent/40 transition-all duration-300 glow-on-hover"
                aria-label="Email Us"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground tracking-wide mb-5">Quick Exploration</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Academic Home', path: '/' },
                { name: 'Our Genesis (About)', path: '/about' },
                { name: 'Interactive Services', path: '/services' },
                { name: 'Bootcamp Workshops', path: '/workshops' },
                { name: 'Photo & Video Gallery', path: '/gallery' },
                { name: 'Reach Us (Contact)', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-foreground/75 hover:text-blue-accent flex items-center gap-1 group transition-all duration-300">
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Programs */}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground tracking-wide mb-5">Premium Services</h3>
            <ul className="space-y-3 text-sm text-foreground/75">
              <li>Engineering Projects </li>
              <li>Technical Internships with Certificates</li>
              <li>Premium Project Documentation & PPT Reports</li>
              <li>1-on-1 Presentation Training & Support</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground tracking-wide mb-5">Get In Touch</h3>
            <ul className="space-y-4 text-sm text-foreground/85">
              <li className="flex items-start gap-2.5">
                <Phone className="w-5 h-5 text-blue-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:+918217060575" className="hover:text-blue-accent transition-colors">+91 8217060575</a>
                  <span className="text-xs text-foreground/60">(Support: Mon-Sat, 9AM - 8PM)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-5 h-5 text-blue-accent shrink-0 mt-0.5" />
                <a href="mailto:projectstechnest@gmail.com" className="hover:text-blue-accent transition-colors break-all">
                  projectstechnest@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-blue-accent shrink-0 mt-0.5" />
                <span>Bangalore, Karnataka, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider and Copyright */}
        <div className="mt-12 pt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/60">
          <p>© {currentYear} TechNest Projects. All Rights Reserved. Turning Ideas into Successful Projects.</p>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:text-blue-accent transition-colors">Admin Portal</Link>
            <span>•</span>
            <Link href="/register" className="hover:text-blue-accent transition-colors">Student Signup</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
