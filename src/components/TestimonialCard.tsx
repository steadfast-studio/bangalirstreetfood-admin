import StarRating from "./StarRating";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

const TestimonialCard = ({ name, text, rating }: Testimonial) => {
  return (
    <div className="w-72 shrink-0 rounded-lg bg-white p-6 shadow-md transition-transform duration-300">
      <div className="mb-4">
        <StarRating rating={rating} />
      </div>

      <p className="mb-4 line-clamp-4 text-sm text-gray-700">{text}</p>

      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">Verified Customer</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
