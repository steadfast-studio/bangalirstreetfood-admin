"use client";
import React, { useRef } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const socialVideos = [
  {
    src: "https://youtube.com/shorts/UPnzC6-hdMc?si=j5jE1kfwGrocJIL4",
  },
  {
    src: "https://youtube.com/shorts/DrX5Q7TDqyk?si=YU3xYk7-ViLUtrrS",
  },
  {
    src: "https://www.facebook.com/reel/26675466888737845",
  },
  {
    src: "https://www.facebook.com/reel/4396231673945328",
  },
  {
    src: "https://www.facebook.com/reel/1226729806282305",
  },
  {
    src: "https://youtube.com/shorts/DN-VhE2nS2A?si=tgSM83ueaZ7O9oDO",
  },
];

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
};

const getFacebookEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);

    if (
      !parsed.hostname.includes("facebook.com") &&
      !parsed.hostname.includes("fb.watch")
    ) {
      return null;
    }

    let canonicalVideoUrl = url;

    if (parsed.hostname.includes("facebook.com")) {
      if (parsed.pathname.startsWith("/share/v/")) {
        const videoId = parsed.pathname.split("/share/v/")[1]?.split("/")[0];
        if (videoId) {
          canonicalVideoUrl = `https://www.facebook.com/watch/?v=${videoId}`;
        }
      }
    }

    if (parsed.hostname.includes("fb.watch")) {
      const videoId = parsed.pathname.replaceAll("/", "");
      if (videoId) {
        canonicalVideoUrl = `https://www.facebook.com/watch/?v=${videoId}`;
      }
    }

    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonicalVideoUrl)}&show_text=false&width=500`;
  } catch {
    return null;
  }
};

const SocialMediaVideoCard = () => {
  const socialTrackRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      {" "}
      {/* Social Media Videos Section */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-red-950 sm:text-3xl">
            The Stories we created
          </h2>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size={"icon"}
              aria-label="Scroll social videos left"
              onClick={() =>
                socialTrackRef.current?.scrollBy({
                  left: -340,
                  behavior: "smooth",
                })
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size={"icon"}
              aria-label="Scroll social videos right"
              onClick={() =>
                socialTrackRef.current?.scrollBy({
                  left: 340,
                  behavior: "smooth",
                })
              }
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mb-5 text-sm text-zinc-600 sm:text-base">
          Watch our latest videos and see the magic unfold in every bite and
          every moment.
        </p>

        <div
          ref={socialTrackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {socialVideos.map((video, index) =>
            (() => {
              const youtubeEmbedUrl = getYouTubeEmbedUrl(video.src);
              const facebookEmbedUrl = getFacebookEmbedUrl(video.src);
              const socialEmbedUrl = youtubeEmbedUrl ?? facebookEmbedUrl;

              return (
                <article
                  key={index}
                  className="w-[82vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm sm:w-[320px]"
                >
                  {socialEmbedUrl ? (
                    <iframe
                      className="h-96 w-full bg-black sm:h-140"
                      src={socialEmbedUrl}
                      title={`Social video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="h-96 w-full bg-black object-cover sm:h-140"
                      src={video.src}
                      controls
                      preload="metadata"
                    />
                  )}
                </article>
              );
            })(),
          )}
        </div>
      </section>
    </div>
  );
};

export default SocialMediaVideoCard;
