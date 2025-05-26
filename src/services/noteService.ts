import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, NoteResponse } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<NoteResponse> => {
  try {
    const response: AxiosResponse<NoteResponse> = await axios.get(BASE_URL, {
      params: {
        page,
        perPage,
        search,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch notes: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to fetch notes');
  }
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axios.post(BASE_URL, note, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to create note: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to create note');
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to delete note: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to delete note');
  }
};
console.log('Token:', import.meta.env.VITE_NOTEHUB_TOKEN);