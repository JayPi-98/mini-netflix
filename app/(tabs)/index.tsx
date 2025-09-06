// Home screen renders rows via CarouselRow
import CarouselRow from '@/components/CarouselRow';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Category } from '@/data/catalog';
import { supabase } from '@/supabase/supabase';
import { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('genres')
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
      ListHeaderComponent={
        <ThemedView style={styles.topBar}>
          <ThemedText type="title" style={styles.appTitle}>
            Mini-Netflix
          </ThemedText>
        </ThemedView>
      }
      contentContainerStyle={styles.listContent}
      stickyHeaderIndices={[0]}
    />
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
    // subtle dividing line + shadow at bottom
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(127,127,127,0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 2,
  },
  appTitle: {
    // Centered and using the Google font when available
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: Platform.select({ web: 'Pacifico', default: undefined as any }),
  },
  listContent: {
    paddingBottom: 16,
  },
});
