import { type Tag as TagType } from "@playpal/schemas";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AllCards } from '@/components/all-cards';
import { SearchHeader } from '@/components/search-header';
import { TagsFilter } from '@/components/tags-filter';
import { useGetGamesQuery } from '@/services/game';

export default function SearchPage(): React.JSX.Element {
  const [searchParameters] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [page] = useState<number>(
    Number.parseInt(searchParameters.get('page') || '1', 10)
  );
  const [search, setSearch] = useState<string>("");
  const limit = Number.parseInt(searchParameters.get('limit') || '10', 10);
  const { data } = useGetGamesQuery({
    tags: selectedTags,
    page: page,
    limit: limit,
    search: search
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <SearchHeader search={search} setSearch={setSearch}/>
      <TagsFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
      <AllCards games={data}/>
    </>
  );
}
