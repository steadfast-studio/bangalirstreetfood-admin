import { Star } from "lucide-react";

interface Props {
  rating: number;
}

const StarRating = ({ rating }: Props) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

export default StarRating;