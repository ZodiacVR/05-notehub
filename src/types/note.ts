export interface Note {
  id: number;
  title: string;
  content: string;
  tag: 'work' | 'personal' | 'study' | 'other' | 'todo';
  isArchived: boolean;
}

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}