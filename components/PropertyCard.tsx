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

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex gap-4 bg-white rounded-xl card-shadow hover:card-shadow-hover transition-smooth p-4 cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={property.images[0]}
            alt={property.type}
            fill
            className="object-cover"
            unoptimized
          />
          {property.hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play size={32} className="text-white" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-heading font-bold text-2xl text-[#1a1a2e]">
                Rs {property.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-[#1a1a2e] mb-1">
              {property.type}
            </h3>
            <p className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin size={14} />
              {property.location}
            </p>
            {property.category === 'Residential' && (
              <>
                {property.floorLevel && (
                  <span className="inline-flex text-xs font-medium text-gray-700 px-2 py-1 mb-2">
                    {property.floorLevel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  <Car size={12} />
                  {property.hasParking
                    ? `Parking: ${property.parkingType || 'Bikes & Cars'}`
                    : 'Parking: Unavailable'}
                </span>
              </>
            )}
            {property.category === 'Commercial' && property.squareFootage && (
              <span className="inline-flex text-xs font-medium text-gray-700 px-2 py-1">
                {property.squareFootage.toLocaleString()} sq.ft.
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {property.category === 'Residential' ? (
              <>
                <span>{property.beds} Beds</span>
                <span>{property.baths} Baths</span>
              </>
            ) : (
              <span className="text-emerald-600 font-medium">Commercial</span>
            )}
            <span className="ml-auto flex items-center gap-4">
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 transition-smooth hover:scale-110"
              >
                <Heart
                  size={16}
                  className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
                <span className="text-xs">{likeCount}</span>
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle size={16} className="text-gray-400" />
                <span className="text-xs">{property.comments}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Grid View (default)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-smooth cursor-pointer group"
    >
      {/* Image Container with Hover Video Flip */}
      <div className="relative w-full pt-[75%] bg-gray-200 overflow-hidden">
        {!isHovered ? (
          <Image
            src={property.images[0]}
            alt={property.type}
            fill
            className="object-cover group-hover:scale-105 transition-smooth duration-300"
            unoptimized
          />
        ) : property.hasVideo ? (
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              src={property.videoUrl || ''}
            />
            <Play
              size={48}
              className="text-white/50 absolute"
              strokeWidth={1}
            />
          </div>
        ) : (
          <Image
            src={property.images[0]}
            alt={property.type}
            fill
            className="object-cover scale-105"
            unoptimized
          />
        )}

        {/* Video Badge */}
        {property.hasVideo && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Play size={12} />
            Video
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="font-heading font-bold text-xl text-white">
            Rs {property.price.toLocaleString()}
          </span>
          <p className="text-white/80 text-xs">per month</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Type and Location */}
        <h3 className="font-heading font-semibold text-base text-[#1a1a2e] mb-1 line-clamp-1">
          {property.type}
        </h3>
        <p className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin size={14} />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        {/* Property Details */}
        {property.category === 'Residential' && (
          <>
            {property.floorLevel && (
              <p className="text-xs text-gray-600 mb-2">{property.floorLevel}</p>
            )}
            <div className="mb-3 inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <Car size={12} />
              {property.hasParking
                ? `Parking: ${property.parkingType || 'Bikes & Cars'}`
                : 'Parking: Unavailable'}
            </div>
          </>
        )}
        {property.category === 'Commercial' && property.squareFootage && (
          <p className="text-xs font-medium text-emerald-600 mb-3">
            {property.squareFootage.toLocaleString()} sq.ft.
          </p>
        )}

        {/* Meta Stats */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
          <div className="flex gap-3">
            {property.category === 'Residential' ? (
              <>
                <span>{property.beds} Beds</span>
                <span>{property.baths} Baths</span>
              </>
            ) : (
              <span className="font-medium text-emerald-600">Commercial</span>
            )}
          </div>

          {/* Like and Comment Buttons */}
          <div className="">
            <button
              onClick={handleLikeClick}
              className="cursor-pointer flex items-center gap-1 transition-smooth hover:scale-110"
            >
              <Heart
                size={20}
                className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
              <span className="text-xs">{likeCount}</span>
            </button>
            {/* <span className="flex items-center gap-1">
              <MessageCircle size={14} className="text-gray-400" />
              <span className="text-xs">{property.comments}</span>
            </span> */}
          </div>
        </div>
      </div>
    </div>
  )
}
