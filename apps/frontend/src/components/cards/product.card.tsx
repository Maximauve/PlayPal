import { type Product } from '@playpal/schemas';

import AllGame from "@/assets/images/all-games.png";
import useTranslation from '@/hooks/use-translation';

interface ProductCardProps {
  onDelete: (id: string) => void;
  product: Product;
}

export const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const i18n = useTranslation();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full flex flex-row">
      <img
        className="w-36 h-36 object-cover"
        src={product.game.image ?? AllGame}
        alt="Product image"
      />
      
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-black">{product.game.name}</h3>
        <p className="text-gray-500 text-sm">ID: {product.id}</p>
      </div>

      <div className="flex justify-between items-center px-4 pb-4 mt-auto">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={() => onDelete(product.id)}
        >
          {i18n.t("common.delete")}
        </button>
      </div>
    </div>
  );
};
