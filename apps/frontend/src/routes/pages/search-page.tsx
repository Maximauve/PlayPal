import { type Tag as TagType } from "@playpal/schemas";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AllCards } from '@/components/all-cards';
import { Pagination } from "@/components/pagination";
import { SearchHeader } from '@/components/search-header';
import { TagsFilter } from '@/components/tags-filter';
import { usePagination } from "@/hooks/use-pagination";
import { useGetGamesQuery } from '@/services/game';


export default function SearchPage(): React.JSX.Element {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [search, setSearch] = useState<string>("");
  
  const page = Number.parseInt(searchParameters.get('page') || '1', 10);
  const limit = Number.parseInt(searchParameters.get('limit') || '10', 10);

  useEffect(() => {
    const newSearchParameters = new URLSearchParams(searchParameters);
    newSearchParameters.set('page', '1');
    setSearchParameters(newSearchParameters);
  }, [search, selectedTags.length]);

  const { data: gamesData } = useGetGamesQuery({
    tags: selectedTags,
    page: page,
    limit: limit,
    search: search
  });

  const { 
    currentPage, 
    totalPages, 
    paginationRange, 
    changePage 
  } = usePagination({
    totalItems: gamesData?.total || 0, 
    itemsPerPage: limit
  });

  // test for image

  const shouldShowPagination = () => gamesData?.total && gamesData.total > limit;

  return (
    <>
      <SearchHeader search={search} setSearch={setSearch}/>
      <TagsFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
      <AllCards games={gamesData}/>
      {shouldShowPagination() && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginationRange={paginationRange}
          changePage={changePage}
        />
      )}
    </>
  );
}
