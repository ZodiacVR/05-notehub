import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pageCount: number;
  onPageChange: (page: number) => void;
  forcePage: number;
}

export default function Pagination({ pageCount, onPageChange, forcePage }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={({ selected }) => onPageChange(selected + 1)} // Конвертація з 0-based на 1-based
      forcePage={forcePage}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      containerClassName="pagination"
      activeClassName="active"
      nextLabel=">"
      previousLabel="<"
    />
  );
}