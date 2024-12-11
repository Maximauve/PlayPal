import { type Tag as TagType } from "@playpal/schemas";

import { Tag } from "@/components/tag";
import { useGetTagsQuery } from "@/services/tag";


export default function TagList() {
  const { data: tags } = useGetTagsQuery();

  const removeTag = (tag: TagType) => {
    console.log(tag);
  };

  return (
    <section className="flex my-4 flex-wrap gap-2">
      {tags?.map((tag, index) => (
        <Tag key={index} tag={tag} onRemove={removeTag} />
      ))}
    </section>
  );
}