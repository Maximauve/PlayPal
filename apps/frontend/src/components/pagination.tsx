import React from 'react';

interface PaginationProps {
  changePage: (page: number) => void;
  currentPage: number;
  paginationRange: number[];
  totalPages: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginationRange,
  changePage
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 my-6">
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
          currentPage === 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105'
        }`}
      >
        ←
      </button>
      <div className="flex space-x-2">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === -1) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-10 h-10 text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
                pageNumber === currentPage
                  ? 'bg-blue-500 text-white font-bold scale-110'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
          currentPage === totalPages
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105'
        }`}
      >
        →
      </button>
    </div>
  );
};
