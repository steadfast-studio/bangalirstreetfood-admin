"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Packages", href: "/package" },
  { name: "About", href: "/about" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="mx-2 print:static print:shadow-none">
      {/* Top Banner – Logo & Brand */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-6 px-4 py-4">
          <Image
            src="/bangalir_street_food_logo1.jpg"
            alt="Bangalir Street Food Logo"
            width={500}
            height={500}
            className="h-24 w-24 rounded-full object-cover"
          />
          <Image
            src="/khobarchoriadin.png"
            alt="Bangalir Street Food"
            width={800}
            height={500}
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-teal-700 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          {/* Small logo in navbar */}
          <Link href="/" className="shrink-0">
            <Image
              src="/sadakodhai.png"
              alt="Logo"
              width={100}
              height={100}
              className="my-1 h-16 w-full object-contain"
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
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive
                      ? "text-teal-700"
                      : "text-white hover:text-teal-700"
                  }
                >
                  <Link className="font-semibold" href={link.href}>
                    {link.name}
                  </Link>
                </Button>
              );
            })}
            <Button asChild size="sm" className="ml-3" variant={"accent"}>
              <Link href="/package" className="font-semibold text-gray-800">
                Book a Trip
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
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
          <nav className="space-y-1 border-t border-gray-100 bg-white px-4 pt-2 pb-4 md:hidden">
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
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Button
              asChild
              className="mt-2 w-full"
              size="sm"
              variant={"accent"}
            >
              <Link
                href="/package"
                onClick={() => setMobileOpen(false)}
                className="bg-transparent"
              >
                Book a Trip
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
