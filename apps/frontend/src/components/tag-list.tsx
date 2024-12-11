import { type Tag as TagType } from "@playpal/schemas";
import { toast, type ToastContent } from "react-toastify";

import { Tag } from "@/components/tag";
import useTranslation from "@/hooks/use-translation";
import { useDeleteTagMutation, useGetTagsQuery } from "@/services/tag";


export default function TagList() {
  const { data: tags } = useGetTagsQuery();
  const [ deleteTag ] = useDeleteTagMutation();
  const i18n = useTranslation();

  const removeTag = (tag: TagType) => {
    try {
      deleteTag(tag.id).unwrap();
      toast.success(i18n.t("notify.delete.tag.success") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error delete tag :", error);
      toast.error(i18n.t("notify.delete.tag.error") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
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