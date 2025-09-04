import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/supabase/supabase';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);

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
      renderItem={({ item }) => (
        <ThemedView style={styles.category}>
          <ThemedText type="subtitle" style={styles.categoryTitle}>
            {item.title}
          </ThemedText>
          <FlatList
            data={item.shows}
            keyExtractor={(show) => String(show.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: show }) => (
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/show/[id]', params: { id: show.id } })
                }
                style={styles.posterContainer}
              >
                <Image source={{ uri: show.poster }} style={styles.poster} />
                <ThemedText numberOfLines={1} style={styles.posterTitle}>
                  {show.title}
                </ThemedText>
              </Pressable>
            )}
          />
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  posterContainer: {
    marginHorizontal: 8,
    width: 120,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 4,
  },
  posterTitle: {
    textAlign: 'center',
  },
});
