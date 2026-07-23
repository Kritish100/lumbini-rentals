"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  DollarSign,
  Search,
  Edit,
  ExternalLink,
  Trash2,
  Layers,
  LayoutGrid,
  List as ListIcon,
  ImagePlus,
  CalendarDays,
  Maximize2,
  RotateCcw,
  Eye,
} from "lucide-react";
import type { AdminProperty } from "@/app/admin/types";
import { CATEGORY, LOCATIONS, PROPERTY_TYPES, SORT_OPTIONS } from "@/app/data";

interface PropertyListProps {
  properties: AdminProperty[];
  isPropertiesLoading: boolean;
  refetchProperties: () => void;
  deleteProperties: (ids: string[]) => void;
  toggleNegotiable: (id: string, value: boolean) => void;
  toggleArchive: (id: string, value: boolean) => void;

  isSidebarOpen: boolean;
  editingId: string | null;
  openAssets: () => void;
  setEditingId: (id: string) => void;
  toggleSidebar: () => void;
}

interface PropertyFilters {
  category: string;
  location: string;
  propertyType: string;
  archived: boolean;
  sortOrder: "Newest" | "Oldest";
}

const DEFAULT_FILTERS: PropertyFilters = {
  category: "all",
  location: "all",
  propertyType: "all",
  archived: false,
  sortOrder: "Newest",
};

const CATEGORY_OPTIONS = ["all", ...CATEGORY];
const LOCATION_OPTIONS = ["all", ...LOCATIONS];
const PROPERTY_TYPE_OPTIONS = ["all", ...PROPERTY_TYPES];

export default function PropertyList({
  properties,
  isPropertiesLoading,
  isSidebarOpen,
  editingId,
  refetchProperties,
  deleteProperties,
  toggleArchive,
  toggleNegotiable,
  setEditingId,
  openAssets,
  toggleSidebar,
}: PropertyListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleEditClick = (item: AdminProperty) => {
    setEditingId(item.id);
    if (!isSidebarOpen) toggleSidebar();
  };

  const handleManageAssetsClick = (id: string) => {
    setEditingId(id);
    if (!isSidebarOpen) toggleSidebar();
    openAssets();
  };

  const onToggleNegotiable = (id: string, value: boolean) => {
    toggleNegotiable(id, value);
  };

  const onToggleArchive = (id: string, value: boolean) => {
    toggleArchive(id, value);
  };

  const onDelete = async (id: string, title: string) => {
    const isConfirmed = window.confirm(
      `Permanently delete this property ! \nID: ${id} \nTitle: ${title}`,
    );
    if (!isConfirmed) return;
    await deleteProperties([id]);
    refetchProperties();
  };

  const formatDate = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredAndSortedProperties = useMemo(() => {
    let newList = [...properties];

    newList = newList.filter((prop) =>
      prop.title
        .toLowerCase()
        .includes(debouncedSearchTerm.trim().toLowerCase()),
    ); // Search Term
    newList = newList.filter((prop) => {
      if (filters.category === "all") return prop;
      else return prop.category.includes(filters.category);
    }); // Category

    newList = newList.filter((prop) => {
      if (filters.location === "all") return prop;
      else return prop.location === filters.location;
    }); // Location

    newList = newList.filter((prop) => {
      if (filters.propertyType === "all") return prop;
      else return prop.type === filters.propertyType;
    }); // Property Type

    // newList = filters.sortOrder === "Newest"
    //               ? newList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    //               : newList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sort by created at

    newList = newList.filter(
      (prop) => Boolean(prop.isArchived) === filters.archived,
    ); // Archived

    return newList;
  }, [properties, debouncedSearchTerm, filters]);

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row flex-wrap items-center gap-3">
        {/* Group 1: Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-orange-500 transition-colors shadow-sm flex-shrink-0"
          title={isSidebarOpen ? "Collapse Input Form" : "Expand Input Form"}
        >
          <Maximize2 size={16} />
        </button>

        <div className="h-8 w-px bg-slate-200 hidden lg:block" />

        {/* Group 2: Search */}
        <div className="relative flex-1 min-w-[200px] order-1 lg:order-none">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="h-8 w-px bg-slate-200 hidden lg:block" />

        {/* Group 3: Filters — visually clustered on a soft background */}
        <div className="flex items-center flex-wrap gap-2 bg-slate-50/70 border border-slate-100 rounded-xl p-1.5">
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "all categories" : opt}
              </option>
            ))}
          </select>

          <select
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "all locations" : opt}
              </option>
            ))}
          </select>

          <select
            value={filters.propertyType}
            onChange={(e) => updateFilter("propertyType", e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "all types" : opt}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.archived}
              onChange={(e) => updateFilter("archived", e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
            />
            Archived
          </label>
        </div>

        {/* Spacer pushes the remaining controls to the far right on larger screens */}
        <div className="hidden lg:block lg:ml-auto" />

        <div className="h-8 w-px bg-slate-200 hidden lg:block" />

        {/* Group 4: Sort + View + Reset */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sortOrder}
            onChange={(e) => {
              const value = e.target.value as PropertyFilters["sortOrder"];
              updateFilter("sortOrder", value);
            }}
            className="text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <ListIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 uppercase px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-slate-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Live Active Catalog
          </h2>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            title="refetch properties"
            onClick={() => refetchProperties()}
            className="flex items-center text-xs mr-3 font-bold text-slate-400 hover:text-slate-700 uppercase"
          >
            <RotateCcw size={14} className="mr-1" /> Reload
          </button>
          <span className="text-xs bg-slate-200 font-bold px-2.5 py-1 text-slate-600 rounded-md">
            {filteredAndSortedProperties.length} Results
          </span>
        </div>
      </div>

      {isPropertiesLoading && <>Loading ...</>}

      {/* Properties Display */}
      {!isPropertiesLoading && filteredAndSortedProperties.length > 0 && (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-3"
          }
        >
          {filteredAndSortedProperties.map((item) => {
            const isHighlighted = editingId === item.id;
            const createdLabel = formatDate((item as any).createdAt);

            return (
              <div
                key={item.id}
                id={`property-${item.id}`}
                className={`bg-white p-4 rounded-xl border shadow-sm transition-all duration-300 flex
                  ${viewMode === "grid" ? "flex-col" : "items-center justify-between gap-4"}
                  ${item.isArchived ? "opacity-60 grayscale" : ""}
                  ${
                    isHighlighted
                      ? "border-orange-400 ring-4 ring-orange-100 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }
                `}
              >
                <div
                  className={`flex ${viewMode === "grid" ? "flex-col gap-3" : "items-center gap-4"} min-w-0 flex-1`}
                >
                  <img
                    src={item.assets?.[0] || "https://via.placeholder.com/150"}
                    alt={item.title}
                    className={`${viewMode === "grid" ? "w-full h-32" : "w-16 h-16"} rounded-lg object-cover bg-slate-100 flex-shrink-0`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-800 truncate">
                        {item.title}
                      </h3>
                      <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
                        {item.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-0.5 text-slate-600 font-semibold">
                        <MapPin size={12} className="text-orange-500" />{" "}
                        {item.location}, {item.subLocation}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-400 font-medium">
                      {item.category?.map((cat) => (
                        <span
                          key={cat}
                          className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          {cat}
                        </span>
                      ))}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === "Available" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-400 font-medium">
                      {createdLabel && (
                        <span className="flex items-center gap-1 text-slate-400 font-medium">
                          <CalendarDays size={12} /> {createdLabel}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Eye size={14} /> {item.views || "0"}
                      </span>
                    </div>

                    <div className="mt-1 text-sm font-extrabold text-slate-900 flex items-center">
                      <DollarSign
                        size={13}
                        className="text-slate-400 -mr-0.5"
                      />
                      {item.price.toLocaleString()}
                    </div>

                    {/* NEW: Checkbox row for Negotiable / Archived */}
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked={item.isNegotiable}
                          onChange={(e) =>
                            onToggleNegotiable(item.id, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                        />
                        Negotiable
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked={item.isArchived}
                          onChange={(e) =>
                            onToggleArchive(item.id, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                        />
                        Archived
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 flex-shrink-0 flex-wrap ${viewMode === "grid" ? "mt-3 justify-end pt-3 border-t border-slate-100" : ""}`}
                >
                  {/* PROMINENT MANAGE ASSETS BUTTON */}
                  <button
                    onClick={() => handleManageAssetsClick(item.id)}
                    className="px-3 py-2 rounded-lg text-white bg-slate-900 hover:bg-orange-500 transition-colors shadow-sm flex items-center gap-1.5"
                    title="Manage Media & Assets"
                  >
                    <ImagePlus size={16} />
                    <span className="text-xs font-bold">Media</span>
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    title="Edit Listing"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(item.id, item.title)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Property"
                  >
                    <Trash2 size={16} />
                  </button>

                  <Link
                    href={`/?view=${item.id}`}
                    target="_blank"
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="View on Public Site"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isPropertiesLoading && !filteredAndSortedProperties.length && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
          No properties match your current filters.
        </div>
      )}
    </div>
  );
}
