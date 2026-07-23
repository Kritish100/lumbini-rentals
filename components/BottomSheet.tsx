"use client";

import { PublicProperty } from "@/app/types";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Bed,
  Droplets,
  Car,
  Waves,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BottomSheetProps {
  property: PublicProperty | null;
  isOpen: boolean;
  onClose?: () => void;
}

export default function BottomSheet({
  property,
  isOpen,
  onClose,
}: BottomSheetProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  if (!property || !isOpen) return null;

  const images =
    property.assets.length > 0 ? property.assets : ["/placeholder.jpg"];
  const currentImage = images[carouselIndex];

  const handlePrevious = () => {
    setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the ${property.type} at ${property.location}. Please share more details.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Image Carousel */}
          <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
            {images.length > 0 && (
              <Image
                src={currentImage}
                alt={`${property.type} - ${carouselIndex + 1}`}
                fill
                className="object-cover"
              />
            )}

            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {carouselIndex + 1}/{images.length}
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6">
            {/* Price and Type */}
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                Rs. {property.price.toLocaleString()}/month
              </div>
              <div className="text-lg text-slate-600 mb-1">{property.type}</div>
              <div className="text-sm text-slate-500">{property.location}</div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Beds */}
              {/* <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl">
                <Bed className="text-slate-400 mb-2" size={24} />
                <div className="text-lg font-semibold text-slate-900">
                  {property.beds}
                </div>
                <div className="text-xs text-slate-500">
                  Bed{property.beds !== 1 ? "s" : ""}
                </div>
              </div> */}

              {/* Baths */}
              {/* <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl">
                <Droplets className="text-slate-400 mb-2" size={24} />
                <div className="text-lg font-semibold text-slate-900">
                  {property.baths}
                </div>
                <div className="text-xs text-slate-500">
                  Bath{property.baths !== 1 ? "s" : ""}
                </div>
              </div> */}

              {/* Parking */}
              <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl">
                <Car className="text-slate-400 mb-2" size={24} />
                <div className="text-lg font-semibold text-slate-900">
                  {property.specifications?.parking ||
                  property.specifications?.Parking
                    ? "Yes"
                    : "No"}
                </div>
                <div className="text-xs text-slate-500">Parking</div>
              </div>

              {/* Water */}
              {/* <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl">
                <Waves className="text-slate-400 mb-2" size={24} />
                <div className="text-lg font-semibold text-slate-900">
                  {property.waterType}
                </div>
                <div className="text-xs text-slate-500">Water</div>
              </div> */}
            </div>

            {/* Description */}
            {property.description && (
              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* WhatsApp CTA Button */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-4 rounded-xl hover:bg-[#20BA5A] transition-colors active:scale-95 duration-150"
            >
              <MessageCircle size={20} />
              Inquire on WhatsApp
            </button>

            {/* Spacer for bottom sheet scroll */}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </>
  );
}
