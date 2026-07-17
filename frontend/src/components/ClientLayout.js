'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Define routes where we want to suppress the default marketing header and footer
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      
      {/* 
        Inject top padding on marketing pages to clear the fixed navbar.
        No top padding on dashboards for clean flush heights.
      */}
      <main className={!isDashboardRoute ? 'pt-[68px] min-h-[80vh]' : 'min-h-screen'}>
        {children}
      </main>

      {!isDashboardRoute && <Footer />}

      {/* Floating WhatsApp Quick-Action Button */}
      {!isDashboardRoute && (
        <a
          href="https://wa.me/918217060575?text=Hello%20TechNest%20Projects,%20I'm%20interested%20in%20learning%20more%20about%20your%20services!"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 hover:scale-110 active:scale-95 shadow-2xl transition-all duration-300 text-white cursor-pointer group flex items-center gap-2"
          aria-label="Chat on WhatsApp"
        >
          {/* WhatsApp icon */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.994 9.994 0 004.773 1.212h.005c5.506 0 9.989-4.478 9.99-9.984a9.979 9.979 0 00-2.927-7.07 9.957 9.957 0 00-7.072-2.917zm0 1.662c4.59 0 8.324 3.731 8.325 8.324a8.312 8.312 0 01-2.446 5.897 8.293 8.293 0 01-5.898 2.44h-.004a8.274 8.274 0 01-4.22-1.157l-.302-.18-3.136.82.836-3.048-.198-.316a8.28 8.28 0 01-1.28-4.383c0-4.59 3.731-8.324 8.324-8.324zm-3.55 4.6c-.234-.527-.48-.538-.703-.548l-.597-.008c-.206 0-.544.077-.828.388-.284.31-.1.08-.284 1.135-.828.983-1.808 1.936-2.73 2.76-.922.825-1.688 1.704-1.688 1.704s.052.284.258.62c.206.335.597.98 1.185 1.498.85.748 1.573 1.135 2.115 1.34.542.206 1.032.18 1.418.125.43-.062 1.317-.542 1.503-1.063.186-.52.186-.967.13-1.063-.057-.097-.206-.155-.433-.27s-1.317-.65-1.517-.723c-.201-.073-.346-.109-.49.11s-.56.723-.687.873c-.126.15-.254.167-.48.052-.228-.114-.96-.354-1.83-1.13-.674-.6-1.13-1.34-1.26-1.57-.13-.23-.014-.354.1-.468.103-.1.228-.27.34-.4.114-.135.15-.23.228-.383.077-.155.038-.29-.02-.4-.056-.114-.48-1.16-.658-1.59z" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-sm font-bold">
            Chat on WhatsApp
          </span>
        </a>
      )}
    </>
  );
}
