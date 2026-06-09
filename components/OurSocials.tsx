'use client'

import { Share2, Music, Bookmark } from 'lucide-react'

interface OurSocialsProps {
  forwardedRef?: React.RefObject<HTMLDivElement>
}

export default function OurSocials({ forwardedRef }: OurSocialsProps) {
  const socials = [
    {
      name: 'Instagram',
      icon: Share2,
      url: 'https://instagram.com/primerentals',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
    {
      name: 'TikTok',
      icon: Music,
      url: 'https://tiktok.com/@primerentals',
      color: 'from-black to-gray-800',
      bgColor: 'bg-gray-50',
    },
    {
      name: 'Facebook',
      icon: Bookmark,
      url: 'https://facebook.com/primerentals',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <div className="py-16 px-6 bg-white border-t border-gray-200" ref={forwardedRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            Our Socials
          </h2>
          <p className="text-lg text-gray-600">
            Follow us for updates, tips, and exclusive property listings
          </p>
        </div>

        {/* Social Icons Grid */}
        <div className="flex items-center justify-center gap-8 max-w-2xl mx-auto">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                title={social.name}
                className={`flex items-center justify-center p-6 bg-gradient-to-br ${social.color} rounded-2xl transition-smooth hover:shadow-lg hover:scale-110 cursor-pointer`}
              >
                <Icon size={40} className="text-white" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
