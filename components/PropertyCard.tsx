'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Car, MapPin, Layers, Tag } from 'lucide-react'
import Image from 'next/image'

export interface Property {
  id: string
  uniqueId: string
  isFeatured: boolean
  price: number
  discountPrice?: number // Ensures the 1st Month Offer triggers smoothly
  type: string
  category: 'Residential' | 'Commercial'
  location: string
  area: string
  images: string[]
  beds: number
  baths: number
  hasParking: boolean
  parkingType?: 'Bikes Only' | 'Bikes & Cars'
  floorLevel?: string
  squareFootage?: number
  waterType: string
  waterIncluded: boolean
  electricityMeterType: 'Individual' | 'Shared' | 'Separate' | 'Sub-Meter'
  bathroomType: 'Attached' | 'Shared'
  furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished'
  description: string
  hasVideo: boolean
  comments: number
  availabilityStatus?: 'Available Now' | 'Moving Out Soon' | 'Rented'
  idealFor?: string
}

interface PropertyCardProps {
  property: Property
  onClick: () => void
  viewMode?: 'grid' | 'list'
}

export default function PropertyCard({
  property,
  onClick,
  viewMode = 'grid',
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)

  if (!property) return null

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const getStatusBadgeConfig = () => {
    const status = property.availabilityStatus || 'Available Now'
    switch (status) {
      case 'Rented':
        return { 
          text: 'Rented', 
          classes: 'bg-slate-900/80 backdrop-blur-xs text-slate-200' 
        }
      case 'Moving Out Soon':
        return { 
          text: 'Moving Out Soon', 
          classes: 'bg-amber-600 text-white shadow-xs' 
        }
      case 'Available Now':
      default:
        return { 
          text: 'Available Now', 
          // Premium filled, high-contrast soft mint green styling
          classes: 'bg-emerald-600 text-white' 
        }
    }
  }

  const badge = getStatusBadgeConfig()
  
  const parkingLabel = !property.hasParking 
    ? 'No Parking' 
    : property.parkingType === 'Bikes Only' 
      ? 'Bikes Only' 
      : 'Bikes & Cars'

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : '/placeholder-property.jpg'

  // Safety fallback: If discountPrice isn't provided, we can simulate it or check for existence
  const hasDiscount = property.discountPrice !== undefined && property.discountPrice > 0
  const displayPrice = hasDiscount ? property.discountPrice! : property.price

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick} 
        className="flex gap-4 bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 p-4 cursor-pointer group"
      >
        {/* Image Frame Container */}
        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50">
          <Image 
            src={mainImage} 
            alt={property.type} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
            unoptimized 
          />
          
          {/* Top Shadow Protective Cover */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900/30 via-transparent to-transparent pointer-events-none z-5" />

          {/* Left-Aligned Availability Badge */}
          <div className="absolute top-2 left-2 z-10">
            <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide shadow-xs ${badge.classes}`}>
              {badge.text}
            </div>
          </div>

          {/* Right-Aligned 1st Month Offer Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10 bg-orange-600 text-white px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide shadow-xs flex items-center gap-0.5">
              <Tag size={9} className="fill-current" /> Active Offer
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-heading font-extrabold text-2xl text-slate-900">
                Rs {displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  Rs {property.price.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium">/month</span>
            </div>
            
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-0.5 group-hover:text-orange-500 transition-colors line-clamp-1">
              {property.type}
            </h3>
            
            <p className="flex items-center gap-1 text-sm text-slate-500 mb-2">
              <MapPin size={14} className="text-orange-500 flex-shrink-0" /> {property.location}
            </p>

            <div className="flex flex-wrap gap-1.5 items-center">
              {property.category === 'Residential' && (
                <>
                  {property.floorLevel && (
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Layers size={11} className="text-slate-400" /> {property.floorLevel}
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    property.hasParking ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Car size={12} /> {parkingLabel}
                  </span>
                </>
              )}
              {property.category === 'Commercial' && property.squareFootage && (
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                  {property.squareFootage.toLocaleString()} sq.ft.
                </span>
              )}
            </div>
          </div>

          {/* List Footer Data */}
          <div className="flex items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-50">
            {property.category === 'Residential' ? (
              <div className="flex gap-2.5 text-xs font-medium text-slate-400">
                <span>{property.beds} Beds</span>
                <span>•</span>
                <span>{property.baths} Baths</span>
              </div>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Commercial Space</span>
            )}
            
            <div className="ml-auto flex items-center gap-3.5">
              <button onClick={handleLikeClick} className="flex items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer text-slate-400 hover:text-red-500">
                <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : 'currentColor'} />
                <span className="text-xs font-medium text-slate-500">{likeCount}</span>
              </button>
              <span className="flex items-center gap-1 text-slate-400">
                <MessageCircle size={16} />
                <span className="text-xs font-medium text-slate-500">{property.comments}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // GRID VIEW (Default Layout)
  return (
    <div 
      onClick={onClick} 
      className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      {/* Media Window Box */}
      <div className="relative w-full pt-[70%] bg-slate-50 overflow-hidden flex-shrink-0">
        <Image 
          src={mainImage} 
          alt={property.type} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
          unoptimized 
        />

        {/* Top Shadow Protective Cover */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent pointer-events-none z-5" />

        {/* Left-Aligned Status Tag */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm ${badge.classes}`}>
            {badge.text}
          </div>
        </div>

        {/* Right-Aligned 1st Month Offer Tag (Styled with vibrant Brand Orange) */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10 bg-orange-600 text-white px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-0.5">
            <Tag size={9} className="fill-current" /> Active Offer
          </div>
        )}

        {/* Base Gradient Overlay with Price metrics */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent p-4 pt-10">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-extrabold text-xl text-white">
              Rs {displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-white/60 text-xs line-through font-normal">
                Rs {property.price.toLocaleString()}
              </span>
            )}
            <span className="text-white/80 text-xs font-normal">/month</span>
          </div>
        </div>
      </div>

      {/* Card Body Deck */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 mb-0.5 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {property.type}
          </h3>
          
          <p className="flex items-center gap-1 text-sm text-slate-500 mb-3">
            <MapPin size={14} className="text-orange-500 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>

          {/* Descriptive Badges Layout */}
          <div className="mb-4 flex flex-wrap gap-1.5 items-center">
            {property.category === 'Residential' && (
              <>
                {property.floorLevel && (
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Layers size={11} className="text-slate-400" /> {property.floorLevel}
                  </span>
                )}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                  property.hasParking ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Car size={12} /> {parkingLabel}
                </span>
              </>
            )}
            {property.category === 'Commercial' && property.squareFootage && (
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                {property.squareFootage.toLocaleString()} sq.ft.
              </span>
            )}
          </div>
        </div>

        {/* Footer Metrics Panel */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            {property.category === 'Residential' ? (
              <div className="flex gap-2 text-slate-400 font-medium">
                <span>{property.beds} Beds</span>
                <span>•</span>
                <span>{property.baths} Baths</span>
              </div>
            ) : (
              <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-600">Commercial</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLikeClick} className="cursor-pointer flex items-center gap-1 transition-all duration-200 hover:scale-110 text-slate-400 hover:text-red-500" >
              <Heart size={17} className={isLiked ? 'fill-red-500 text-red-500' : 'currentColor'} />
              <span className="text-xs font-medium text-slate-500">{likeCount}</span>
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              <MessageCircle size={16} />
              <span className="text-xs font-medium text-slate-500">{property.comments}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}