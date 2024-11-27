import { type Tag as TagType } from "@playpal/schemas";
import React, { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';

import { AllCards } from '@/components/all-cards';
import { SearchHeader } from '@/components/search-header';
import { TagsFilter } from '@/components/tags-filter';
// import { useGetGamesQuery } from '@/services/game';

export default function SearchPage(): React.JSX.Element {
  // const [searchParameters] = useSearchParams();
  const [, setSelectedTags] = useState<TagType[]>([]);
  // const [page, setPage] = useState(searchParameters.get('page') || 1);
  // const limit = searchParameters.get('limit') || 10;
  // const { data, isLoading, error } = useGetGamesQuery({
  //   tags: selectedTags,
  //   page,
  //   limit,
  // });

  return (
    <>
      <SearchHeader />
      <TagsFilter setSelectedTags={setSelectedTags}/>
      <AllCards games={[]}/>
    </>
  );
}
