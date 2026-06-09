'use client'

import { Share2, Users, Upload } from 'lucide-react'

interface HeroBannerProps {
  onListPropertyClick: () => void
  onSocialsClick: () => void
  onTestimonialsClick: () => void
}

export default function HeroBanner({
  onListPropertyClick,
  onSocialsClick,
  onTestimonialsClick,
}: HeroBannerProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Brand Name with Tagline */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 text-balance tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
            Lumbini Rentals
          </h1>
          <p className="text-white/90 italic text-lg">
            Property rental made easy
          </p>
        </div>

        {/* Hero Copy */}
        <p className="text-lg text-white/90 mb-12 text-balance max-w-2xl leading-relaxed">
          Looking to rent a property? We provide high-quality and verified
          properties from Bhairahawa to Butwal.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onListPropertyClick}
            className="cursor-pointer flex items-center gap-2 px-7 py-3 bg-white text-emerald-600 font-semibold rounded-lg transition-smooth hover:shadow-lg hover:bg-emerald-50 active:scale-95"
          >
            <Upload size={20} />
            List Your Property
          </button>

          <button
            onClick={onSocialsClick}
            className="cursor-pointer flex items-center gap-2 px-7 py-3 bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-smooth hover:bg-white/30 active:scale-95"
          >
            <Share2 size={20} />
            Our Socials
          </button>

          <button
            onClick={onTestimonialsClick}
            className="cursor-pointer flex items-center gap-2 px-7 py-3 bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-smooth hover:bg-white/30 active:scale-95"
          >
            <Users size={20} />
            Client Testimonials
          </button>
        </div>
      </div>
    </div>
  )
}
