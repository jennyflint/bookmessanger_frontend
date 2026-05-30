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
    lines: SentenceModel[];
    characters: CharacterModel[];
}