'use client'

import { useState } from 'react'
import { X, Heart, MessageCircle, Car, Zap, Bath, Home, Send, Phone, MapPin, CheckCircle2, Tag, Layers, Gift } from 'lucide-react'
import Image from 'next/image'
import { Property as BaseProperty } from './PropertyCard'

export interface Property extends BaseProperty {
  availabilityStatus?: 'Available Now' | 'Moving Out Soon' | 'Rented';
  idealFor?: string;
}

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface PropertyDetailSheetProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
}

const PHONE_NUMBER = '+977 1234567890'

export default function PropertyDetailSheet({
  property,
  isOpen,
  onClose,
}: PropertyDetailSheetProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 20)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Rajesh K.',
      text: 'Great location and spacious rooms. Highly recommended!',
      timestamp: '2 hours ago',
      likes: 5,
      isLiked: false,
    },
    {
      id: '2',
      author: 'Priya M.',
      text: 'Good amenities. Water supply is highly reliable in this sector.',
      timestamp: '5 hours ago',
      likes: 3,
      isLiked: false,
    },
  ])

  if (!isOpen || !property) return null

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        return comment
      }),
    )
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        {
          id: Date.now().toString(),
          author: 'You',
          text: newComment,
          timestamp: 'Just now',
          likes: 0,
          isLiked: false,
        },
        ...comments,
      ])
      setNewComment('')
    }
  }

  const getParkingLabel = () => {
    if (!property.hasParking) return 'Parking Unavailable'
    if (property.parkingType === 'Bikes Only') return 'Bikes Only'
    return 'Bikes & Cars'
  }

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${property.type} at ${property.location} (Ref ID: ${property.uniqueId}). Please provide more details.`,
    )
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank')
  }

  const handlePhoneInquiry = () => {
    window.open(`tel:${PHONE_NUMBER.replace(/\s/g, '')}`)
  }

  const hasDiscount = property.discountPrice !== undefined && property.discountPrice > 0
  const savingsAmount = hasDiscount ? property.price - property.discountPrice! : 0

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 overflow-y-auto backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col" onClick={(e) => e.stopPropagation()} >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-2xl font-bold text-slate-900">{property.type}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Layout Context */}
        <div className="p-6 lg:p-8 overflow-y-auto space-y-8">
          {/* Main Visual & Info Grid Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT COLUMN: Media Showcase */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative w-full pt-[68%] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                <Image src={property.images[currentImageIndex] || property.images[0]} alt={property.type} fill className="object-cover" unoptimized />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {property.images.map((image, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${ currentImageIndex === index ? 'border-orange-500 scale-95' : 'border-slate-200 hover:border-slate-400' }`} >
                    <Image src={image} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Right Content Panel (Keeps CTA elements easily reachable) */}
            <div className="lg:col-span-1 flex flex-col justify-between bg-slate-50/40 border border-slate-100 rounded-xl p-5 min-h-[360px]">
              <div className="space-y-5">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Monthly Rent</p>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <p className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
                      Rs {property.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/month</span>
                    </p>
                    {/* Clean, professional Negotiable badge */}
                    <span className="inline-flex items-center bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-200">
                      Negotiable
                    </span>

                    {/* Brand Orange 1st Month Offer Badge */}
                      {hasDiscount && (
                        <span className="inline-flex items-center bg-orange-500 text-white font-bold tracking-wide text-[10px] px-2 py-0.5 rounded-md border border-orange-500">
                          1st Month Offer
                        </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-base text-slate-800 font-bold flex items-center gap-1.5 leading-tight">
                    <MapPin size={16} className="text-orange-500 flex-shrink-0" /> {property.location}
                  </p>
                </div>
                {/* Sub-Header Area: Clear, readable sizes */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-sm">
                    <Tag size={16} className="text-slate-400 flex-shrink-0" />
                    <p className="text-slate-600 font-semibold"> Ref ID: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs ml-1">{property.uniqueId}</span> </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-slate-400 flex-shrink-0" />
                    <p className="text-slate-600 font-semibold"> Status: <span className="font-bold text-emerald-600 ml-1">{property.availabilityStatus || 'Available Now'}</span> </p>
                  </div>
                  {property.floorLevel && (
                    <div className="flex items-center gap-3 text-sm">
                      <Layers size={16} className="text-slate-400 flex-shrink-0" />
                      <p className="text-slate-600 font-semibold"> Elevation: <span className="font-bold text-slate-800 ml-1">{property.floorLevel}</span> </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Group */}
              <div className="space-y-2.5 mt-6">
                <button onClick={handleWhatsAppInquiry} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:bg-[#20ba58] active:scale-95 shadow-xs" >
                  <MessageCircle size={16} className="fill-current" /> Inquire on WhatsApp
                </button>
                <button onClick={handlePhoneInquiry} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:bg-slate-800 active:scale-95 shadow-xs" >
                  <Phone size={16} /> Call {PHONE_NUMBER}
                </button>
              </div>
            </div>
          </div>

          {/* Option 2 Implementation: Full-Width Special Incentive Ribbon Box */}
          {hasDiscount && (
            <div className="w-full bg-orange-50/70 border border-orange-100 rounded-xl p-4 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="bg-orange-500 text-white p-2.5 rounded-lg flex-shrink-0 shadow-xs">
                <Gift size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-extrabold text-orange-600 uppercase tracking-wide">
                  Active Offer
                </h4>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  An active <b>10% move-in discount</b> is applied to your first month's rent for this property.
                </p>
              </div>
            </div>
          )}

          {/* Description Block */}
          <div className="pt-2">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-2.5">Property Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* SPECIFICATIONS SECTION */}
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border transition-colors ${ property.furnishingStatus && property.furnishingStatus !== 'Unfurnished' ? 'bg-amber-50/80 border-amber-200/80 shadow-xs' : 'bg-slate-50 border-slate-100' }`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Furnishing</span>
                <p className="text-sm font-bold text-slate-800">{property.furnishingStatus}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Parking Facilities</span>
                <p className="text-sm font-semibold text-slate-800">{getParkingLabel()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ideal For</span>
                <p className="text-sm font-semibold text-slate-800">{property.idealFor || (property.category === 'Commercial' ? 'Offices / Showrooms' : 'Families / Students')}</p>
              </div>
              {property.category === 'Residential' && (
                <>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bathroom Setup</span>
                    <p className="text-sm font-semibold text-slate-800">{property.bathroomType}</p>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors ${ property.electricityMeterType === 'Separate' || property.electricityMeterType === 'Sub-Meter' ? 'bg-amber-50/80 border-amber-200/80 shadow-xs' : 'bg-slate-50 border-slate-100' }`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Electricity Allocation</span>
                    <p className="text-sm font-bold text-slate-800">{property.electricityMeterType}</p>
                  </div>
                </>
              )}
              {property.category === 'Commercial' && property.squareFootage && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Usable Area</span>
                  <p className="text-sm font-semibold text-slate-800">{property.squareFootage.toLocaleString()} sq.ft.</p>
                </div>
              )}
            </div>
          </div>

          {/* Social Interactions Bar */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button onClick={handleLike} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all group duration-200" >
              <Heart size={17} className={`transition-transform duration-200 group-hover:scale-110 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-600">{likeCount} Likes</span>
            </button>
          </div>

          {/* Flat Verified Reviews Stream */}
          <div className="pt-2">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4"> Comments ({comments.length}) </h3>
            <div className="mb-6 flex gap-3">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-400 shadow-inner" onKeyPress={(e) => { if (e.key === 'Enter') handleAddComment() }} />
              <button onClick={handleAddComment} className="px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center flex-shrink-0" >
                <Send size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 bg-slate-50/60 border border-slate-100 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs text-slate-600 flex items-center justify-center flex-shrink-0 uppercase">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-slate-800">{comment.author}</p>
                      <p className="text-[11px] font-medium text-slate-400">{comment.timestamp}</p>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                    <div className="pt-1">
                      <button onClick={() => handleCommentLike(comment.id)} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors" >
                        <Heart size={13} className={comment.isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'} /> <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}