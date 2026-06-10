'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest'

interface ClientTestimonialsProps {
  forwardedRef?: React.RefObject<HTMLDivElement>
}

export default function ClientTestimonials({ forwardedRef }: ClientTestimonialsProps) {
  // Corrected brand data details across the boilerplate array strings
  const allReviews: Review[] = [
    {
      id: '1',
      author: 'Rajesh Kumar',
      rating: 5,
      text: 'Outstanding service! Found my perfect flat in Bhairahawa within a week. The team was very helpful and professional.',
      date: '2026-04-15',
    },
    {
      id: '2',
      author: 'Priya Sharma',
      rating: 5,
      text: "Best rental platform I've used in the Butwal area. Verified properties and completely transparent pricing. Highly recommended!",
      date: '2026-04-10',
    },
    {
      id: '3',
      author: 'Amit Patel',
      rating: 4,
      text: 'Good experience overall. Property quality is excellent but finding a commercial space took slightly longer.',
      date: '2026-03-25',
    },
    {
      id: '4',
      author: 'Neha Singh',
      rating: 5,
      text: 'Lumbini Rentals made renting completely hassle-free. The filtering options are fantastic for finding single rooms. Will use again!',
      date: '2026-03-18',
    },
    {
      id: '5',
      author: 'Sanjay Kumar',
      rating: 4,
      text: 'Great selection of rooms and apartments. Quick response via WhatsApp from the team. Very satisfied.',
      date: '2026-03-02',
    },
    {
      id: '6',
      author: 'Meera Gupta',
      rating: 5,
      text: 'Customer support was exceptional. They helped me through every step of renting an entire home.',
      date: '2026-02-15',
    },
    {
      id: '7',
      author: 'Vikram Singh',
      rating: 4,
      text: 'Good platform, local listings are very accurate. Decent experience booking my BHK flat.',
      date: '2026-02-10',
    },
    {
      id: '8',
      author: 'Aisha Thapa',
      rating: 5,
      text: 'Amazing experience renting through Lumbini Rentals. Very transparent, local, and professional team!',
      date: '2026-01-20',
    },
  ]

  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 3

  const getSortedReviews = () => {
    let sorted = [...allReviews]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating)
        break
    }
    return sorted
  }

  const sortedReviews = getSortedReviews()
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage)
  const startIdx = (currentPage - 1) * reviewsPerPage
  const endIdx = startIdx + reviewsPerPage
  const currentReviews = sortedReviews.slice(startIdx, endIdx)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const renderPageButtons = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    return pages
  }

  return (
    // Replaced emerald background with a clean, trustworthy slate mesh
    <div className="py-16 px-6 bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200" ref={forwardedRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {/* Main Title aligned with your Deep Dark Blue authority style */}
          <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            What our satisfied customers are saying about renting with Lumbini Rentals
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="mb-8 flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption)
              setCurrentPage(1)
            }}
            // Shifted interactive ring focus states to match your Orange accent profile
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Rating - Using your official vibrant orange accent for star selections */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-slate-200'
                    }
                  />
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-slate-700 text-sm leading-relaxed mb-4 min-h-[72px]">
                "{review.text}"
              </p>
              
              {/* Author and Date */}
              <div className="border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900 text-sm">
                  {review.author}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              currentPage === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-orange-600'
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {renderPageButtons().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                // Active configuration swaps directly to your energetic corporate brand Orange
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 text-sm ${
                  currentPage === page
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-orange-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              currentPage === totalPages
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-orange-600'
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-6 text-xs font-medium text-slate-400 uppercase tracking-wider">
          Showing {startIdx + 1} to {Math.min(endIdx, sortedReviews.length)} of {sortedReviews.length} reviews
        </div>
      </div>
    </div>
  )
}