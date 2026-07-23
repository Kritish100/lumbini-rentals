"use client";

import React from "react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./ui/icons";

interface OurSocialsProps {
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
}

export default function OurSocials({ forwardedRef }: OurSocialsProps) {
  const socials = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: "https://facebook.com/primerentals",
      bgStyle: "bg-[#1877F2] text-white p-5",
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(24,119,242,0.6)]",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: "https://tiktok.com/@primerentals",
      bgStyle: "bg-[#000000] text-white p-5",
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(37,244,238,0.4)]",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      url: "https://instagram.com/primerentals",
      // Fixed: Multi-stop gradient directly in Tailwind mapping out Yellow -> Pink -> Purple
      bgStyle:
        "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-[22px]",
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(238,42,123,0.5)]",
    },
  ];

  return (
    <div
      className="py-16 px-6 bg-slate-50 border-t border-slate-200"
      ref={forwardedRef}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            Connect With Us
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Follow us for real-time room availability, premium apartment
            walk-throughs, and updates.
          </p>
        </div>

        {/* Social Icons Grid */}
        <div className="flex items-center justify-center gap-8 max-w-2xl mx-auto">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                title={social.name}
                className={`relative flex items-center justify-center transition-all duration-300 hover:-translate-y-2 active:scale-95 cursor-pointer rounded-2xl w-[84px] h-[84px] shadow-sm border border-slate-100/50 ${social.bgStyle} ${social.hoverShadow}`}
              >
                {/* Icons will render cleanly and match in visual weight */}
                <Icon className="w-full h-full object-contain" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
