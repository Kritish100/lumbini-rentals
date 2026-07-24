"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Grid3x3, List } from "lucide-react";
import {
  COMMERCIAL_PROPERTY_TYPES,
  LOCATIONS,
  PROPERTY_TYPES,
} from "@/app/data";
import { PublicProperty } from "@/app/types";

interface AdvancedFiltersProps {
  renderKey: number;
  properties: PublicProperty[];
  updateFilteredProperties: (items: PublicProperty[]) => void; // Parent State
  setSelectedLocation: (value: string) => void; // Parent State
  onViewModeChange: (mode: "grid" | "list") => void;
}

interface PropertyFilters {
  category: string;
  propertyType: string;
  location: string;
  sortOrder: string;
}

export default function AdvancedFilters({
  renderKey,
  properties,
  updateFilteredProperties,
  setSelectedLocation, // location update was needed in the parent
  onViewModeChange,
}: AdvancedFiltersProps) {
  const searchParams = useSearchParams();

  const DEFAULT_FILTERS: PropertyFilters = {
    category: searchParams.get("category") || "residential",
    propertyType: searchParams.get("propertyType") || "all",
    location: searchParams.get("location") || "all",
    sortOrder: searchParams.get("sortOrder") || "newest",
  };

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => {
    // if there is change in category: residential | commercial
    // then update the property type too
    if (key === "category") {
      if (filters.category !== value)
        setFilters((prev) => ({ ...prev, propertyType: "all", [key]: value }));
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Reset Filters
    if (renderKey !== 0)
      setFilters({
        category: "residential",
        location: "all",
        propertyType: "all",
        sortOrder: "newest",
      });
  }, [renderKey]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    Object.entries(filters).map(([key, value]) => {
      currentUrl.searchParams.set(key, value);
    });
    window.history.replaceState(null, "", currentUrl.toString());
  }, [filters]);

  useEffect(() => {
    let newList = [...properties];

    newList = newList.filter((prop) => {
      return prop.category.includes(filters.category);
    }); // Category

    newList = newList.filter((prop) => {
      if (filters.location === "all") return prop;
      else return prop.location === filters.location;
    }); // Location

    newList = newList.filter((prop) => {
      if (filters.propertyType === "all") return prop;
      else return prop.type === filters.propertyType;
    }); // Property Type

    // Sort
    switch (filters.sortOrder) {
      case "newest":
        newList = newList.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        newList = newList.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "price-high":
        newList = newList.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "price-low":
        newList = newList.sort((a, b) => Number(a.price) - Number(b.price));
        break;
    }

    updateFilteredProperties(newList); // Parent Component
    setSelectedLocation(filters.location); // Parent Component
  }, [filters, properties]);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  return (
    <div
      key={renderKey}
      className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Property Category Toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Category
            </label>
            <div className="flex gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                onClick={() => updateFilter("category", "residential")}
                className={`cursor-pointer px-4 py-1.5 text-sm rounded-lg font-semibold transition-all duration-200 ${
                  filters.category === "residential"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Residential
              </button>
              <button
                onClick={() => updateFilter("category", "commercial")}
                className={`cursor-pointer px-4 py-1.5 text-sm rounded-lg font-semibold transition-all duration-200 ${
                  filters.category === "commercial"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Commercial
              </button>
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
              className="px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold text-slate-800 transition-all focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">all types</option>
              {(filters.category === "residential"
                ? PROPERTY_TYPES
                : COMMERCIAL_PROPERTY_TYPES
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              City Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold text-slate-800 transition-all focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">all cities</option>
              {LOCATIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                updateFilter("sortOrder", e.target.value as string)
              }
              className="px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold text-slate-800 transition-all focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="newest">newest first</option>
              <option value="oldest">oldest first</option>
              <option value="price-low">price: low to high</option>
              <option value="price-high">price: high to low</option>
            </select>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-[20px]" />

          {/* View Mode Toggle */}
          <div className="hidden  md:flex flex-col gap-1 items-end">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:block">
              Layout View
            </label>
            <div className="flex gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
