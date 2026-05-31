"use client";

import React, { useRef } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SocialVideoCard from "./SocialVideoCard";
import Heading2 from "./reusable/Heading2";

interface Props {
  videos: { src: string; type: "youtube" | "facebook" }[];
  title?: string;
  subtitle?: string;
}

const SocialMediaCarousel = ({
  videos,
  title = "The Stories we created",
  subtitle = "Watch our latest videos and see the magic unfold",
}: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  return (
    <>
      <Heading2 subHeadingClassName="mb-18" subHeading={subtitle}>
        {title}
      </Heading2>

      <div className="relative">
        <Button
          size="icon-3xl"
          className="absolute top-1/2 -left-6 aspect-square -translate-y-1/2 rounded-full shadow"
          onClick={handlePrev}
          // variant=""
          disabled={videos.length <= 1}
        >
          <ArrowLeft className="h-12 w-12" strokeWidth={4} />
        </Button>

        <Button
          size="icon-3xl"
          className="absolute top-1/2 -right-6 aspect-square -translate-y-1/2 rounded-full shadow"
          onClick={handleNext}
          // variant="secondary"
          disabled={videos.length <= 1}
        >
          <ArrowRight className="h-12 w-12" strokeWidth={4} />
        </Button>
        <div
          ref={trackRef}
          className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {videos.map((video, index) => (
            <SocialVideoCard
              key={index}
              src={video.src}
              type={video.type}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SocialMediaCarousel;
