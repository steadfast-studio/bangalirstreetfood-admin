"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// export default function RibbonWave() {
//   const waveGroup = useRef(null);
//   const wave = useRef(null);

//   useEffect(() => {
//     const tl = gsap.timeline({ repeat: -1 });

//     // wave bending
//     tl.to(wave.current, {
//       duration: 3,
//       yoyo: true,
//       repeat: 1,
//       ease: "sine.inOut",
//       attr: {
//         d: `
//         M0 100
//         C200 150 400 50 600 100
//         C800 150 1000 50 1200 100
//         L1200 115
//         C1000 70 800 170 600 115
//         C400 70 200 170 0 115
//         Z
//         `,
//       },
//     });

//     // horizontal movement
//     gsap.to(waveGroup.current, {
//       x: -300,
//       duration: 8,
//       repeat: -1,
//       ease: "none",
//     });
//   }, []);

//   return (
//     <div style={{ height: "300px", background: "#0a2540", overflow: "hidden" }}>
//       <svg viewBox="0 0 1200 200" width="100%" height="200">
//         <g ref={waveGroup}>
//           <path
//             ref={wave}
//             fill="#4cc9f0"
//             d={`
//             M0 100
//             C200 50 400 150 600 100
//             C800 50 1000 150 1200 100
//             L1200 110
//             C1000 140 800 60 600 110
//             C400 140 200 60 0 110
//             Z
//             `}
//           />
//         </g>
//       </svg>
//     </div>
//   );
// }

// export default function RibbonWave() {
//   const wave = useRef(null);

//   useEffect(() => {
//     gsap.to(wave.current, {
//       duration: 3,
//       repeat: -1,
//       yoyo: true,
//       ease: "sine.inOut",
//       attr: {
//         d: `
//         M0 100
//         C200 150 400 50 600 100
//         C800 150 1000 50 1200 100
//         L1200 115
//         C1000 70 800 170 600 115
//         C400 70 200 170 0 115
//         Z
//         `,
//       },
//     });
//   }, []);

//   return (
//     <div style={{ height: "300px", background: "#0a2540" }}>
//       <svg viewBox="0 0 1200 200" width="100%" height="200">
//         <path
//           ref={wave}
//           fill="#4cc9f0"
//           d={`
//           M0 100
//           C200 50 400 150 600 100
//           C800 50 1000 150 1200 100
//           L1200 110
//           C1000 140 800 60 600 110
//           C400 140 200 60 0 110
//           Z
//           `}
//         />
//       </svg>
//     </div>
//   );
// }

// export default function Wave() {
//   const wave = useRef(null);

//   useEffect(() => {
//     gsap.to(wave.current, {
//       duration: 3,
//       repeat: -1,
//       yoyo: true,
//       ease: "sine.inOut",
//       attr: {
//         d: `
//         M0 100
//         C200 160 400 40 600 100
//         C800 160 1000 40 1200 100
//         `,
//       },
//     });
//   }, []);

//   return (
//     <div style={{ background: "#0a2540", height: "300px" }}>
//       <svg viewBox="0 0 1200 200" width="100%" height="200">
//         <path
//           ref={wave}
//           d={`
//             M0 100
//             C200 40 400 160 600 100
//             C800 40 1000 160 1200 100
//           `}
//           fill="none"
//           stroke="#4cc9f0"
//           strokeWidth="18"
//           strokeLinecap="round"
//         />
//       </svg>
//     </div>
//   );
// }

// export default function WaveAnimation() {
//   const wave1 = useRef(null);
//   const wave2 = useRef(null);

//   useEffect(() => {
//     // water wave
//     gsap.to(wave1.current, {
//       x: -300,
//       duration: 8,
//       repeat: -1,
//       ease: "none",
//     });

//     // foam wave (faster)
//     gsap.to(wave2.current, {
//       x: -300,
//       duration: 4,
//       repeat: -1,
//       ease: "none",
//     });

//     // vertical floating
//     gsap.to([wave1.current, wave2.current], {
//       y: 10,
//       duration: 2,
//       repeat: -1,
//       yoyo: true,
//       ease: "sine.inOut",
//     });
//   }, []);

//   return (
//     <div style={{ height: "300px", background: "#0a2540" }}>
//       <svg
//         viewBox="0 0 1200 200"
//         width="100%"
//         height="200"
//         style={{ overflow: "visible" }}
//       >
//         {/* Water wave */}
//         <path
//           ref={wave1}
//           d="M0 100 C200 50 400 150 600 100 C800 50 1000 150 1200 100"
//           fill="none"
//           stroke="#4cc9f0"
//           strokeWidth="20"
//           strokeLinecap="round"
//         />

//         {/* Foam wave */}
//         <path
//           ref={wave2}
//           d="M0 110 C200 70 400 170 600 110 C800 70 1000 170 1200 110"
//           fill="none"
//           stroke="white"
//           strokeWidth="10"
//           strokeLinecap="round"
//           opacity="0.9"
//         />
//       </svg>
//     </div>
//   );
// }
// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";

// Generated once at module load — stable random params per wave row
const WAVE_PARAMS = Array.from({ length: 5 }, (_, i) => ({
  amp: 6 + i * 3 + Math.random() * 4,
  freq: 0.8 + i * 0.15 + Math.random() * 0.2,
}));

function generateWavePath(
  seed: number,
  amplitude: number,
  frequency: number,
  yBase: number,
  width: number,
) {
  const points = [];
  for (let x = 0; x <= width; x += 8) {
    const y =
      yBase +
      Math.sin((x * frequency + seed) * 0.018) * amplitude +
      Math.sin((x * frequency * 1.7 + seed * 2.3) * 0.012) * (amplitude * 0.4);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(" L ")}`;
}

function TreeStump() {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="stumpGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="40%" stopColor="#C4864A" />
          <stop offset="100%" stopColor="#7A4E2A" />
        </linearGradient>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B3E1A" />
          <stop offset="100%" stopColor="#4A2810" />
        </linearGradient>
      </defs>
      {/* Roots */}
      <path
        d="M30 300 Q10 280 5 310 Q20 315 35 305 Z"
        fill="#7A4E2A"
        stroke="#4A2810"
        strokeWidth="1.5"
      />
      <path
        d="M220 300 Q240 280 248 308 Q232 315 218 304 Z"
        fill="#7A4E2A"
        stroke="#4A2810"
        strokeWidth="1.5"
      />
      <path
        d="M70 308 Q50 295 42 318 Q60 322 72 312 Z"
        fill="#8B5A35"
        stroke="#4A2810"
        strokeWidth="1.5"
      />
      <path
        d="M185 308 Q205 295 212 316 Q195 322 183 312 Z"
        fill="#8B5A35"
        stroke="#4A2810"
        strokeWidth="1.5"
      />
      {/* Main trunk */}
      <path
        d="M45 310 Q30 200 40 100 Q55 60 80 50 Q130 30 178 52 Q205 65 215 100 Q228 200 210 310 Z"
        fill="url(#stumpGrad)"
        stroke="#4A2810"
        strokeWidth="2"
      />
      {/* Bark lines */}
      <path
        d="M80 310 Q75 220 82 130 Q85 90 90 65"
        stroke="#6B3E1A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M110 315 Q108 230 112 140 Q114 100 118 72"
        stroke="#6B3E1A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M140 316 Q140 235 140 145 Q140 105 142 76"
        stroke="#6B3E1A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M168 312 Q170 228 166 138 Q163 98 160 70"
        stroke="#6B3E1A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M195 306 Q198 220 192 128 Q188 88 183 62"
        stroke="#6B3E1A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Broken top */}
      <path
        d="M80 50 Q100 20 128 15 Q155 20 178 52 Q155 35 128 32 Q102 35 80 50 Z"
        fill="url(#topGrad)"
        stroke="#4A2810"
        strokeWidth="2"
      />
      {/* Break jagged */}
      <path
        d="M80 50 Q95 42 105 48 Q115 38 125 45 Q135 32 145 44 Q158 36 170 50 Q160 55 150 48 Q140 58 130 50 Q120 60 110 52 Q100 60 90 55 Z"
        fill="#4A2810"
        stroke="#2A1808"
        strokeWidth="1.5"
      />
      {/* Highlight */}
      <path
        d="M55 240 Q52 180 55 120 Q58 90 62 70"
        stroke="#D4956A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export default function BeachScene() {
  return (
    <div className="relative flex h-screen w-full flex-col justify-end overflow-hidden bg-sky-300">
      {/* SKY CLOUDS */}
      <div className="pointer-events-none absolute inset-0">
        <Cloud className="animate-cloudSlow top-[10%] left-[-20%] opacity-80" />
        <Cloud className="animate-cloudMedium top-[25%] left-[-30%] scale-75 opacity-60" />
        <Cloud className="animate-cloudFast top-[5%] left-[-15%] scale-110 opacity-70" />
      </div>

      {/* SEA */}
      <div className="relative h-[38%] w-full overflow-hidden bg-cyan-600">
        {/* Ripple rows */}
        <WaveRow top="15%" speed="waveSlow" opacity={0.35} />
        <WaveRow top="35%" speed="waveMedium" opacity={0.3} />
        <WaveRow top="55%" speed="waveFast" opacity={0.45} />
        <WaveRow top="75%" speed="waveMedium" opacity={0.35} />

        {/* Shore foam */}
        <FoamWave />
      </div>

      {/* SAND */}
      <div className="relative h-[25%] w-full bg-amber-200 shadow-[inset_0_20px_40px_rgba(0,0,0,0.1)]">
        <SandTexture />
      </div>

      <style>{`

/* CLOUD ANIMATION */

@keyframes cloudMove {
  from { transform: translateX(0); }
  to { transform: translateX(150vw); }
}

.animate-cloudSlow{
  animation: cloudMove 80s linear infinite;
}

.animate-cloudMedium{
  animation: cloudMove 60s linear infinite;
}

.animate-cloudFast{
  animation: cloudMove 40s linear infinite;
}


/* RIPPLE MOVEMENT */

@keyframes waveMove {
  from { transform: translateX(0); }
  to { transform: translateX(-300px); }
}

.waveSlow{
  animation: waveMove 30s linear infinite;
}

.waveMedium{
  animation: waveMove 22s linear infinite;
}

.waveFast{
  animation: waveMove 16s linear infinite;
}


/* SHORE FOAM */

@keyframes foamMove {
  0% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-60px) translateY(6px); }
  100% { transform: translateX(0) translateY(0); }
}

.foamWave{
  animation: foamMove 8s ease-in-out infinite;
}

`}</style>
    </div>
  );
}

/* CLOUD */

function Cloud({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <svg width="200" height="100" viewBox="0 0 200 100" fill="white">
        <circle cx="40" cy="60" r="30" />
        <circle cx="80" cy="50" r="40" />
        <circle cx="130" cy="60" r="35" />
        <circle cx="170" cy="70" r="25" />
      </svg>
    </div>
  );
}

/* RIPPLE ROW */

function WaveRow({
  top,
  speed,
  opacity,
}: {
  top: string;
  speed: string;
  opacity: number;
}) {
  const waves = new Array(40).fill(0);

  return (
    <div className={`absolute left-0 flex gap-10 ${speed}`} style={{ top }}>
      {waves.map((_, i) => (
        <svg key={i} width="40" height="12" viewBox="0 0 40 12">
          <path
            d="M0 6 Q10 0 20 6 T40 6"
            fill="none"
            stroke="white"
            strokeOpacity={opacity}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}

/* SHORE FOAM */

function FoamWave() {
  return (
    <div className="foamWave absolute bottom-0 left-0 w-[200%]">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-[60px] w-full"
      >
        <path
          d="
          M0,40
          C120,80 240,0 360,40
          C480,80 600,0 720,40
          C840,80 960,0 1080,40
          C1200,80 1320,0 1440,40
          L1440,120 L0,120 Z
          "
          fill="white"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

/* SAND TEXTURE */

function SandTexture() {
  return (
    <svg className="absolute inset-0 opacity-20">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}
