import { type Tag as TagType } from "@playpal/schemas";
import React, { type FC } from "react";

import { Tag } from "@/components/tag";
import { useGetTagsQuery } from "@/services/tag";

interface TagsFilterProperties {
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>;
}

export const TagsFilter: FC<TagsFilterProperties> = ({ setSelectedTags }) => {

  const { data: allTags = [], isLoading, error } = useGetTagsQuery();

  const tagSelect = (tag: TagType) => {
    setSelectedTags((prevTags: TagType[]) => prevTags.some((t) => t.id === tag.id) ? prevTags.filter((t) => t.id !== tag.id) : [...prevTags, tag]);
  };

  if (isLoading || error) {
    return null;
  }

  return (
    <section className="relative flex justify-center mb-8">
      <div className="max-w-screen-xl mx-5 flex flex-wrap gap-4">
        {allTags && allTags.map((tag: TagType) => (
          <Tag key={tag.id} tag={tag} tagSelect={tagSelect}/>
        ))}
      </div>
    </section>
  );
};