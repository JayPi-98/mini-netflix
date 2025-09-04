import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/supabase/supabase';
import { useEffect, useState } from 'react';

interface Show {
  id: number | string;
  title: string;
  synopsis: string;
  episodes: Episode[];
}
interface Episode {
  id: number | string;
  number: number;
  title: string;
}

export default function ShowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
            `id, title, synopsis,
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
        <ThemedText type="title">{show.title}</ThemedText>
        <ThemedText style={styles.synopsis}>{show.synopsis}</ThemedText>
        <ThemedText type="subtitle" style={styles.episodesHeader}>
          Episode
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
  poster: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  synopsis: {
    marginBottom: 16,
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
});
