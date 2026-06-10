'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Play, Car, MapPin } from 'lucide-react'
import Image from 'next/image'

export interface Property {
  id: string
  uniqueId: string // e.g., "PR-104"
  isFeatured: boolean
  price: number
  type: string
  category: 'Residential' | 'Commercial'
  location: string
  area: string
  images: string[]
  videoUrl?: string
  beds: number
  baths: number
  hasParking: boolean
  parkingType?: 'Bikes Only' | 'Bikes & Cars'
  floorLevel?: string
  squareFootage?: number
  waterType: string
  waterIncluded: boolean
  electricityMeterType: 'Individual' | 'Shared'
  bathroomType: 'Attached' | 'Shared'
  furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished'
  description: string
  hasVideo: boolean
  comments: number
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
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex gap-4 bg-white rounded-xl card-shadow hover:shadow-lg hover:border-orange-200 border border-slate-100 transition-all duration-300 p-4 cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={property.images[0]}
            alt={property.type}
            fill
            className="object-cover"
            unoptimized
          />
          {property.hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]/40 group-hover:bg-[#1a1a2e]/50 transition-colors">
              <div className="bg-orange-500 p-2 rounded-full text-white shadow-md">
                <Play size={20} className="fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-heading font-extrabold text-2xl text-[#1a1a2e]">
                Rs {property.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/month</span>
            </div>
            
            <h3 className="font-heading font-bold text-lg text-[#1a1a2e] mb-1 hover:text-orange-500 transition-colors">
              {property.type}
            </h3>
            
            <p className="flex items-center gap-1 text-sm text-slate-600 mb-2">
              <MapPin size={14} className="text-orange-500" /> {property.location}
            </p>

            <div className="flex flex-wrap gap-1.5 items-center">
              {property.category === 'Residential' && (
                <>
                  {property.floorLevel && (
                    <span className="text-xs font-semibold text-[#1a1a2e] bg-slate-100 px-2 py-0.5 rounded">
                      {property.floorLevel}
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    property.hasParking ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Car size={12} /> 
                    {property.hasParking ? `${property.parkingType || 'Bikes & Cars'}` : 'No Parking'}
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

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-600 pt-2 border-t border-slate-50">
            {property.category === 'Residential' ? (
              <div className="flex gap-3 text-xs font-medium text-slate-500">
                <span>{property.beds} Beds</span>
                <span>•</span>
                <span>{property.baths} Baths</span>
              </div>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Commercial Space</span>
            )}
            
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer"
              >
                <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'} />
                <span className="text-xs font-medium text-slate-500">{likeCount}</span>
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle size={16} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">{property.comments}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // GRID VIEW (Default)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-xl border border-slate-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      {/* Image Container with Hover Video Flip */}
      <div className="relative w-full pt-[70%] bg-slate-100 overflow-hidden flex-shrink-0">
        {!isHovered ? (
          <Image
            src={property.images[0]}
            alt={property.type}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-500"
            unoptimized
          />
        ) : property.hasVideo ? (
          <div className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src={property.videoUrl || ''}
            />
            <div className="absolute bg-[#1a1a2e]/50 p-3 rounded-full backdrop-blur-xs pointer-events-none">
              <Play size={24} className="text-white fill-white animate-pulse" />
            </div>
          </div>
        ) : (
          <Image
            src={property.images[0]}
            alt={property.type}
            fill
            className="object-cover scale-105 transition-all duration-500"
            unoptimized
          />
        )}

        {/* Video Badge */}
        {property.hasVideo && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Play size={10} className="fill-current" /> Video Tour
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a1a2e]/80 via-[#1a1a2e]/40 to-transparent p-4 pt-10">
          <div className="flex items-baseline gap-1">
            <span className="font-heading font-extrabold text-xl text-white">
              Rs {property.price.toLocaleString()}
            </span>
            <span className="text-white/80 text-xs font-normal">/month</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Type and Location */}
          <h3 className="font-heading font-bold text-base text-[#1a1a2e] mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {property.type}
          </h3>
          <p className="flex items-center gap-1 text-sm text-slate-600 mb-3">
            <MapPin size={14} className="text-orange-500 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>

          {/* Badges Layout */}
          <div className="mb-4 flex flex-wrap gap-1.5 items-center">
            {property.category === 'Residential' && (
              <>
                {property.floorLevel && (
                  <span className="text-[11px] font-semibold text-[#1a1a2e] bg-slate-100 px-2 py-0.5 rounded">
                    {property.floorLevel}
                  </span>
                )}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                  property.hasParking ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Car size={12} />
                  {property.hasParking ? `${property.parkingType || 'Bikes & Cars'}` : 'No Parking'}
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

        {/* Meta Stats Footer */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div>
            {property.category === 'Residential' ? (
              <div className="flex gap-2 text-slate-500 font-medium">
                <span>{property.beds} Beds</span>
                <span>•</span>
                <span>{property.baths} Baths</span>
              </div>
            ) : (
              <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-600">Commercial</span>
            )}
          </div>

          {/* Interactive actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLikeClick}
              className="cursor-pointer flex items-center gap-1 transition-all duration-200 hover:scale-110 text-slate-500"
            >
              <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'} />
              <span className="text-xs font-medium">{likeCount}</span>
            </button>
            <span className="flex items-center gap-1 text-slate-500">
              <MessageCircle size={16} className="text-slate-400" />
              <span className="text-xs font-medium">{property.comments}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}