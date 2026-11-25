export interface SentenceModel {
  content: string;
  parts: string[];
  is_dialogue: boolean;
  line_number: number;
  characters: string[];
  author_id: number | null;
}
export interface CharacterModel {
  id: number;
  name: string;
  names: string[];
  avatar: string | null;
  full_name: string | null;
}

export interface BookModel {
    name: string;
    /** Original file name of the book; only sent with the short model (?short=1) */
    book_name?: string;
    lines: SentenceModel[];
    characters: CharacterModel[];
}