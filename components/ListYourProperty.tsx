"use client";

import { PHONE_NUMBER } from "@/app/data";
import { MessageCircle, Phone } from "lucide-react";

interface ListYourPropertyProps {
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ListYourProperty({
  forwardedRef,
}: ListYourPropertyProps) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi! I want to list my property on Lumbini Rentals.",
    );
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, "_blank");
  };

  const handlePhone = () => {
    window.open(`tel:${PHONE_NUMBER.replace(/\s/g, "")}`);
  };

  return (
    <div
      ref={forwardedRef}
      className="bg-gradient-to-br from-slate-50 to-blue-50/50 py-16 px-6 border-t border-slate-200"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {/* Main Title aligned with your Deep Dark Blue brand tone */}
          <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            List Your Property
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Reach thousands of potential tenants. Become a Lumbini Rentals
            partner and grow your rental business with us.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Native WhatsApp Green retained for instant platform recognition */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:bg-[#20ba58] active:scale-95"
          >
            <MessageCircle size={24} />
            Chat on WhatsApp
          </button>

          {/* Primary Phone CTA shifted to your signature Vibrant Orange */}
          <button
            onClick={handlePhone}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:bg-orange-700 active:scale-95"
          >
            <Phone size={24} />
            {PHONE_NUMBER}
          </button>
        </div>
      </div>
    </div>
  );
}
