export default function HeroVideo() {
  return (
    <video
      width={1920}
      height={1080}
      className="block h-[105svh] w-full object-cover will-change-transform"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster="/hero.jpeg"
    >
      <source src="/hero.mp4" />
    </video>
  );
}
