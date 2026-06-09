'use client'

import { useState } from 'react'
import { X, Heart, MessageCircle, Car, Droplet, Zap, Bath, Home, Send, Reply, Phone } from 'lucide-react'
import Image from 'next/image'
import { Property } from './PropertyCard'

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies: Comment[]
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
  const [showReplyBox, setShowReplyBox] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Rajesh K.',
      text: 'Great location and spacious rooms. Highly recommended!',
      timestamp: '2 hours ago',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          author: 'Property Owner',
          text: 'Thank you for your kind words! We look forward to helping you.',
          timestamp: '1 hour ago',
          likes: 2,
          isLiked: false,
          replies: [],
        },
      ],
    },
    {
      id: '2',
      author: 'Priya M.',
      text: 'Good amenities. Water supply is reliable.',
      timestamp: '5 hours ago',
      likes: 3,
      isLiked: false,
      replies: [],
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
          timestamp: 'now',
          likes: 0,
          isLiked: false,
          replies: [],
        },
        ...comments,
      ])
      setNewComment('')
    }
  }

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: `${commentId}-${Date.now()}`,
                  author: 'You',
                  text: replyText,
                  timestamp: 'now',
                  likes: 0,
                  isLiked: false,
                  replies: [],
                },
              ],
            }
          }
          return comment
        }),
      )
      setReplyText('')
      setShowReplyBox(null)
    }
  }

  const getParkingLabel = () => {
    if (!property.hasParking) return 'Parking: Unavailable'
    if (property.parkingType === 'Bikes Only') return 'Parking: Bikes Only'
    return 'Parking: Bikes & Cars'
  }

  const getUtilitiesLabel = () => {
    return property.waterIncluded
      ? 'Utilities: Included in Rent'
      : 'Utilities: Not Included in Rent'
  }

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${property.type} at ${property.location}. Please provide more details.`,
    )
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank')
  }

  const handlePhoneInquiry = () => {
    window.open(`tel:${PHONE_NUMBER.replace(/\s/g, '')}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto" onClick={onClose}>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="font-heading text-2xl font-bold text-gray-900">{property.type}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-smooth"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6 lg:p-8">
            {/* Responsive Layout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column: Media Carousel */}
              <div className="lg:col-span-2">
                {/* Main Image */}
                <div className="relative w-full pt-[75%] bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={property.images[currentImageIndex] || property.images[0]}
                    alt={property.type}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Thumbnails Row */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                        currentImageIndex === index
                          ? 'border-emerald-600'
                          : 'border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Key Property Details */}
              <div className="lg:col-span-1">
                {/* Price */}
                <div className="mb-6">
                  <p className="text-gray-600 text-sm font-medium mb-1">Monthly Rent</p>
                  <p className="font-heading text-4xl font-bold text-emerald-600">
                    Rs {property.price.toLocaleString()}
                  </p>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <p className="text-gray-600 text-sm font-medium mb-1">Location</p>
                  <p className="text-lg text-gray-900 font-semibold">{property.location}</p>
                </div>

                {/* Key Amenities */}
                <div className="space-y-3 mb-6">
                  {property.floorLevel && (
                    <div className="flex items-start gap-3">
                      <Home size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Floor Level</p>
                        <p className="font-semibold text-gray-900">{property.floorLevel}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Car size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{getParkingLabel()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Droplet size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{getUtilitiesLabel()}</p>
                    </div>
                  </div>
                </div>

                {/* Contact CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-lg transition-smooth hover:bg-[#20ba58] active:scale-95"
                  >
                    <MessageCircle size={18} />
                    Inquire on WhatsApp
                  </button>
                  <button
                    onClick={handlePhoneInquiry}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-smooth hover:bg-blue-700 active:scale-95"
                  >
                    <Phone size={18} />
                    Call {PHONE_NUMBER}
                  </button>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Home size={18} className="text-emerald-600" />
                    <span className="font-semibold text-gray-900">Type</span>
                  </div>
                  <p className="text-sm text-gray-600">{property.furnishingStatus}</p>
                </div>

                {property.category === 'Residential' && (
                  <>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Bath size={18} className="text-emerald-600" />
                        <span className="font-semibold text-gray-900">Bathroom</span>
                      </div>
                      <p className="text-sm text-gray-600">{property.bathroomType}</p>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={18} className="text-emerald-600" />
                        <span className="font-semibold text-gray-900">Electricity</span>
                      </div>
                      <p className="text-sm text-gray-600">{property.electricityMeterType}</p>
                    </div>
                  </>
                )}

                {property.category === 'Commercial' && property.squareFootage && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Home size={18} className="text-emerald-600" />
                      <span className="font-semibold text-gray-900">Area</span>
                    </div>
                    <p className="text-sm text-gray-600">{property.squareFootage.toLocaleString()} sq.ft.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Likes Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth hover:bg-gray-100"
              >
                <Heart
                  size={20}
                  className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
                <span className="font-semibold text-gray-700">{likeCount}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
              </h3>

              {/* Comment Input */}
              <div className="mb-8">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddComment()
                    }}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-smooth"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    {/* Parent Comment */}
                    <div className="flex gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900">{comment.author}</p>
                            <p className="text-xs text-gray-500">{comment.timestamp}</p>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-smooth"
                          >
                            <Heart
                              size={14}
                              className={
                                comment.isLiked
                                  ? 'fill-red-500 text-red-500'
                                  : ''
                              }
                            />
                            <span>{comment.likes}</span>
                          </button>
                          <button
                            onClick={() =>
                              setShowReplyBox(
                                showReplyBox === comment.id ? null : comment.id,
                              )
                            }
                            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-smooth"
                          >
                            <Reply size={14} />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reply Box */}
                    {showReplyBox === comment.id && (
                      <div className="ml-14 mb-4 flex gap-3">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter')
                              handleAddReply(comment.id)
                          }}
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-smooth"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-14 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-sm text-gray-900">
                                    {reply.author}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {reply.timestamp}
                                  </p>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.text}</p>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-xs">
                                <button
                                  onClick={() =>
                                    handleCommentLike(reply.id)
                                  }
                                  className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-smooth"
                                >
                                  <Heart
                                    size={12}
                                    className={
                                      reply.isLiked
                                        ? 'fill-red-500 text-red-500'
                                        : ''
                                    }
                                  />
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
