"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Packages", href: "/package" },
  { name: "Gallery", href: "/gallery" },
  { name: "Our Story", href: "/about" },
];

// ✅ Add any route that should start transparent here
const TRANSPARENT_NAV_ROUTES: string[] = [
  "/",
  "/package/[id]", // dynamic segment — matched via regex below
  "/about",
  "/gallery",
  "/package",
];

function isTransparentRoute(pathname: string): boolean {
  return TRANSPARENT_NAV_ROUTES.some((route) => {
    // Convert Next.js dynamic segments like [id] → regex wildcard
    const pattern = route.replace(/\[.*?\]/g, "[^/]+");
    return new RegExp(`^${pattern}$`).test(pathname);
  });
}

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const hasTransparentNav = isTransparentRoute(pathname);
  const isTransparent = hasTransparentNav && !scrolled;

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hasTransparentNav) return; // skip listener on solid-nav routes
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasTransparentNav]);

  // Reset scroll state when navigating to a non-transparent route
  // useEffect(() => {
  // if (!hasTransparentNav) setScrolled(false);
  // }, [pathname, hasTransparentNav]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 w-full border-b transition-all duration-300 ${
        isTransparent
          ? "border-transparent bg-transparent shadow-none"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/kalokodhai.png"
            alt="Logo"
            width={200}
            height={100}
            className="my-1 h-16 w-full object-cover"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Button
                asChild
                key={link.name}
                variant="ghost"
                size="sm"
                className={
                  isTransparent
                    ? isActive
                      ? "font-semibold text-white underline underline-offset-4 hover:bg-transparent hover:text-white"
                      : "font-semibold text-white hover:bg-white/10 hover:text-white"
                    : isActive
                      ? "bg-teal-50 font-semibold text-teal-600 hover:bg-teal-50 hover:text-teal-600"
                      : "font-semibold text-gray-700 hover:text-teal-600"
                }
              >
                <Link href={link.href}>{link.name}</Link>
              </Button>
            );
          })}

          <Button asChild size="sm" className="ml-3" variant="accent">
            <Link href="/package" className="font-semibold">
              Book a Trip
            </Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          className={`rounded-lg p-2 transition-colors md:hidden ${
            isTransparent
              ? "text-white hover:bg-white/10"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 pt-2 pb-4 md:hidden">
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="mt-3 px-4">
            <Button asChild size="sm" className="w-full" variant="accent">
              <Link
                href="/package"
                className="font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Book a Trip
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
