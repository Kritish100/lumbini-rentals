"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Image as ImageIcon,
  Video,
  X,
  GripVertical,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

export interface AssetItem {
  id: string;
  status: "existing" | "new";
  file?: File;
  path?: string;
  previewUrl: string;
  type: "image" | "video";
  name: string;
}

const ACCEPTED_FILES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
};

function detectType(fileTypeOrPath: string): "image" | "video" {
  if (fileTypeOrPath.startsWith("video/")) return "video";
  if (fileTypeOrPath.startsWith("image/")) return "image";
  const ext = fileTypeOrPath.split(".").pop()?.toLowerCase() ?? "";
  return ["mp4", "mov", "webm", "m4v"].includes(ext) ? "video" : "image";
}

interface UseAssetUploaderProps {
  propertyId: string;
  initialAssets?: string[];
  assetBaseUrl?: string;
  uploadAssets: (id: string, formData: FormData) => void;
}

export function useAssetUploader({
  propertyId,
  initialAssets = [],
  assetBaseUrl = "",
  uploadAssets,
}: UseAssetUploaderProps) {
  const [assets, setAssets] = useState<AssetItem[]>(() =>
    initialAssets.map((p) => ({
      id: p,
      status: "existing",
      path: p,
      previewUrl: `${assetBaseUrl}${p}`,
      type: detectType(p),
      name: p.split("/").pop() ?? p,
    })),
  );

  const [deletedPaths, setDeletedPaths] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((acceptedFiles: File[]) => {
    const staged: AssetItem[] = acceptedFiles.map((file) => ({
      id: `new-${Math.random().toString(36).slice(2, 9)}`,
      status: "new",
      file,
      previewUrl: URL.createObjectURL(file),
      type: detectType(file.type || file.name),
      name: file.name,
    }));
    setAssets((prev) => [...prev, ...staged]);
  }, []);

  const removeAsset = useCallback((id: string) => {
    setAssets((prev) => {
      const item = prev.find((a) => a.id === id);
      if (!item) return prev;
      if (item.status === "existing" && item.path) {
        setDeletedPaths((paths) => [...paths, item.path!]);
      } else if (item.status === "new") {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const reorder = useCallback((activeId: string, overId: string) => {
    setAssets((prev) => {
      const oldIndex = prev.findIndex((a) => a.id === activeId);
      const newIndex = prev.findIndex((a) => a.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const hasChanges =
    assets.some((a) => a.status === "new") || deletedPaths.length > 0;

  const save = useCallback(async () => {
    console.log("SAVING", assets);
    setIsSaving(true);
    setError(null);
    try {
      const order = assets.map((a) =>
        a.status === "existing" ? a.path! : `NEW:${a.id}`,
      );

      const formData = new FormData();
      assets
        .filter((a) => a.status === "new" && a.file)
        .forEach((a) => formData.append("files", a.file!));

      formData.append("meta", JSON.stringify({ order, deletedPaths }));

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // !! This makes the API Call
      await uploadAssets(propertyId, formData);

      setDeletedPaths([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [assets, deletedPaths, propertyId]);

  return {
    assets,
    addFiles,
    removeAsset,
    reorder,
    save,
    hasChanges,
    isSaving,
    error,
  };
}

interface AssetUploaderProps {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
  initialAssets?: string[];
  assetBaseUrl?: string;
  uploadAssets: (id: string, formData: FormData) => void;
  refetchProperties: () => void;
  onSaved?: (assetPaths: string[]) => void;
}

export default function AssetUploader({
  propertyId,
  propertyTitle,
  onClose,
  initialAssets,
  assetBaseUrl,
  uploadAssets,
  refetchProperties,
}: AssetUploaderProps) {
  const {
    assets,
    addFiles,
    removeAsset,
    reorder,
    save,
    hasChanges,
    isSaving,
    error,
  } = useAssetUploader({
    propertyId,
    initialAssets,
    assetBaseUrl,
    uploadAssets,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: ACCEPTED_FILES,
    multiple: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id));
    }
  };

  const handleSave = async () => {
    try {
      await save();
      // onSaved?.(finalAssets);
      refetchProperties();
      onClose();
    } catch {
      // Handled by hook error state
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
          Manage Media: {propertyTitle}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:bg-slate-50"}`}
        >
          <input {...getInputProps()} />
          <div className="flex justify-center gap-2 text-slate-400 mb-2">
            <ImageIcon size={24} />
            <Video size={24} />
          </div>
          <p className="text-xs font-bold text-slate-700">
            Drag & drop images or videos here, or click to browse
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Supports JPG, PNG, WEBP, MP4, MOV
          </p>
        </div>

        {assets.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={assets.map((a) => a.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-4 gap-2">
                {assets.map((asset) => (
                  <SortableThumbnail
                    key={asset.id}
                    asset={asset}
                    disabled={isSaving}
                    onRemove={() => removeAsset(asset.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {assets.length} assets {hasChanges && "· unsaved"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-3 py-2 text-xs font-bold text-slate-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}{" "}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SortableThumbnailProps {
  asset: AssetItem;
  disabled: boolean;
  onRemove: () => void;
}

function SortableThumbnail({
  asset,
  disabled,
  onRemove,
}: SortableThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: asset.id, disabled });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-lg overflow-hidden border bg-slate-100 group ${isDragging ? "opacity-40" : ""}`}
    >
      {asset.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.previewUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={asset.previewUrl}
          muted
          className="w-full h-full object-cover"
        />
      )}

      <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
        {asset.status === "new" ? "New" : "Existing"}
      </span>

      {!disabled && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 cursor-grab"
        >
          <GripVertical size={12} />
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="absolute bottom-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
      >
        <X size={12} />
      </button>
    </div>
  );
}
