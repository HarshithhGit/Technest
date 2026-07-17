'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { 
  Play, Eye, Image as ImageIcon, Sparkles, 
  X, ChevronLeft, ChevronRight, HelpCircle 
} from 'lucide-react';

const FILTER_TYPES = ['All', 'Workshop', 'Project'];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const response = await api.get('/public/gallery');
        const imgItems = response.data.filter(item => item.type === 'Workshop' || item.type === 'Project');
        setGalleryItems(imgItems);
        setFilteredItems(imgItems);
      } catch (error) {
        console.warn('API gallery offline, using mock items fallback.');
        const mockGallery = [
          { _id: '2', title: 'IoT Project Setup Board Showcase', type: 'Project', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', caption: 'ESP32 microchip testing board hooked up with environmental air sensors.' },
          { _id: '3', title: 'Online React JS Live Session Screen', type: 'Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', caption: 'Explaining state and component lifecycle hooks during React masterclass.' },
          { _id: '6', title: 'TechNest Embedded Workshop Demo', type: 'Workshop', url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800', caption: 'Hardware debugging session with DSO and Logic Analyzer.' }
        ];
        setGalleryItems(mockGallery);
        setFilteredItems(mockGallery);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filter logic
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => item.type === activeFilter));
    }
  }, [activeFilter, galleryItems]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = () => {
    setLightboxIndex(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setLightboxIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto space-y-12">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] right-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-accent/5 blur-[120px] pointer-events-none -z-10" />

      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gradient">
          Event & Project Gallery
        </h1>
        <p className="text-foreground/75 leading-relaxed text-sm sm:text-base font-sans">
          Browse visual logs from our college events, hands-on hardware assemblies, and online coding bootcamp workshops.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* FILTER BUTTONS */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-wrap gap-2 justify-center">
        {FILTER_TYPES.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              closeLightbox(); // Close if open
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeFilter === filter
                ? 'bg-blue-accent text-white blue-gradient shadow-md'
                : 'text-foreground/80 hover:text-foreground hover:bg-card-border/30 glass border border-card-border/50'
            }`}
          >
            {filter === 'All' ? 'All Media' : filter + 's'}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* MASONRY-STYLE GRID LAYOUT */}
      {/* ---------------------------------------------------- */}
      {loading ? (
        <div className="py-24 text-center text-sm text-foreground/60 font-sans">Loading gallery logs...</div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center glass border border-card-border rounded-3xl max-w-md mx-auto space-y-3 font-sans">
          <HelpCircle className="w-10 h-10 text-blue-accent/40 mx-auto" />
          <h3 className="text-lg font-bold">No Media Found</h3>
          <p className="text-xs text-foreground/70">No photos or videos logged in this category.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid rounded-2xl glass-premium overflow-hidden group cursor-pointer border border-card-border/60 relative shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Media image */}
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 max-h-[400px]"
                loading="lazy"
              />

              {/* Hover overlay description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white font-sans">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full w-max mb-2">
                  {item.type}
                </span>
                <h3 className="text-sm font-bold line-clamp-1">{item.title}</h3>
                <p className="text-[11px] opacity-80 line-clamp-2 mt-1 leading-normal">
                  {item.caption}
                </p>
                
                <div className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md text-white">
                  {item.type === 'Video' ? (
                    <Play className="w-4 h-4 fill-current text-white" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* LIGHTBOX SLIDER MODAL */}
      {/* ---------------------------------------------------- */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between py-6 px-4 font-sans select-none">
          {/* Close trigger */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-rose-600 border border-white/10 text-white transition-all cursor-pointer focus:outline-none z-[110]"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white z-[110] cursor-pointer focus:outline-none transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white z-[110] cursor-pointer focus:outline-none transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image display */}
          <div className="flex-1 flex items-center justify-center max-w-4xl max-h-[70vh] w-full pt-12">
            <img
              src={filteredItems[lightboxIndex].url}
              alt={filteredItems[lightboxIndex].title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Bottom Captions */}
          <div className="max-w-2xl text-center space-y-2 text-white px-6 mt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
              {filteredItems[lightboxIndex].type}
            </span>
            <h3 className="text-lg font-bold">{filteredItems[lightboxIndex].title}</h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              {filteredItems[lightboxIndex].caption}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
