import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-gray-100 print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/bangalir_street_food_logo1.jpg"
              alt="Bangalir Street Food Logo"
              width={200}
              height={200}
              className="mx-auto mb-4 size-20 rounded-full object-cover sm:mx-0"
            />
            <h3 className="text-xl font-bold uppercase sm:text-2xl">
              Bangalir Street Food
            </h3>
            <p className="mt-2 text-sm leading-6">
              Authentic taste, warm hospitality, and unforgettable journeys.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold tracking-wide uppercase sm:text-xl">
              Quick Links
            </h4>
            <ul className="mt-1 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold tracking-wide uppercase sm:text-xl">
              Contact
            </h4>
            <p className="mt-3 wrap-break-word">
              <strong>Email:</strong> hello@bangalirstreetfood.com
            </p>
            <p className="text-sm leading-6">
              <strong>Phone:</strong> +91 90000 00000
            </p>
            {/* 
            // ! Add social media links here @kankanmondal22
            */}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-x-0 border-t border-teal-500 pt-4 text-xs sm:flex-row sm:divide-x sm:text-sm">
          <p className="px-2">
            © {new Date().getFullYear()} Bangalir Street Food. All rights
            reserved
          </p>
          <Link href="/sitemap/en" className="px-2 hover:underline">
            Sitemap
          </Link>
          <Link href="/privacy-policy" className="px-2 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="w-full bg-teal-950 p-4 text-center font-semibold text-teal-100">
        Designed & Developed by&nbsp;{" "}
        <Link href="https://steadfaststudio.in" className="italic underline">
          SteadFast
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
