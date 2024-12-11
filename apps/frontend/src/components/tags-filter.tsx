import { type Tag as TagType } from "@playpal/schemas";
import React from "react";

import { Tag } from "@/components/tag";
import { useGetTagsQuery } from "@/services/tag";

interface TagsFilterProps {
  selectedTags: TagType[];
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>;
}

export const TagsFilter = ({ setSelectedTags, selectedTags }: TagsFilterProps) => {

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
          <Tag key={tag.id} tag={tag} isSelected={selectedTags.some((t) => t.id === tag.id)} tagSelect={tagSelect}/>
        ))}
      </div>
    </section>
  );
};