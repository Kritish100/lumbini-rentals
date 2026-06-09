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

export default function ClientTestimonials({ forwardedRef }: ClientTestimonialsProps  ) {
  const allReviews: Review[] = [
    {
      id: '1',
      author: 'Rajesh Kumar',
      rating: 5,
      text: 'Outstanding service! Found my perfect home within a week. The team was very helpful and professional.',
      date: '2024-12-15',
    },
    {
      id: '2',
      author: 'Priya Sharma',
      rating: 5,
      text: 'Best rental platform I\'ve used. Verified properties and transparent pricing. Highly recommended!',
      date: '2024-12-10',
    },
    {
      id: '3',
      author: 'Amit Patel',
      rating: 4,
      text: 'Good experience overall. Property quality is excellent but location took longer to find.',
      date: '2024-12-05',
    },
    {
      id: '4',
      author: 'Neha Singh',
      rating: 5,
      text: 'Lumbini Rentals made renting hassle-free. The filtering options are fantastic. Will use again!',
      date: '2024-11-28',
    },
    {
      id: '5',
      author: 'Sanjay Kumar',
      rating: 4,
      text: 'Great selection of properties. Quick response from landlords. Very satisfied.',
      date: '2024-11-20',
    },
    {
      id: '6',
      author: 'Meera Gupta',
      rating: 5,
      text: 'Customer support was exceptional. They helped me through every step of the rental process.',
      date: '2024-11-15',
    },
    {
      id: '7',
      author: 'Vikram Singh',
      rating: 3,
      text: 'Good platform but could improve the search filters. Overall decent experience.',
      date: '2024-11-10',
    },
    {
      id: '8',
      author: 'Aisha Patel',
      rating: 5,
      text: 'Amazing experience renting through Prime Rentals. Very transparent and professional team!',
      date: '2024-11-05',
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
    <div className="py-16 px-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-200" ref={forwardedRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-emerald-900 mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-emerald-700">
            What our satisfied customers are saying about Prime Rentals
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
            className="px-4 py-2 border border-emerald-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-smooth"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{review.text}"
              </p>

              {/* Author and Date */}
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900 text-sm">
                  {review.author}
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-smooth ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-emerald-600 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {renderPageButtons().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-smooth ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-600 border border-emerald-300 hover:bg-emerald-50'
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
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-smooth ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-emerald-600 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Showing {startIdx + 1} to {Math.min(endIdx, sortedReviews.length)} of{' '}
          {sortedReviews.length} reviews
        </div>
      </div>
    </div>
  )
}
