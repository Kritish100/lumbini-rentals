"use client";

import { Image as ImageIcon, Video, X } from "lucide-react";

interface AssetUploaderProps {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
}

export default function AssetUploader({
  propertyId,
  propertyTitle,
  onClose,
}: AssetUploaderProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      {/* Header and Close Action */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
            <ImageIcon size={18} className="text-orange-500" />
            Manage Media
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 truncate max-w-[250px]">
            Attaching to:{" "}
            <span className="text-slate-800 font-bold">{propertyTitle}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
          title="Close Uploader"
        >
          <X size={20} />
        </button>
      </div>

      {/* Cloudflare Upload Mockup */}
      <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="flex gap-3 mb-3 text-slate-400 group-hover:text-slate-600 transition-colors">
            <ImageIcon size={32} />
            <Video size={32} />
          </div>
          <p className="text-sm font-bold text-slate-700">
            Drag & drop files to Cloudflare R2
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports MP4, JPG, PNG up to 50MB
          </p>
          <button className="mt-4 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors shadow-sm">
            Browse Files
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs font-medium text-blue-800 leading-relaxed">
          <strong className="block text-sm mb-1 text-blue-900">
            Upload Rule:
          </strong>
          If you upload an MP4 video, it will automatically be set as the
          premium autoplaying hover preview on the property card.
        </div>
      </div>
    </div>
  );
}
