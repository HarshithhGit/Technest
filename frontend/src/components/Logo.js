import React from 'react';
import Image from 'next/image';

export default function Logo({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg bg-black cursor-pointer -mt-5
         ${className}`}
    >
      <Image
        src="/logo.jpeg"
        alt="TechNest Projects"
        width={56}
        height={56}
        priority
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}