"use client";
import { useState, useRef, useCallback } from "react";

// ─── Utility: extract dominant color from an image via Canvas ───────────────
function getDominantColor(imgEl: HTMLImageElement) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 12;
    canvas.height = 12;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { r: 50, g: 70, b: 60 };
    ctx.drawImage(imgEl, 0, 0, 12, 12);
    const { data } = ctx.getImageData(0, 0, 12, 12);
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
    };
  } catch {
    return { r: 50, g: 70, b: 60 };
  }
}

function darken(
  {
    r,
    g,
    b,
  }: {
    r: number;
    g: number;
    b: number;
  },
  factor: number,
) {
  return {
    r: Math.round(r * factor),
    g: Math.round(g * factor),
    b: Math.round(b * factor),
  };
}

function rgb({ r, g, b }: { r: number; g: number; b: number }, alpha = 1) {
  return alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
}

// ─── Individual Card ─────────────────────────────────────────────────────────
export function PropertyCard({
  title,
  description,
  badges,
  imageUrl,
  style = {},
}: {
  title: string;
  description: string;
  badges: string[];
  imageUrl: string;
  style?: React.CSSProperties;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [color, setColor] = useState<{
    r: number;
    g: number;
    b: number;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);
  //   const [hovered, setHovered] = useState(false);

  const handleLoad = useCallback(() => {
    if (imgRef.current) {
      setColor(getDominantColor(imgRef.current));
      setLoaded(true);
    }
  }, []);

  const base = color ? darken(color, 0.6) : { r: 30, g: 40, b: 35 };
  const deep = color ? darken(color, 0.28) : { r: 20, g: 28, b: 24 };
  const btnText = color ? darken(color, 0.38) : { r: 30, g: 40, b: 35 };

  const cardStyle: React.CSSProperties = {
    borderRadius: 24,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: 390,
    background: rgb(base),
    transition:
      "transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease",
    // transform: hovered
    //   ? "translateY(-6px) scale(1.015)"
    //   : "translateY(0) scale(1)",
    // boxShadow: hovered
    //   ? `0 24px 48px ${rgb(deep, 0.55)}, 0 4px 12px ${rgb(deep, 0.3)}`
    //   : `0 8px 24px ${rgb(deep, 0.3)}`,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    opacity: loaded || !color ? 1 : 0,
    ...style,
  };

  return (
    <div
      style={cardStyle}
      //   onMouseEnter={() => setHovered(true)}
      //   onMouseLeave={() => setHovered(false)}
    >
      {/* Image + fade-out overlay */}
      <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
        <img
          ref={imgRef}
          src={imageUrl}
          alt={title}
          crossOrigin="anonymous"
          onLoad={handleLoad}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.5s ease",
          }}
        />
        {/* Gradient blending image → card body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 60%, ${rgb(base)} 100%)`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Card body */}
      <div
        style={{
          flex: 1,
          padding: "4px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: `linear-gradient(to bottom, ${rgb(base)}, ${rgb(deep)})`,
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            fontWeight: 400,
            color: "#fff",
            margin: 0,
            lineHeight: 1.2,
            textShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: 12.5,
            color: "rgba(255,255,255,0.78)",
            margin: 0,
            lineHeight: 1.55,
            flex: 1,
          }}
        >
          {description}
        </p>

        {/* Badges */}
        <div
          style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 2 }}
        >
          {badges.map((badge, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(6px)",
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Reserve button */}
        <button
          style={{
            marginTop: 10,
            width: "100%",
            padding: "12px 0",
            borderRadius: 14,
            border: "none",
            background: "rgba(255,255,255,0.93)",
            color: rgb(btnText),
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: 0.2,
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.93)")
          }
          onMouseDown={(e) =>
            ((e.target as HTMLButtonElement).style.transform = "scale(0.97)")
          }
          onMouseUp={(e) =>
            ((e.target as HTMLButtonElement).style.transform = "scale(1)")
          }
        >
          Reserve now
        </button>
      </div>
    </div>
  );
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const LISTINGS = [
  {
    title: "Santorini Villa",
    description:
      "Luxury villa overlooking the Aegean Sea, offering breathtaking sunset views and a private infinity pool for ultimate relaxation.",
    badges: ["4.5 ★★★★★", "3 Night Stay"],
    imageUrl:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80",
  },
  {
    title: "Swiss Chalet",
    description:
      "Cozy wooden chalet nestled in the Swiss Alps, offering a warm fireplace, scenic mountain views, and ski slope access.",
    badges: ["Guest Favorite", "4 Night Stay"],
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    title: "Tropical Bungalow",
    description:
      "Private overwater bungalow surrounded by crystal-clear turquoise lagoon, vibrant coral reef, and warm tropical breezes.",
    badges: ["★ 4.9", "5 Night Stay"],
    imageUrl:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
  },
];

// ─── Root export ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#e8e8ea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {LISTINGS.map((listing) => (
            <PropertyCard key={listing.title} {...listing} />
          ))}
        </div>
      </div>
    </>
  );
}
