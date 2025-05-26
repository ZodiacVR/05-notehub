import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import styles from './App.module.css';
import { AxiosError } from 'axios';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch || undefined),
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully!');
    },
    onError: (error: AxiosError) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        <Pagination
          pageCount={data?.totalPages || 1}
          currentPage={page}
          onPageChange={setPage}
        />
        <button className={styles.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage
          message={
            error instanceof AxiosError
              ? `Failed to fetch notes: ${error.message}`
              : 'There was an error, please try again...'
          }
        />
      )}
      {data?.notes.length ? (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      ) : (
        !isLoading && <p>No notes found.</p>
      )}
      {isModalOpen && <NoteModal onClose={handleCloseModal} />}
      <Toaster position="top-right" />
    </div>
  );
}