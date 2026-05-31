"use client";

import { useState, useRef } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaCommentDots,
} from "react-icons/fa";

const SpeedDial = () => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 250); // delay prevents instant close
  };

  const items = [
    {
      icon: <FaWhatsapp size={26} />,
      label: "WhatsApp",
      link: "https://wa.me/911234567890?text=Hi%20I%20am%20interested%20in%20your%20furniture",
      color: "bg-green-500",
    },
    {
      icon: <FaFacebookF size={26} />,
      label: "Facebook",
      link: "https://facebook.com",
      color: "bg-blue-600",
    },
    {
      icon: <FaInstagram size={26} />,
      label: "Instagram",
      link: "https://instagram.com",
      color: "bg-pink-500",
    },
    // {
    //   icon: <FaTwitter size={26} />,
    //   label: "Twitter",
    //   link: "https://twitter.com",
    //   color: "bg-sky-500",
    // },
    {
      icon: <FaYoutube size={26} />,
      label: "YouTube",
      link: "https://youtube.com",
      color: "bg-red-600",
    },
    {
      icon: <FaPhoneAlt size={26} />,
      label: "Call",
      link: "tel:+911234567890",
      color: "bg-green-600",
    },
    {
      icon: <FaEnvelope size={26} />,
      label: "Email",
      link: "mailto:your@email.com",
      color: "bg-gray-700",
    },
  ];

  return (
    <div
      className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4 p-2"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Items */}
      <div
        className={`flex flex-col items-end gap-4 transition-all duration-300 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            {/* Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow ${item.color} transition hover:scale-110`}
            >
              {item.icon}
            </div>
          </a>
        ))}
      </div>

      {/* Main Button */}
      <button
        className={`flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white shadow transition-transform duration-300 hover:scale-110 ${
          open ? "rotate-12" : ""
        }`}
      >
        <FaCommentDots size={26} />
      </button>
    </div>
  );
};

export default SpeedDial;
