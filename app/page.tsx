'use client'

import { useState, useRef } from 'react'
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

  return (
    <div className="min-h-screen bg-white">
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

      {/* Properties Feed */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
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
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No properties found matching your filters.
            </p>
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
