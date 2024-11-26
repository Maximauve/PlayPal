import { type Tag as TagType } from "@playpal/schemas/tag.interface";
import { type FC } from "react";

import { Tag } from "@/components/tag";

interface TagsFilterProperties {}

export const TagsFilter: FC<TagsFilterProperties> = () => {

  const allTags: TagType[] = [
    {
      name: "Coopératif",
      id: "1"
    }, {
      name: "Social",
      id: "2"
    }, {
      name: "Ambiance",
      id: "3"
    }, {
      name: "Soirée",
      id: "4"
    }, {
      name: "Coopératif",
      id: "1"
    }, {
      name: "Social",
      id: "2"
    }, {
      name: "Ambiance",
      id: "3"
    }, {
      name: "Soirée",
      id: "4"
    }, {
      name: "Coopératif",
      id: "1"
    }, {
      name: "Social",
      id: "2",
    }, {
      name: "Ambiance",
      id: "3"
    }, {
      name: "Soirée",
      id: "4",
    }
  ];
  // const { data: allTags = [], isLoading, error } = useGetTagsQuery();
  // const [tagsSelected, setTagsSelected] = useState<string[]>([]);

  // const tagSelect = (tagId: string) => {
  //   setTagsSelected((previousSelected) =>
  //     previousSelected.includes(tagId)
  //       ? previousSelected.filter((id: string) => id !== tagId)
  //       : [...previousSelected, tagId]
  //   );
  // };

  return (
    <section className="relative flex justify-center mb-8">
      <div className="max-w-screen-xl mx-5 flex flex-wrap gap-4">
        {allTags && allTags.map((tag: TagType) => (
          <Tag key={tag.id} id={tag.id} name={tag.name} tagSelect={() => {}}/>
        ))}
      </div>
    </section>
  );
};