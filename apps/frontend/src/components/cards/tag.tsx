import { type Tag as TagType } from "@playpal/schemas";

interface TagProps {
  tag: TagType;
  isSelected?: boolean;
  tagSelect?: (tag: TagType) => void;
}

export const Tag = ({ tag, isSelected = false, tagSelect = () => {} }: TagProps) => {
  return (
    <button
      className={`px-3 py-1 rounded-full text-sm font-medium transition 
        ${
    isSelected
      ? "bg-black text-white"
      : "bg-gray-200 text-black hover:bg-gray-300"
    }`}
      onClick={() => tagSelect(tag)}
    >
      {tag.name}
    </button>
  );
};