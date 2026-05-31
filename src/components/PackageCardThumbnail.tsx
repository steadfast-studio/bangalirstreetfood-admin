"use client";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";

const PackageCardThumbnail = ({
  thumbnail,
  title,
  priority = false,
}: {
  thumbnail: string | null;
  title: string;
  priority?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-4/3 w-full">
      {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
      <Image
        src={thumbnail || "/pahar.jpeg"}
        alt={title}
        fill
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};

export default PackageCardThumbnail;
