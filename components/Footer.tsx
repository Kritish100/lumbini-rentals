'use client'

import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Optional Micro-CTA integrated right above the footer floor */}
      <div className="max-w-6xl mx-auto px-6 py-10 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-white font-semibold text-lg">
            Looking for an ideal rental property?
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Browse our verified rooms, flats, and commercial spaces across Bhairahawa & Butwal.
          </p>
        </div>
        <button
          onClick={handleScrollToTop}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm shadow-orange-600/10 active:scale-95"
        >
          View Listings
        </button>
      </div>

      {/* Main Footer Copyright Floor */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium tracking-wide">
        <div className="flex items-center gap-2">
          {/* Text branding aligned with your local identity */}
          <span className="text-white font-bold text-sm tracking-normal">
            Lumbini<span className="text-orange-500">Rentals</span>
          </span>
          <span className="text-slate-600">|</span>
          <p>© {currentYear} All rights reserved.</p>
        </div>

        {/* Essential Navigation and Trust Links */}
        <div className="flex items-center gap-6">
          <a 
            href="#listings" 
            onClick={handleScrollToTop}
            className="hover:text-white transition-colors duration-200"
          >
            Back to Top
          </a>
          <span className="text-slate-800">•</span>
          <span className="text-slate-500 cursor-not-allowed">Privacy Policy</span>
          <span className="text-slate-500 cursor-not-allowed">Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}