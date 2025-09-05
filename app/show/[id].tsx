import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Show } from '@/data/catalog';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/supabase/supabase';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native';

// Keep a modest poster inside the info block (not a giant hero)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DETAIL_POSTER_WIDTH = Math.min(220, Math.round(SCREEN_WIDTH * 0.45));
const DETAIL_POSTER_HEIGHT = Math.round(DETAIL_POSTER_WIDTH * 1.5); // 2:3 ratio
// Keep synopsis to roughly a quarter of the page width
const SYNOPSIS_WIDTH = Math.max(150, Math.round(SCREEN_WIDTH * 0.45));


export default function ShowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      if (!id) {
        setShow(null)
        setLoading(false)
        return
      }
      try {
        const idAsNumber = Number(id)
        const filterValue: any = Number.isFinite(idAsNumber) ? idAsNumber : id
        const { data, error } = await supabase
          .from('shows')
          .select(
            `id, title, poster_path, synopsis,
             episodes:episodes(id, number, title)`
          )
          .eq('id', filterValue)
          .order('number', { foreignTable: 'episodes', ascending: true })
          .single()
        if (error) {
          console.error('[Supabase] show detail query failed:', error)
          setShow(null)
        } else if (data) {
          setShow({
            id: data.id,
            title: data.title,
            synopsis: data.synopsis,
            poster: data.poster_path ?? null,
            episodes: (data.episodes ?? []).sort(
              (a: any, b: any) => (a.number ?? 0) - (b.number ?? 0)
            ),
          })
        } else {
          setShow(null)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])
  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading…</ThemedText>
      </ThemedView>
    )
  }
  if (!show) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No show found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      <ThemedView style={styles.content}>
        <Pressable
          accessibilityLabel="Back to home"
          onPress={() => router.replace('/')}
          hitSlop={10}
          style={styles.backButton}
        >
        </Pressable>
        <ThemedText type="title">{show.title}</ThemedText>
        {show.poster ? (
          <Image
            source={{ uri: show.poster }}
            style={styles.detailPoster}
            contentFit="cover"
            transition={150}
          />
        ) : null}
        <ThemedText style={styles.synopsis}>{show.synopsis}</ThemedText>
        <ThemedText type="subtitle" style={styles.episodesHeader}>
          Episodes
        </ThemedText>
        {show.episodes.map((ep) => (
          <ThemedText key={String(ep.id)}>
            {ep.number}. {ep.title}
          </ThemedText>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginBottom: 4,
    borderRadius: 6,
  },
  backLabel: {
    marginLeft: 2,
    fontSize: 14,
  },
  synopsis: {
    marginBottom: 16,
    width: SYNOPSIS_WIDTH,
    alignSelf: 'flex-start',
  },
  episodesHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  detailPoster: {
    width: DETAIL_POSTER_WIDTH,
    height: DETAIL_POSTER_HEIGHT,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: '#222',
    // subtle shadow for card-like feel
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
