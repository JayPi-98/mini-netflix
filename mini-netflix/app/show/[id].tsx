import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { findShowById } from '@/data/catalog';

export default function ShowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const show = findShowById(Array.isArray(id) ? id[0] : id);

  if (!show) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No show found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      <Stack.Screen options={{ title: show.title }} />
      <Image source={{ uri: show.poster }} style={styles.poster} />
      <ThemedView style={styles.content}>
        <ThemedText type="title">{show.title}</ThemedText>
        <ThemedText style={styles.synopsis}>{show.synopsis}</ThemedText>
        <ThemedText type="subtitle" style={styles.episodesHeader}>
          Episodios
        </ThemedText>
        {show.episodes.map((ep, index) => (
          <ThemedText key={ep.id}>
            {index + 1}. {ep.title}
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
