export interface Episode {
  id: string;
  title: string;
}

export interface Show {
  id: string;
  title: string;
  poster: string;
  synopsis: string;
  episodes: Episode[];
}

export interface Category {
  id: string;
  title: string;
  shows: Show[];
}

export const catalog: Category[] = [
  {
    id: 'drama',
    title: 'Drama',
    shows: [
      {
        id: 'dramatic-times',
        title: 'Dramatic Times',
        poster: 'https://placehold.co/200x300?text=Drama+1',
        synopsis: 'A moving tale of love and loss.',
        episodes: [
          { id: '1', title: 'Pilot' },
          { id: '2', title: 'The Aftermath' },
        ],
      },
      {
        id: 'tear-jerker',
        title: 'Tear Jerker',
        poster: 'https://placehold.co/200x300?text=Drama+2',
        synopsis: 'Bring the tissues for this emotional ride.',
        episodes: [
          { id: '1', title: 'Sad Beginnings' },
          { id: '2', title: 'Even Sadder Middles' },
        ],
      },
    ],
  },
  {
    id: 'comedy',
    title: 'Comedia',
    shows: [
      {
        id: 'laugh-lounge',
        title: 'Laugh Lounge',
        poster: 'https://placehold.co/200x300?text=Comedy+1',
        synopsis: 'Sketches and stand-up to brighten your day.',
        episodes: [
          { id: '1', title: 'Opening Night' },
          { id: '2', title: 'Encore' },
        ],
      },
      {
        id: 'funny-bones',
        title: 'Funny Bones',
        poster: 'https://placehold.co/200x300?text=Comedy+2',
        synopsis: 'A sitcom about a family of clowns.',
        episodes: [
          { id: '1', title: 'Big Shoes to Fill' },
          { id: '2', title: 'Juggling Life' },
        ],
      },
    ],
  },
];

export function findShowById(id: string): Show | undefined {
  for (const category of catalog) {
    const show = category.shows.find((s) => s.id === id);
    if (show) return show;
  }
  return undefined;
}

