export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}
