import { type FC } from "react";

interface TagProperties {
  id: string;
  name: string;
  isSelected?: boolean;
  tagSelect?: (tagId: string) => void;
}

export const Tag: FC<TagProperties> = ({ id, name, isSelected = false, tagSelect = () => {} }) => {
  return (
    <button
      className={`px-3 py-1 rounded-full text-sm font-medium transition 
        ${
    isSelected
      ? "bg-black text-white"
      : "bg-gray-200 text-black hover:bg-gray-300"
    }`}
      onClick={() => tagSelect(id)}
    >
      {name}
    </button>
  );
};