"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

const galleryImages = [
  { src: "/pahar.jpeg", alt: "Mountain view" },
  { src: "/pahar2.jpeg", alt: "Hill landscape" },
  { src: "/pahar.jpeg", alt: "Food close-up" },
  { src: "/pahar2.jpeg", alt: "Street food platter" },
  { src: "/pahar.jpeg", alt: "Travel destination" },
  { src: "/pahar2.jpeg", alt: "Local experience" },
];

const HomeGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex items-center justify-between">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-2xl font-bold text-red-950 sm:text-3xl">
              Gallery
            </h2>
            <p className="mt-1 text-sm text-zinc-600 sm:text-base">
              Moments from our tours and food experiences.
            </p>
          </div>
          <Button asChild className="font-medium">
            <Link href={"/gallery"}>
              View More
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image, index) => (
            <article
              key={`${image.src}-${index}`}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md hover:shadow-black/60"
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                height={450}
                width={450}
                // fill
                // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="aspect-3/2 w-full object-cover"
              />
            </article>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative h-[80vh] w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Enlarged gallery image"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 70vw"
              className="rounded-lg object-contain"
            />
            <button
              className="absolute -top-12 right-0 rounded-full bg-white p-2 text-gray-900 transition-colors hover:bg-gray-200"
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeGallery;
