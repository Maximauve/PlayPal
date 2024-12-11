import { type Tag as TagType } from "@playpal/schemas";

import { Tag } from "@/components/tag";
import { useDeleteTagMutation, useGetTagsQuery } from "@/services/tag";


export default function TagList() {
  const { data: tags } = useGetTagsQuery();
  const [ deleteTag ] = useDeleteTagMutation();

  const removeTag = (tag: TagType) => {
    try {
      deleteTag(tag.id).unwrap();
    } catch (error) {
      console.error("Error delete tag :", error);
    }
  };

  return (
    <section className="flex m-4 flex-wrap gap-2">
      {tags?.map((tag, index) => (
        <Tag key={index} tag={tag} onRemove={removeTag} />
      ))}
    </section>
  );
}