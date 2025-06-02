import axios from 'axios';
import type { Note } from '../types/note';

interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (search: string, page: number = 1, perPage: number = 10): Promise<NoteResponse> => {
  try {
    const response = await axios.get<NoteResponse>('https://api.example.com/notes', {
      params: { search, page, perPage },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch notes error:', error);
    throw new Error('Failed to fetch notes');
  }
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  try {
    const response = await axios.post<Note>('https://api.example.com/notes', note, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create note error:', error);
    throw new Error('Failed to create note');
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await axios.delete(`https://api.example.com/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    });
  } catch (error) {
    console.error('Delete note error:', error);
    throw new Error('Failed to delete note');
  }
};