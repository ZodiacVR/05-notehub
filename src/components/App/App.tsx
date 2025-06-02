import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import NoteList from '../NoteList/NoteList';
import NoteModal from '../NoteModal/NoteModal';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import { fetchNotes } from '../../services/noteService';
import type { NoteResponse } from '../../types/note';

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useQuery<NoteResponse>({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    enabled: !!debouncedSearch,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isError) {
    toast.error(error?.message || 'Failed to load notes');
  }

  return (
    <div>
      <SearchBox onChange={handleSearch} />
      <button onClick={handleOpenModal}>Add Note</button>
      {isLoading ? (
        <p>Loading...</p>
      ) : data && data.notes.length > 0 ? (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            pageCount={data.totalPages}
            onPageChange={setPage}
            forcePage={page - 1}
          />
        </>
      ) : (
        <p>No notes found</p>
      )}
      {isModalOpen && <NoteModal onClose={handleCloseModal} />}
    </div>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}