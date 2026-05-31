"use client";

interface Props {
  src: string;
  index: number;
  type: "youtube" | "facebook";
}

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

    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      canonicalVideoUrl,
    )}&show_text=false&width=500`;
  } catch {
    return null;
  }
};

const SocialVideoCard = ({ src, index, type }: Props) => {
  const embedUrl =
    type === "youtube"
      ? getYouTubeEmbedUrl(src)
      : type === "facebook"
        ? getFacebookEmbedUrl(src)
        : null;

  return (
    <article className="w-[82vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm sm:w-[320px]">
      {embedUrl ? (
        <iframe
          className="h-96 w-full bg-black sm:h-125"
          src={embedUrl}
          title={`Social video ${index + 1}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <video
          className="h-96 w-full object-cover sm:h-125"
          src={src}
          controls
        />
      )}
    </article>
  );
};

export default SocialVideoCard;
