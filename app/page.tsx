"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RefreshCw, Layers } from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import AdvancedFilters from "@/components/AdvancedFilters";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailSheet from "@/components/PropertyDetailSheet";
import ListYourProperty from "@/components/ListYourProperty";
import OurSocials from "@/components/OurSocials";
import Footer from "@/components/Footer";
import { usePublicProperties } from "./hooks/usePublicProperties";
import { PublicProperty } from "./types";

function PropertyDiscoveryContent() {
  const searchParams = useSearchParams();
  const listPropertyRef = useRef<HTMLDivElement>(null);
  const ourSocialsRef = useRef<HTMLDivElement>(null);
  const clientTestimonialsRef = useRef<HTMLDivElement>(null);

  const { properties, isPropertiesLoading, error, refetchProperties } =
    usePublicProperties();

  const [filteredProperties, setFilteredProperties] = useState<
    PublicProperty[]
  >([]); // This is only to be updated by Advanced Filters

  // Filter
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [filterRender, setFilterRender] = useState(0); // trigger the re render of filters component
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  useEffect(() => {
    setActivePropertyId(searchParams.get("view") || null);
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Clear all configurations back to standard default view
  const handleResetFilters = () => {
    setFilterRender((prev) => prev + 1); // trigger the re render of Advanced Filters
  };

  const handleListPropertyClick = () => {
    listPropertyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroSocials = () => {
    ourSocialsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroTestimonials = () => {
    clientTestimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Router Interaction Triggers: Update address query parameter state
  const handleOpenPropertyDetail = (id: string) => {
    setActivePropertyId(id);
    window.history.pushState(null, "", `?view=${id}`);
  };

  const handleClosePropertyDetail = () => {
    setActivePropertyId(null);
    window.history.pushState(null, "", window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Banner */}
      <HeroBanner
        onListPropertyClick={handleListPropertyClick}
        onSocialsClick={handleHeroSocials}
        onTestimonialsClick={handleHeroTestimonials}
      />

      {/* Advanced Filters */}
      <AdvancedFilters
        renderKey={filterRender}
        properties={properties}
        setSelectedLocation={(value: string) => setSelectedLocation(value)}
        updateFilteredProperties={(values: PublicProperty[]) =>
          setFilteredProperties(values)
        }
        onViewModeChange={handleViewModeChange}
      />

      {/* Properties Feed Marketplace Container */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* SUMMARY AREA */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
            <SlidersHorizontal size={16} className="text-slate-400 mr-1" />
            <span className="text-slate-700 font-semibold">
              Showing results for:
            </span>

            {/* City Tag */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedLocation !== "all"
                  ? "bg-orange-50 text-orange-600 border border-orange-100 shadow-sm shadow-orange-500/5"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {selectedLocation === "all" ? "All Cities" : selectedLocation}
            </span>
          </div>

          {/* Results Count & Action Link */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <Layers size={13} className="text-slate-400" />
            <span>{filteredProperties.length} Matches Found</span>
          </div>
        </div>

        {/* Displaying Layout Grid/List Content */}
        {filteredProperties.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => handleOpenPropertyDetail(property.id)}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => handleOpenPropertyDetail(property.id)}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-lg font-medium">
              No properties found matching your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 cursor-pointer inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md hover:bg-orange-500 transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Property Detail Sheet */}
      <PropertyDetailSheet
        property={
          properties.find((i) => String(i.id) === String(activePropertyId)) ||
          null
        }
        isOpen={activePropertyId !== null}
        onClose={handleClosePropertyDetail}
      />

      {/* List Your Property Section */}
      <ListYourProperty forwardedRef={listPropertyRef} />

      {/* Our Socials Section */}
      <OurSocials forwardedRef={ourSocialsRef} />

      {/* Client Testimonials Section */}
      {/* <ClientTestimonials forwardedRef={clientTestimonialsRef} /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function PropertyDiscoveryApp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-orange-500" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading Marketplace...
            </p>
          </div>
        </div>
      }
    >
      <PropertyDiscoveryContent />
    </Suspense>
  );
}
