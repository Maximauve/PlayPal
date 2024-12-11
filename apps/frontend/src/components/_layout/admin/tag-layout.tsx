import TagHeader from "@/components/tag-header";
import TagList from "@/components/tag-list";

export default function TagLayout() {
  return (
    <section className="w-full h-full">
      <TagHeader />
      <TagList />
    </section>
  );
}