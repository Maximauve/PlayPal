import "@/assets/styles/rating.scss";

interface RatingProperties {
  rating: number; // Note sur 5 (ex: 4.3)
  nbRatings?: number; // Nombre de notes (ex: 100)
}

export const Rating = ({ rating, nbRatings }: RatingProperties) => {

  return (
    <div className="flex items-center space-x-1">
      <span className={`stars text-xl value-${rating}`}>★★★★★</span>
      <span className="ml-2 text-gray-600 text-sm">{rating}</span>
      {nbRatings !== undefined && (
        <span className="text-gray-600 text-sm">({nbRatings})</span>
      )}
    </div>
  );
};
