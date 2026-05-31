"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const images = [
  {
    src: "/pahar.jpeg",
    title: "North Sikkim Tour",
    subtitle: "Explore Valleys & Lakes",
    info: "5N/6D • Meals Included • Best Season: Apr-Jun",
    href: "/package/north-sikkim",
  },
  {
    src: "/pahar.jpeg",
    title: "Dooars Adventure",
    subtitle: "10 Best Places",
    info: "3N/4D • Forest Safari • Family Friendly",
    href: "/package/dooars",
  },
  {
    src: "/pahar.jpeg",
    title: "Darjeeling Trip",
    subtitle: "Family & Couple Plans",
    info: "4N/5D • Toy Train • Tea Garden Visit",
    href: "/package/darjeeling",
  },
  {
    src: "/pahar.jpeg",
    title: "Gangtok Getaway",
    subtitle: "Delhi to Sikkim",
    info: "4N/5D • Tsomgo Lake • Local Sightseeing",
    href: "/package/gangtok",
  },
];

const Home = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const startMarquee = () => {
      const totalWidth = track.scrollWidth / 2;
      if (!totalWidth) return;

      tweenRef.current?.kill();
      gsap.set(track, { x: 0 });

      tweenRef.current = gsap.to(track, {
        x: -totalWidth,
        duration: 50,
        ease: "none",
        repeat: -1,
      });
    };

    const handleResize = () => startMarquee();
    const handleWindowLoad = () => startMarquee();

    startMarquee();
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleWindowLoad);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleWindowLoad);
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      {/* Image Marquee Section */}
      <h1 className="mt-16 mb-6 pb-6 text-3xl font-extrabold text-red-950 sm:text-4xl">
        Escape & Explore with us
      </h1>
      <section
        className="mx-auto max-w-6xl overflow-hidden px-4"
        onMouseEnter={() => tweenRef.current?.pause()}
        onMouseLeave={() => tweenRef.current?.resume()}
      >
        <div ref={trackRef} className="flex gap-4 object-contain">
          {[...images, ...images].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative shrink-0 overflow-hidden"
            >
              <Image
                src={item.src}
                alt={item.title}
                width={380}
                height={260}
                className="h-auto w-[72vw] max-w-95 rounded-2xl transition-transform duration-300 group-hover:scale-105 sm:w-[320px] md:w-95"
              />
              <div className="bg-liner-to-t absolute inset-x-0 bottom-0 from-black to-transparent p-4">
                <p className="text-2xl font-bold text-white">{item.title}</p>
                <p className="max-h-0 overflow-hidden text-sm text-gray-200 transition-all duration-300 group-hover:max-h-10">
                  {item.subtitle}
                </p>
                <p className="max-h-0 overflow-hidden text-sm text-gray-200 transition-all duration-300 group-hover:max-h-10">
                  {item.info}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
