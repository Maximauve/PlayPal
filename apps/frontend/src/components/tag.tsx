import { type Tag as TagType } from "@playpal/schemas";

import CrossIcon from "@/assets/images/svg/cross.svg?react";

interface TagProps {
  tag: TagType;
  isSelected?: boolean;
  onRemove?: (tag: TagType) => void;
  tagSelect?: (tag: TagType) => void;
}

export const Tag = ({ tag, isSelected = false, tagSelect = () => {}, onRemove }: TagProps) => {
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium transition cursor-pointer flex flex-row
    ${isSelected
      ? "bg-black text-white"
      : "bg-gray-200 text-black hover:bg-gray-300"
    }`}
    onClick={() => tagSelect(tag)}
    >
      <span>{tag.name}</span>
      {onRemove && (
        <div
          className="cursor-pointer ml-2 inline-block"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
        >
          <CrossIcon color="black" height={20} width={20} />
        </div>
      )}
    </div>
  );
};