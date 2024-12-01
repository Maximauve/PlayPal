import { type FC } from "react";

interface RatingProperties {
  rating: number; // Note sur 5 (ex: 4.3)
}

export const Rating: FC<RatingProperties> = ({ rating }) => {
  const fullStars = Math.floor(rating); // Nombre d'étoiles pleines
  const hasHalfStar = rating % 1 >= 0.5; // S'il y a une demi-étoile
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Étoiles restantes

  return (
    <div className="flex items-center space-x-1">
      {/* Affichage des étoiles pleines */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <img className="w-4 h-4" key={`full-${index}`} src="/src/assets/images/star-full.png" alt="Star full" />
      ))}

      {/* Affichage de la demi-étoile */}
      {hasHalfStar && (
        <img className="w-4 h-4" src="/src/assets/images/star-half.png" alt="Star full" />
      )}

      {/* Affichage des étoiles vides */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <img className="w-4 h-4" key={`full-${index}`} src="/src/assets/images/star-empty.png" alt="Star full" />
      ))}

      {/* Nombre d'avis */}
      <span className="ml-2 text-gray-600 text-sm">{rating}</span>
    </div>
  );
};