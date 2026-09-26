"use client";

import SliderImg1 from "@/app/assets/images/laptop-slider.jpg";
import SliderImg2 from "@/app/assets/images/furniture-slider.jpeg";
import SliderImg3 from "@/app/assets/images/shirt-slider.jpg";
import SliderImg4 from "@/app/assets/images/shoes-slider.jpeg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  isPreview?: boolean;
}

const HeroSection = ({ isPreview = false }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderData = [
    {
      image: SliderImg1,
      title: "🇮🇳 Grand Indian Festival Sale",
      subtitle: "Up to 70% off on Smartphones, Audio & Smart Electronics",
      ctaText: "Shop Tech Deals",
      ctaLink: "/shop",
      badge: "Festival Special",
    },
    {
      image: SliderImg3,
      title: "✨ Royal Ethnic & Modern Fashion",
      subtitle: "Handcrafted Kurtas, Pure Silk Sarees & Trending Indian Wear",
      ctaText: "Explore Fashion",
      ctaLink: "/shop",
      badge: "Trending Indian Wear",
    },
    {
      image: SliderImg2,
      title: "🏠 Premium Kitchen & Home Care",
      subtitle: "Smart induction cooktops, appliances & modern essentials",
      ctaText: "Shop Home",
      ctaLink: "/shop",
      badge: "Top Rated",
    },
    {
      image: SliderImg4,
      title: "🚀 Fast Express Delivery Across Bharat",
      subtitle: "Free shipping on orders above ₹499 · 100% Genuine Stock",
      ctaText: "Order Now",
      ctaLink: "/shop",
      badge: "Lightning Fast",
    },
  ];

  useEffect(() => {
    if (!isPreview) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === sliderData.length - 1 ? 0 : prev + 1
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPreview, sliderData.length]);

  const nextSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === sliderData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sliderData.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const currentSlide = sliderData[currentImageIndex];

  return (
    <section
      className={`relative w-full ${
        isPreview ? "scale-90 my-2" : "my-2 sm:my-4 lg:my-6"
      }`}
    >
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10 glass-card">
        {/* Hero Image Slider */}
        <div className="relative w-full">
          <div className="aspect-[16/9] sm:aspect-[16/7] lg:aspect-[16/6] w-full relative">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-2xl">
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-500/20 backdrop-blur-md text-amber-300 px-3 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-5 border border-amber-500/30"
                      >
                        <Sparkles size={14} className="text-amber-400" />
                        <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                          {currentSlide.badge}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight tracking-tight"
                      >
                        {currentSlide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm sm:text-base lg:text-lg text-slate-200 mb-6 sm:mb-8 max-w-lg leading-relaxed"
                      >
                        {currentSlide.subtitle}
                      </motion.p>

                      {/* CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          href={currentSlide.ctaLink}
                          className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 text-sm sm:text-base active:scale-95"
                        >
                          <ShoppingBag size={18} />
                          {currentSlide.ctaText}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-amber-400 scale-125 shadow-lg shadow-amber-400/50"
                  : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
