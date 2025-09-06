
export interface Show {
  id: number | string;
  title: string;
  synopsis: string;
  poster?: string;
  episodes: Episode[];
}

export interface Episode {
  id: number | string;
  number: number;
  title: string;
}
export interface Category {
  id: string;
  title: string;
  shows: Show[];
}


