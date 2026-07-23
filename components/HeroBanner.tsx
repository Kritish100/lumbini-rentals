"use client";

import { Users, Upload, BadgeCheck } from "lucide-react";
interface HeroBannerProps {
  onListPropertyClick: () => void;
  onSocialsClick: () => void;
  onTestimonialsClick: () => void;
}

export default function HeroBanner({
  onListPropertyClick,
  onSocialsClick,
  onTestimonialsClick,
}: HeroBannerProps) {
  // High-quality modern bright interior/exterior image
  const bgImageUrl =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

  return (
    <div
      className="relative bg-cover bg-center py-28 px-6 overflow-hidden min-h-[500px] flex items-center"
      style={{ backgroundImage: `url('${bgImageUrl}')` }}
    >
      {/* LIGHT MODE OVERLAY:
        Replaced the slate-950 dark layer with a beautiful, clean white/slate-100 overlay gradient.
        This washes the photo in a bright light while retaining the home image faintly in the background.
      */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/90 to-slate-50/20 z-0" />

      {/* Main Container Content */}
      <div className="relative max-w-6xl mx-auto z-10 w-full">
        {/* Logo and Tagline Layer */}
        <div className="mb-8">
          <h1
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-3 text-balance tracking-tight flex items-center flex-wrap gap-2"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
          >
            {/* Your original Dark Blue & Orange logo asset stands out perfectly here 
              without any shadows or containers!
            */}
            <img
              src="/lumbini-rentals-48x48.png"
              height={56}
              width={56}
              alt="Lumbini Rentals"
              className="inline-block mr-2 object-contain"
            />
            <span>Lumbini</span>
            <span className="text-orange-500">Rentals</span>
          </h1>

          {/* Vibrant Orange Tagline matching your branding accents */}
          <p className="text-slate-700 font-normal tracking-wider text-sm md:text-base uppercase italic pl-1">
            Property rental made easy
          </p>
        </div>

        {/* Hero Text Body (Changed text from slate-200 to slate-600 for sharp reading contrast) */}
        <p className="text-lg md:text-xl text-slate-600 mb-10 text-balance max-w-2xl leading-relaxed font-normal">
          Looking to rent a property? We provide premium, fully verified spaces
          from Bhairahawa to Butwal. 100% inspected, direct landlords.
        </p>

        {/* Call to Action Button Array */}
        <div className="flex flex-wrap gap-4">
          {/* Main Orange Primary Action CTA */}
          <button
            onClick={onListPropertyClick}
            className="cursor-pointer flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-600/10 transition-all duration-300 hover:shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 active:scale-95"
          >
            <Upload size={20} className="stroke-[2.5]" />
            List Your Property
          </button>

          {/* Socials Action - Styled to blend smoothly on light backgrounds */}
          <button
            onClick={onSocialsClick}
            className="cursor-pointer flex items-center gap-2 px-7 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-sm transition-all duration-300 hover:bg-slate-200/80 active:scale-95"
          >
            <BadgeCheck size={20} />
            Connnect with us
          </button>

          {/* Testimonials Action - Styled to blend smoothly on light backgrounds */}
          <button
            onClick={onTestimonialsClick}
            className="cursor-pointer flex items-center gap-2 px-7 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-sm transition-all duration-300 hover:bg-slate-200/80 active:scale-95"
          >
            <Users size={20} />
            Client Testimonials
          </button>
        </div>
      </div>
    </div>
  );
}
