"use client";

import gsap from "gsap";
import TestimonialCard from "./TestimonialCard";
import Heading2 from "./reusable/Heading2";
import { useEffect, useRef } from "react";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  image?: string;
}

interface Props {
  data: Testimonial[];
  title?: string;
  subtitle?: string;
}

const Testimonials = ({
  data,
  title = "What our customers say",
  subtitle = "Join thousands of happy customers enjoying authentic Bengali street food",
}: Props) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Kill previous animation (important on re-render)
    tweenRef.current?.kill();

    const ctx = gsap.context(() => {
      const totalWidth = el.scrollWidth / 2;

      const tween = gsap.to(el, {
        x: -totalWidth,
        duration: 25, // control speed here
        ease: "none",
        repeat: -1,
      });

      tweenRef.current = tween;
    }, el);

    // Recalculate on resize (SUPER IMPORTANT)
    const handleResize = () => {
      tweenRef.current?.kill();

      const totalWidth = el.scrollWidth / 2;

      tweenRef.current = gsap.to(el, {
        x: -totalWidth,
        duration: 25,
        ease: "none",
        repeat: -1,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      tweenRef.current?.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <Heading2 subHeading={subtitle}>{title}</Heading2>
      </div>

      {/* Marquee Container */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-6 p-4 will-change-transform"
          onMouseEnter={() => tweenRef.current?.timeScale(0.3)} // smooth slow
          onMouseLeave={() => tweenRef.current?.timeScale(1)} // normal speed
        >
          {[...data, ...data].map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              id={testimonial.id}
              name={testimonial.name}
              text={testimonial.text}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
