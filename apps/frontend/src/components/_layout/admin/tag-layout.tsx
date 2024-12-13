import { Fragment } from "react";

import TagHeader from "@/components/tag-header";
import TagList from "@/components/tag-list";

export default function TagLayout() {
  return (
    <Fragment>
      <TagHeader />
      <TagList />
    </Fragment>
  );
}
