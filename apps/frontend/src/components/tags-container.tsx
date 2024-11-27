import { type Tag as TagType } from "@playpal/schemas";
import { type FC } from "react";

import { Tag } from "@/components/tag";

interface TagsContainerProperties {
  tags: TagType[];
}

export const TagsContainer: FC<TagsContainerProperties> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags && tags.map((tag: TagType, index: number) => (
        <Tag key={`tag-${index}`} tag={tag} />
      ))}
    </div>
  );
};