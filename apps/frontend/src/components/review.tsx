import "@/assets/styles/rating.scss";
import { type Rating } from '@playpal/schemas';

interface ReviewProperties {
  rating: Rating;
}

export const Review = ({ rating }: ReviewProperties) => {

  return (
    <div className="flex items-start space-x-4">
      <img
        className="w-12 h-12 rounded-full"
        src={rating.user.image === null ? "https://www.gravatar.com/avatar/?d=identicon" : rating.user.image}
        alt="User avatar"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{rating.user.username}</h3>
          <span className="text-gray-500 text-sm">{new Date(rating.creationDate).toLocaleDateString()}</span></div>
        <div className="flex items-center gap-1 mb-2">
          <span className={`stars value-${rating.note}`}>★★★★★</span>
          <span className="text-gray-600 text-sm"> ・ {rating.note}</span>
        </div>
        <p>{rating.comment}</p>
      </div>
    </div>
  );
};
