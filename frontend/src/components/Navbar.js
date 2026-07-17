'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { Menu, X, LogIn, User, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-background/80 backdrop-blur-md border-b border-card-border shadow-lg'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                  isActive(link.path)
                    ? 'text-blue-accent'
                    : 'text-foreground/80 hover:text-foreground hover:bg-card-border/30'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions: Theme + Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <DarkModeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold glass border border-card-border hover:bg-blue-accent/10 transition-all duration-300"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-accent" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600/10 hover:bg-rose-600 hover:text-white border border-rose-600/20 text-rose-500 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-foreground/95 hover:bg-card-border/30 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4 text-blue-accent" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-accent hover:opacity-90 hover:shadow-lg transition-all duration-300 blue-gradient"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-2">
            <DarkModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl glass border border-card-border text-foreground hover:bg-card-border/40 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[68px] z-40 bg-background/95 backdrop-blur-lg flex flex-col px-6 py-8 space-y-6 overflow-y-auto animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`py-3 px-4 rounded-xl text-base font-semibold border border-transparent transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-blue-accent/10 border-blue-accent/20 text-blue-accent'
                    : 'text-foreground/80 hover:bg-card-border/30 hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-card-border pt-6 flex flex-col space-y-3">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold glass border border-card-border text-blue-accent"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold bg-rose-600/10 border border-rose-600/20 text-rose-500 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout Account</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold glass border border-card-border"
                >
                  <LogIn className="w-5 h-5 text-blue-accent" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold text-white bg-blue-accent blue-gradient"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
