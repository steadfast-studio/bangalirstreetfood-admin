"use client";

import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

interface GalleryGridProps {
  images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const lightboxImages = images.map((src, index) => ({
    src,
    alt: `Gallery Image ${index + 1}`,
  }));

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            className="aspect-3/2 cursor-pointer overflow-hidden rounded-xl border bg-white p-2 shadow transition-transform duration-300"
          >
            <Image
              src={image}
              alt={`Gallery Image ${index + 1}`}
              width={400}
              height={400}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        ))}
      </div>

      <ImageLightbox
        images={lightboxImages}
        isOpen={isLightboxOpen}
        initialIndex={selectedIndex}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
