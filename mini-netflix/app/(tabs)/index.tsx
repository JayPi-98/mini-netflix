import { Image } from 'expo-image';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { catalog } from '@/data/catalog';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <FlatList
      data={catalog}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ThemedView style={styles.category}>
          <ThemedText type="subtitle" style={styles.categoryTitle}>
            {item.title}
          </ThemedText>
          <FlatList
            data={item.shows}
            keyExtractor={(show) => show.id}
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
