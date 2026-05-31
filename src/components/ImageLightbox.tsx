"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type LightboxImage = {
  src: string;
  alt: string;
  title?: string;
};

interface ImageLightboxProps {
  images: LightboxImage[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  isOpen,
  initialIndex = 0,
  onClose,
}: ImageLightboxProps) {
  const safeInitialIndex = useMemo(() => {
    if (!images.length) return 0;
    if (initialIndex < 0) return 0;
    if (initialIndex > images.length - 1) return images.length - 1;
    return initialIndex;
  }, [images.length, initialIndex]);

  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);
  const [lastInitialIndex, setLastInitialIndex] = useState(safeInitialIndex);

  // Sync index when initialIndex changes
  if (safeInitialIndex !== lastInitialIndex) {
    setCurrentIndex(safeInitialIndex);
    setLastInitialIndex(safeInitialIndex);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !images.length) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, isOpen, onClose]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full border border-white/30 bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-4 rounded-full border border-white/30 bg-black/70 p-2 text-white hover:bg-black/70"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Main Content */}
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stacked layers (no rotation) */}
        <div className="absolute inset-0 translate-x-2 translate-y-2 bg-white opacity-60 shadow-lg" />
        <div className="absolute inset-0 translate-x-4 translate-y-4 bg-white opacity-40 shadow-md" />

        {/* Main Polaroid */}
        <div className="relative animate-[zoomIn_0.3s_ease] bg-white p-4 pb-8 shadow-2xl">
          <div className="relative h-[45vh] w-full overflow-hidden bg-black sm:h-[60vh]">
            <Image
              key={currentImage.src}
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain brightness-95 contrast-95 transition-opacity duration-300"
              sizes="100vw"
              priority
            />
          </div>

          {/* Caption */}
          <div className="font-handwriting mt-4 text-center text-4xl font-bold text-gray-800">
            {currentImage.title ?? currentImage.alt}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-4 rounded-full border border-white/30 bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
