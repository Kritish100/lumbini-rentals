"use client";

import { Eye, ImageIcon, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import { PublicProperty } from "@/app/types";

interface PropertyCardProps {
  property: PublicProperty;
  onClick: () => void;
  viewMode?: "grid" | "list";
}

export default function PropertyCard({
  property,
  onClick,
  viewMode = "grid",
}: PropertyCardProps) {
  if (!property) return null;

  const getStatusBadgeConfig = () => {
    const status = property.status || "available";
    switch (status) {
      case "booked":
        return { text: "Booked", classes: "bg-amber-600 text-white shadow-xs" };
      case "on hold":
        return {
          text: "On Hold",
          classes: "bg-amber-600 text-white shadow-xs",
        };
      case "available":
      default:
        return { text: "Available", classes: "bg-emerald-600 text-white" };
    }
  };

  const badge = getStatusBadgeConfig();
  const parkingLabel =
    property.specifications?.parking || property.specifications?.Parking
      ? "Parking"
      : "No Parking";
  const mainImage = "/placeholder-property.jpg";
  const isNegotiable = property.isNegotiable;
  const displayPrice = property.price;

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="relative flex gap-4 bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 p-4 cursor-pointer group"
      >
        {/* Image Frame Container (Clean, no absolute overlays inside anymore) */}
        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50">
          <Image
            src={mainImage}
            alt={property.type}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900/10 via-transparent to-transparent pointer-events-none z-5" />
        </div>

        {/* Details Panel */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="font-heading font-extrabold text-2xl text-slate-900">
                  Rs {displayPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  /month
                </span>
              </div>

              {/* Status Badge moved cleanly outside of the image layout frame */}
              <div
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide shadow-xs flex-shrink-0 ${badge.classes}`}
              >
                {badge.text}
              </div>
            </div>

            <h3 className="font-heading font-bold text-lg text-slate-900 mb-0.5 group-hover:text-orange-500 transition-colors line-clamp-1">
              {property.type}
            </h3>
            <p className="flex items-center gap-1 text-sm text-slate-500 mb-2">
              <MapPin size={14} className="text-orange-500 flex-shrink-0" />{" "}
              {property.location}, {property.subLocation || ""}
            </p>

            {/* Combined Badges row includes structural active offer badge */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {property.isOfferActive && (
                <span className="text-xs font-extrabold bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                  <Tag size={11} className="fill-current" /> Active Offer
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 bg-slate-100 text-slate-500`}
              >
                {parkingLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW (Default Layout)
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      {/* Media Window Box (Now just contains status tag on upper-right layout alignment safely) */}
      <div className="relative w-full pt-[70%] bg-slate-50 overflow-hidden flex-shrink-0">
        <Image
          src={mainImage}
          alt={property.type}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-900/30 via-transparent to-transparent pointer-events-none z-5" />

        {/* Only Availability Status remains, shifted securely to Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm ${badge.classes}`}
          >
            {badge.text}
          </div>
        </div>

        {/* Bottom pricing gradient stays structural */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent p-4 pt-10">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-extrabold text-xl text-white">
              Rs {displayPrice.toLocaleString()}
            </span>
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
            <span className="line-clamp-1">
              {property.location}, {property.subLocation || ""}
            </span>
          </p>

          {/* Descriptive Badges Stack Layout - Active Offer sits here now */}
          <div className="mb-4 flex flex-wrap gap-1.5 items-center">
            {property.isOfferActive && (
              <span className="text-[11px] font-extrabold bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                <Tag size={11} className="fill-current" /> Cashback Offer
              </span>
            )}
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 bg-slate-100 text-slate-500`}
            >
              {parkingLabel}
            </span>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
              Negotiable
            </span>
          </div>
        </div>

        {/* Footer Metrics Panel */}
        {/* <div className="flex gap-3 items-center justify-start text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Eye size={14} />{" "}
              <span className="text-xs font-medium text-slate-500">2</span>
            </span>
          </div>

          {!!property.assets.length && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <ImageIcon size={14} />
                <span className="text-xs font-medium text-slate-500">
                  {property.assets.length}
                </span>
              </span>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
