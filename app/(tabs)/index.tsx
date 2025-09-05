// Home screen renders rows via CarouselRow
import { Category } from '@/data/catalog';
import { supabase } from '@/supabase/supabase';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import CarouselRow from '@/components/CarouselRow';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('genres')
        // Expect a FK: shows.genre_id -> genres.id
        .select('id, name, shows ( id, title, poster_path )')
        .order('name', { ascending: true })
        .order('title', { foreignTable: 'shows', ascending: true })
      if (error) {
        console.error('[Supabase] genres query failed:', error)
        return
      }
      if (!data || data.length === 0) {
        console.warn(
          '[Supabase] No genres returned. Check RLS policies and that tables contain rows.'
        )
      }
      setCategories(
        (data ?? []).map((cat: any) => ({
          id: cat.id,
          title: cat.name,
          shows: (cat.shows ?? []).map((s: any) => ({
            id: s.id,
            title: s.title,
            poster: s.poster_path,
          })),
        }))
      )
    }
    load()
  }, [])

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <CarouselRow category={item} />}
    />
  );
}
