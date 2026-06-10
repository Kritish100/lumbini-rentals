'use client'

import { useState, useRef } from 'react'
import { SlidersHorizontal, RefreshCw, Layers } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import AdvancedFilters from '@/components/AdvancedFilters'
import PropertyCard, { type Property } from '@/components/PropertyCard'
import PropertyDetailSheet from '@/components/PropertyDetailSheet'
import ListYourProperty from '@/components/ListYourProperty'
import OurSocials from '@/components/OurSocials'
import ClientTestimonials from '@/components/ClientTestimonials'

// Enhanced Sample property data with all fields
const SAMPLE_PROPERTIES: Property[] = [
  {
    id: '1',
    uniqueId: 'PR-101',
    isFeatured: true,
    price: 8500,
    type: '2BHK Flat',
    category: 'Residential' as const,
    location: 'Yogikuti, Butwal',
    area: 'Butwal',
    floorLevel: '2nd Floor',
    parkingType: 'Bikes & Cars',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1516455207990-7a41e440d268?w=600&h=450&fit=crop',
    ],
    videoUrl: 'https://media.w3.org/2016/12/sample.mp4',
    beds: 2,
    baths: 1,
    hasParking: true,
    waterType: '24/7',
    waterIncluded: true,
    electricityMeterType: 'Individual',
    bathroomType: 'Attached',
    furnishingStatus: 'Semi-Furnished',
    description: 'Spacious 2BHK flat with modern amenities, located in a prime area with easy access to markets and transportation. Recently renovated with premium finishings.',
    hasVideo: true,
    comments: 12,
  },
  {
    id: '2',
    uniqueId: 'PR-102',
    isFeatured: false,
    price: 5500,
    type: '1BHK Flat',
    category: 'Residential' as const,
    location: 'Bhairahawa City',
    area: 'Bhairahawa',
    floorLevel: 'Ground Floor',
    parkingType: 'Bikes Only',
    images: [
      'https://images.unsplash.com/photo-1542718323-2f41cc844e5e?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
    ],
    beds: 1,
    baths: 1,
    hasParking: false,
    waterType: 'Alternate Days',
    waterIncluded: true,
    electricityMeterType: 'Shared',
    bathroomType: 'Shared',
    furnishingStatus: 'Unfurnished',
    description: 'Cozy 1BHK flat perfect for couples or single professionals. Well-lit rooms with modern finishings and good cross-ventilation.',
    hasVideo: false,
    comments: 8,
  },
  {
    id: '3',
    uniqueId: 'PR-103',
    isFeatured: false,
    price: 3500,
    type: 'Single Room',
    category: 'Residential' as const,
    location: 'Yogikuti, Butwal',
    area: 'Butwal',
    floorLevel: '1st Floor',
    parkingType: 'Bikes Only',
    images: [
      'https://images.unsplash.com/photo-1634995066007-e60cf2b91bb3?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
    ],
    beds: 1,
    baths: 1,
    hasParking: false,
    waterType: '24/7',
    waterIncluded: true,
    electricityMeterType: 'Individual',
    bathroomType: 'Attached',
    furnishingStatus: 'Furnished',
    description: 'Affordable single room with attached bathroom and a small balcony. Ideal for students or job seekers. Building has good security.',
    hasVideo: true,
    comments: 6,
  },
  {
    id: '4',
    uniqueId: 'PR-104',
    isFeatured: true,
    price: 12000,
    type: '2BHK Flat',
    category: 'Residential' as const,
    location: 'Main Road, Butwal',
    area: 'Butwal',
    floorLevel: '3rd Floor',
    parkingType: 'Bikes & Cars',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1516455207990-7a41e440d268?w=600&h=450&fit=crop',
    ],
    videoUrl: 'https://media.w3.org/2016/12/sample.mp4',
    beds: 2,
    baths: 2,
    hasParking: true,
    waterType: '24/7',
    waterIncluded: true,
    electricityMeterType: 'Individual',
    bathroomType: 'Attached',
    furnishingStatus: 'Furnished',
    description: 'Luxury 2BHK flat with premium finishings and excellent ventilation. Close to all amenities including restaurants, shopping mall, and public transport.',
    hasVideo: true,
    comments: 18,
  },
  {
    id: '5',
    uniqueId: 'PR-105',
    isFeatured: false,
    price: 7000,
    type: 'Office Spaces',
    category: 'Commercial' as const,
    location: 'Market Square, Bhairahawa',
    area: 'Bhairahawa',
    images: [
      'https://images.unsplash.com/photo-1606126613408-eca07e646917?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
    ],
    beds: 0,
    baths: 1,
    hasParking: true,
    squareFootage: 1200,
    waterType: 'N/A',
    waterIncluded: false,
    electricityMeterType: 'Shared',
    bathroomType: 'Shared',
    furnishingStatus: 'Unfurnished',
    description: 'Prime commercial office space in busy market area. Perfect for retail or small business setup. High foot traffic area with excellent visibility.',
    hasVideo: false,
    comments: 5,
  },
  {
    id: '6',
    uniqueId: 'PR-106',
    isFeatured: false,
    price: 6500,
    type: '1BHK Flat',
    category: 'Residential' as const,
    location: 'Nepalgunj Road, Yogikuti',
    area: 'Yogikuti',
    floorLevel: '4th Floor',
    parkingType: 'Bikes & Cars',
    images: [
      'https://images.unsplash.com/photo-1512672015474-a64af1aa331c?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
    ],
    videoUrl: 'https://media.w3.org/2016/12/sample.mp4',
    beds: 1,
    baths: 1,
    hasParking: true,
    waterType: '24/7',
    waterIncluded: true,
    electricityMeterType: 'Individual',
    bathroomType: 'Attached',
    furnishingStatus: 'Semi-Furnished',
    description: 'Modern 1BHK with contemporary design. Located near college campus and shopping centers. Great locality with vibrant nightlife.',
    hasVideo: true,
    comments: 10,
  },
  {
    id: '7',
    uniqueId: 'PR-107',
    isFeatured: true,
    price: 15000,
    type: 'Commercial Building',
    category: 'Commercial' as const,
    location: 'Butwal Market, Butwal',
    area: 'Butwal',
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop',
    ],
    beds: 0,
    baths: 2,
    hasParking: true,
    squareFootage: 2500,
    waterType: '24/7',
    waterIncluded: false,
    electricityMeterType: 'Individual',
    bathroomType: 'Attached',
    furnishingStatus: 'Unfurnished',
    description: 'Modern commercial building with multiple floors. Ideal for corporate offices, educational institutions, or large retail operations. Near main commercial hub.',
    hasVideo: true,
    comments: 14,
  },
]

export default function PropertyDiscoveryApp() {
  const listPropertyRef = useRef<HTMLDivElement>(null)
  const ourSocialsRef = useRef<HTMLDivElement>(null)
  const clientTestimonialsRef = useRef<HTMLDivElement>(null)

  const [activePropertyId, setActivePropertyId] = useState<string | null>(null)
  const [filteredProperties, setFilteredProperties] = useState(SAMPLE_PROPERTIES)
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

  const activeProperty = filteredProperties.find((p) => p.id === activePropertyId) || null

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
        
        {/* BRAND NEW SUMMARY AREA: Placed elegantly at the top of the feed */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
            <SlidersHorizontal size={16} className="text-slate-400 mr-1" />
            <span className="text-slate-700 font-semibold">Showing results for:</span>
            
            {/* Category Tag (Deep Corporate Blue Frame) */}
            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              {propertyCategory}
            </span>

            {/* City Tag (Changes to Active Brand Orange when specified) */}
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
                  onClick={() => setActivePropertyId(property.id)}
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
                  onClick={() => setActivePropertyId(property.id)}
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
        isOpen={activePropertyId !== null}
        onClose={() => setActivePropertyId(null)}
      />

      {/* List Your Property Section */}
      <ListYourProperty forwardedRef={listPropertyRef} />

      {/* Our Socials Section */}
      <OurSocials forwardedRef={ourSocialsRef} />

      {/* Client Testimonials Section */}
      <ClientTestimonials forwardedRef={clientTestimonialsRef} />
    </div>
  )
}