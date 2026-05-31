"use client";

type WavyHeroProps = {
  title: string;
  subtitle?: string;
  description?: string;
  bgImage: string;
};

const WavyHero = ({ title, subtitle, description, bgImage }: WavyHeroProps) => {
  return (
    <div className="h-110 w-full overflow-x-hidden sm:h-150">
      <div
        className="hero-mask-intersect w-full bg-rose-300"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex h-80 w-full max-w-6xl flex-col items-start justify-end p-8 text-center text-white sm:h-100">
          {subtitle && (
            <p className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase sm:text-sm">
              {subtitle}
            </p>
          )}

          <h1 className="font-handwriting mb-4 text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {description && (
            <p className="max-w-2xl text-left text-sm text-gray-100/90 sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WavyHero;
