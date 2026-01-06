import { useMemo } from "react";
import { getPageNumbers } from "~/lib/utils";

interface UsePaginationResult<T> {
  paginatedData: T[];
  totalPages: number;
  pageNumbers: (number | "ellipsis")[];
}

export function usePagination<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number = 20
): UsePaginationResult<T> {
  return useMemo(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return {
      paginatedData,
      totalPages,
      pageNumbers,
    };
  }, [data, currentPage, itemsPerPage]);
}
