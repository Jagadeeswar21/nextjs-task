'use client';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center items-center mt-2">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
      >
        &lt;
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => handleClick(number)}
          className={`px-2 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 "
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
