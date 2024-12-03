import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  siblingCount?: number;
}

export const usePagination = ({ 
  totalItems, 
  itemsPerPage = 10, 
  siblingCount = 1 
}: PaginationOptions) => {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const currentPage = Number(searchParameters.get('page') || 1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationRange = useMemo(() => {
    const pageNumbers = [];

    const showFirstPage = currentPage > siblingCount + 2;
    const showLastPage = currentPage < totalPages - (siblingCount + 1);

    if (showFirstPage) {
      pageNumbers.push(1);
      if (currentPage > siblingCount + 3) {
        pageNumbers.push(-1);
      }
    }

    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);

    for (let index = start; index <= end; index++) {
      pageNumbers.push(index);
    }

    if (showLastPage) {
      if (currentPage < totalPages - (siblingCount + 2)) {
        pageNumbers.push(-1);
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }, [currentPage, totalPages, siblingCount]);

  const changePage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    const newSearchParameters = new URLSearchParams(searchParameters);
    newSearchParameters.set('page', pageNumber.toString());
    setSearchParameters(newSearchParameters);
  };

  return {
    currentPage,
    totalPages,
    paginationRange,
    changePage,
  };
};