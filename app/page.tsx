'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, RefreshCw, Layers } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import AdvancedFilters from '@/components/AdvancedFilters'
import PropertyCard, { type Property } from '@/components/PropertyCard'
import PropertyDetailSheet from '@/components/PropertyDetailSheet'
import ListYourProperty from '@/components/ListYourProperty'
import OurSocials from '@/components/OurSocials'
import ClientTestimonials from '@/components/ClientTestimonials'
import Footer from '@/components/Footer'
import { SAMPLE_PROPERTIES } from './data'

function PropertyDiscoveryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listPropertyRef = useRef<HTMLDivElement>(null)
  const ourSocialsRef = useRef<HTMLDivElement>(null)
  const clientTestimonialsRef = useRef<HTMLDivElement>(null)

  // Sync state cleanly from Next.js routing parameters
  const activePropertyId = searchParams.get('view')

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(
    SAMPLE_PROPERTIES.filter((p) => p.category === 'Residential')
  )
  const [sort, setSort] = useState<'price-low' | 'price-high' | 'newest'>('newest')
  const [city, setCity] = useState('All')
  const [propertyCategory, setPropertyCategory] = useState<'Residential' | 'Commercial'>('Residential')
  const [type, setType] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const applyFilters = (
    sortVal?: typeof sort,
    cityVal?: string,
    categoryVal?: typeof propertyCategory,
    typeVal?: string,
  ) => {
    const currentSort = sortVal ?? sort
    const currentCity = cityVal ?? city
    const currentCategory = categoryVal ?? propertyCategory
    const currentType = typeVal ?? type

    let filtered = [...SAMPLE_PROPERTIES]

    // Apply category filter
    filtered = filtered.filter((prop) => prop.category === currentCategory)

    // Apply city filter
    if (currentCity !== 'All') {
      filtered = filtered.filter((prop) => prop.area === currentCity)
    }

    // Apply type filter
    if (currentType !== 'All') {
      filtered = filtered.filter((prop) => prop.type === currentType)
    }

    // Apply sorting
    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    }

    setFilteredProperties(filtered)
  }

  const handleSortChange = (newSort: typeof sort) => {
    setSort(newSort)
    applyFilters(newSort, city, propertyCategory, type)
  }

  const handleCityChange = (newCity: string) => {
    setCity(newCity)
    applyFilters(sort, newCity, propertyCategory, type)
  }

  const handlePropertyCategoryChange = (category: 'Residential' | 'Commercial') => {
    setPropertyCategory(category)
    setType('All')
    applyFilters(sort, city, category, 'All')
  }

  const handleTypeChange = (newType: string) => {
    setType(newType)
    applyFilters(sort, city, propertyCategory, newType)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  // Clear all configurations back to standard default view
  const handleResetFilters = () => {
    setSort('newest')
    setCity('All')
    setPropertyCategory('Residential')
    setType('All')
    
    // Directly re-apply the structural defaults
    let defaultProperties = SAMPLE_PROPERTIES.filter(p => p.category === 'Residential')
    setFilteredProperties(defaultProperties)
  }

  const handleListPropertyClick = () => {
    listPropertyRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHeroSocials = () => {
    ourSocialsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHeroTestimonials = () => {
    clientTestimonialsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Router Interaction Triggers: Update address query parameter state
  const handleOpenPropertyDetail = (id: string) => {
    router.push(`?view=${id}`, { scroll: false })
  }

  const handleClosePropertyDetail = () => {
    router.push('/', { scroll: false })
  }

  // IMPORTANT FIX: Scan master data arrays directly for dynamic URL shares!
  const activeProperty = SAMPLE_PROPERTIES.find((p) => p.id === activePropertyId) || null

  // Check if any filters are customized away from the baseline state
  const isFiltered = city !== 'All' || type !== 'All' || sort !== 'newest' || propertyCategory !== 'Residential'

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Banner */}
      <HeroBanner 
        onListPropertyClick={handleListPropertyClick} 
        onSocialsClick={handleHeroSocials}
        onTestimonialsClick={handleHeroTestimonials}
      />

      {/* Advanced Filters */}
      <AdvancedFilters 
        onSortChange={handleSortChange}
        onCityChange={handleCityChange}
        onPropertyCategoryChange={handlePropertyCategoryChange}
        onTypeChange={handleTypeChange}
        onViewModeChange={handleViewModeChange}
      />

      {/* Properties Feed Marketplace Container */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* SUMMARY AREA */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
            <SlidersHorizontal size={16} className="text-slate-400 mr-1" />
            <span className="text-slate-700 font-semibold">Showing results for:</span>
            
            {/* Category Tag (Deep Corporate Blue Frame) */}
            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              {propertyCategory}
            </span>

            {/* City Tag */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              city !== 'All' 
                ? 'bg-orange-50 text-orange-600 border border-orange-100 shadow-sm shadow-orange-500/5' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {city === 'All' ? 'All Cities' : city}
            </span>

            {/* Type Specific Tag */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              type !== 'All' 
                ? 'bg-orange-50 text-orange-600 border border-orange-100 shadow-sm shadow-orange-500/5' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {type === 'All' ? `All types` : type}
            </span>

            {/* Sorting Info Tag */}
            <span className="bg-slate-50 text-slate-400 text-xs font-normal px-2.5 py-1 rounded-md italic border border-slate-100">
              Sorted by: {sort === 'newest' ? 'Newest First' : sort === 'price-low' ? 'Lowest Price' : 'Highest Price'}
            </span>
          </div>

          {/* Results Count & Action Link */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Layers size={13} className="text-slate-400" />
              <span>{filteredProperties.length} Matches Found</span>
            </div>
            {isFiltered && (
              <button 
                onClick={handleResetFilters}
                className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-600 font-bold tracking-wide uppercase transition-all duration-200 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-orange-100"
              >
                <RefreshCw size={12} className="animate-hover" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Displaying Layout Grid/List Content */}
        {filteredProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onClick={() => handleOpenPropertyDetail(property.id)}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onClick={() => handleOpenPropertyDetail(property.id)}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-lg font-medium">
              No properties found matching your filters.
            </p>
            <button 
              onClick={handleResetFilters}
              className="mt-3 cursor-pointer inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md hover:bg-orange-500 transition-all duration-200"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </section>

      {/* Property Detail Sheet */}
      <PropertyDetailSheet 
        property={activeProperty} 
        isOpen={activePropertyId !== null && activeProperty !== null} 
        onClose={handleClosePropertyDetail} 
      />

      {/* List Your Property Section */}
      <ListYourProperty forwardedRef={listPropertyRef} />

      {/* Our Socials Section */}
      <OurSocials forwardedRef={ourSocialsRef} />

      {/* Client Testimonials Section */}
      <ClientTestimonials forwardedRef={clientTestimonialsRef} />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function PropertyDiscoveryApp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin text-orange-500" size={32} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Marketplace...</p>
        </div>
      </div>
    }>
      <PropertyDiscoveryContent />
    </Suspense>
  )
}