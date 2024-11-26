import React from 'react';

import { AllCards } from '@/components/all-cards';
import { SearchHeader } from '@/components/search-header';
import { TagsFilter } from '@/components/tags-filter';

export default function SearchPage(): React.JSX.Element {
  
  return (
    <>
      <SearchHeader />
      <TagsFilter />
      <AllCards />
    </>
  );
}
