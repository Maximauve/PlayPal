import "@/assets/styles/rating.scss";

interface RatingProperties {
  rating: number; // Note sur 5 (ex: 4.3)
}

export const Rating = ({ rating }: RatingProperties) => {

  return (
    <div className="flex items-center space-x-1">
      <span className={`stars value-${rating}`}>★★★★★</span>
      <span className="ml-2 text-gray-600 text-sm">{rating}</span>
    </div>
  );
};
