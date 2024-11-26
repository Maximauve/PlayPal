import { type Tag as TagType } from "@playpal/schemas/tag.interface";
import { type FC } from "react";

import { Tag } from "@/components/tag";

interface TagsContainerProperties {
  tags: TagType[];
}

export const TagsContainer: FC<TagsContainerProperties> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags && tags.map((tag: TagType) => (
        <Tag id={tag.id} name={tag.name} />
      ))}
    </div>
  );
};