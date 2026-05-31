import {
  MapPin,
  Bus,
  BookCheck,
  LucideIcon,
  Users,
  Tag,
  CalendarDays,
  Headphones,
} from "lucide-react";

export const BASE_URL = "https://bsf-six.vercel.app/";

export type StatItem = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export const StatItem = [
  { icon: Users, value: "890+", label: "Happy Travelers" },
  { icon: Tag, value: "5+", label: "Offers" },
  { icon: CalendarDays, value: "12+", label: "Years Experience" },
  { icon: Headphones, value: "24/7", label: "Hours Support" },
];

export type WhyBestFeature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const WhyBestFeature = [
  {
    icon: MapPin,
    title: "Diverse Destinations",
    desc: "From sun-soaked coastlines to misty mountain peaks, we offer handpicked destinations for every kind of traveler.",
  },
  {
    icon: Bus,
    title: "Adventure Time",
    desc: "Thrilling group adventures with comfortable transport, expert drivers, and routes off the beaten path.",
  },
  {
    icon: BookCheck,
    title: "Guide Tour",
    desc: "Certified local guides bring destinations to life with rich stories, cultural insights, and personalised itineraries.",
  },
];
export const testimonialsData = [
  {
    id: 1,
    name: "Ankita Roy",
    text: "The Darjeeling trip was perfectly organized. Hotels, transport, everything was smooth. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Sourav Das",
    text: "Amazing experience in Sikkim! The team was very supportive and made our journey stress-free.",
    rating: 5,
  },
  {
    id: 3,
    name: "Riya Sharma",
    text: "Loved the Goa package. Great itinerary and budget-friendly pricing. Will definitely travel again!",
    rating: 4,
  },
  {
    id: 4,
    name: "Arindam Ghosh",
    text: "Very professional service. The guide was knowledgeable and friendly throughout the trip.",
    rating: 5,
  },
  {
    id: 5,
    name: "Neha Kapoor",
    text: "Everything was well planned, from pickup to hotel stays. Had an unforgettable experience!",
    rating: 5,
  },
  {
    id: 6,
    name: "Rahul Verma",
    text: "Good service overall. Minor delays, but the team handled everything nicely.",
    rating: 4,
  },
  {
    id: 7,
    name: "Priyanka Sen",
    text: "Best travel agency I’ve used so far. Very reliable and affordable packages.",
    rating: 5,
  },
];

export const videos: { src: string; type: "youtube" | "facebook" }[] = [
  {
    src: "https://youtube.com/shorts/tgpjk1iYs6U?si=C0QmwyxVSCuBjfJD",
    type: "youtube",
  },
  {
    src: "https://youtube.com/shorts/t35zgT7x1fk?si=QVW_DykSD-fmeqIE",
    type: "youtube",
  },
  {
    src: "https://youtube.com/shorts/MNTHqYfCkWg?si=M3kTkXl_0-xVXz25",
    type: "youtube",
  },
  { src: "https://www.facebook.com/reel/1231792572373049", type: "facebook" },
  { src: "https://www.facebook.com/reel/1606883560603961", type: "facebook" },
  {
    src: "https://youtube.com/shorts/t35zgT7x1fk?si=QVW_DykSD-fmeqIE",
    type: "youtube",
  },
];

export const images = [
  "/gallery/bsf1.jpeg",
  "/gallery/bsf2.jpeg",
  "/gallery/bsf3.jpeg",
  "/gallery/bsf4.jpeg",
  "/gallery/bsf5.jpeg",
  "/gallery/bsf6.jpeg",
  "/gallery/bsf7.jpeg",
  "/gallery/bsf8.jpeg",
];

export const faqData = [
  {
    id: 1,
    question: "What are the best travel destinations in India?",
    answer:
      "India offers a diverse range of travel destinations, including the serene backwaters of Kerala, the majestic Himalayas, the vibrant culture of Rajasthan, and the historical wonders of Delhi and Agra.",
  },
  {
    id: 2,
    question: "How can I find affordable tour packages in India?",
    answer:
      "To find affordable tour packages in India, consider booking during the off-season, comparing prices from multiple travel agencies, and looking for last-minute deals or discounts online.",
  },
  {
    id: 3,
    question: "What are the must-visit places in Kolkata?",
    answer:
      "Kolkata is known for its rich culture and history. Must-visit places include the Victoria Memorial, Howrah Bridge, Indian Museum, Dakshineswar Kali Temple, and the vibrant markets of New Market.",
  },
  {
    id: 4,
    question:
      "How can I ensure a safe and comfortable travel experience in India?",
    answer:
      "To ensure a safe and comfortable travel experience in India, it's important to choose reputable travel agencies, stay informed about local customs and safety guidelines, and take necessary precautions such as keeping valuables secure and staying hydrated.",
  },
];

export const memberData = [
  {
    id: "anirban",
    name: "Anirban Das",
    role: "Co-Founder & CEO",
    image: "/gallery/bsf1.jpeg",
    bio: "Anirban is a passionate traveler and entrepreneur with over a decade of experience in the travel industry. He co-founded our company to share his love for travel and create unforgettable experiences for others. Anirban is dedicated to curating unique and personalized travel packages that cater to every kind of traveler.",
  },
  {
    id: "rohit",
    name: "Rohit Kumar",
    role: "Co-Founder & COO",
    image: "/gallery/bsf1.jpeg",
    bio: "Rohit is a seasoned operations expert with a background in hospitality management. As the COO, he ensures that every aspect of our travel services runs smoothly, from logistics to customer support. Rohit's commitment to excellence and attention to detail guarantees that our customers have a seamless and enjoyable travel experience.",
  },
  {
    id: "sourav",
    name: "Sourav Ghosh",
    role: "Chief Marketing Officer",
    image: "/gallery/bsf1.jpeg",
    bio: "Sourav is a creative marketing strategist with a passion for storytelling. As the CMO, he leads our marketing efforts to connect with travelers and share the unique experiences we offer. Sourav's innovative approach to marketing helps us reach a wider audience and inspire more people to explore the world with us.",
  },
];

export const whyChooseUsData = [
  {
    id: 1,
    title: "Expertly Crafted Itineraries",
    description:
      "Our travel packages are meticulously designed by experienced travel experts to ensure you get the best out of your trip.",
  },
  {
    id: 2,
    title: "Affordable Pricing",
    description:
      "We believe that unforgettable travel experiences should be accessible to everyone.",
  },
  {
    id: 3,
    title: "Exceptional Customer Service",
    description:
      "Our dedicated customer support team is here to assist you every step of the way, from planning your trip to providing support during your travels.",
  },
  {
    id: 4,
    title: "Trusted by Thousands of Travelers",
    description:
      "With a track record of successfully organizing trips for thousands of satisfied customers, we have built a reputation for reliability and excellence in the travel industry.",},
];

// ! add social media links, phone number, emails etc here @kankanmondal22
