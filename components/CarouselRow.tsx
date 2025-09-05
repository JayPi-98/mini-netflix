import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CAROUSEL } from '@/constants/Cards';
import type { Category, Show } from '@/data/catalog';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

type Props = {
  category: Category;
};

const { CARD_WIDTH, SIDE_PREVIEW, GUTTER, POSTER_WIDTH, POSTER_HEIGHT, SCREEN_WIDTH } = CAROUSEL;

export function CarouselRow({ category }: Props) {
  const router = useRouter();
  const ref = useRef<ICarouselInstance | null>(null);
  const [index, setIndex] = useState(0);

  const shows = (category?.shows ?? []).filter(Boolean) as Show[];

  return (
    <ThemedView style={styles.category}>
      <ThemedText type="subtitle" style={styles.categoryTitle}>
        {category.title}
      </ThemedText>

      <View style={styles.carouselContainer} pointerEvents="box-none">
        {/* Flecha izquierda */}
        <Pressable
          accessibilityLabel={`Previous in ${category.title}`}
          onPress={() => ref.current?.prev()}
          hitSlop={12}
          style={[styles.arrow, { left: SIDE_PREVIEW - 6 }]}
        >
          <Ionicons name="chevron-back" size={22} color={'#fff'} />
        </Pressable>

        {/* Viewport a ancho completo para permitir ver vecinos */}
        <View style={{ width: SCREEN_WIDTH, overflow: 'visible' }}>
          <Carousel
            ref={ref as any}
            width={CARD_WIDTH}                         // cada página más angosta que el viewport
            height={POSTER_HEIGHT + 56}               // póster + título
            loop
            pagingEnabled
            data={shows}
            onSnapToItem={setIndex}
            style={{ alignSelf: 'center', overflow: 'visible' }}
            containerStyle={{ overflow: 'visible' }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.98,           // central ligeramente más grande
              parallaxAdjacentItemScale: 0.9,         // vecinos más pequeños
              parallaxScrollingOffset: SIDE_PREVIEW - GUTTER, // cuánto “asoman”
            }}
            renderItem={({ item }) => (
              <Pressable
                key={String(item.id)}
                onPress={() =>
                  router.push({ pathname: '/show/[id]', params: { id: item.id } })
                }
                style={styles.posterContainer}
              >
                <Image
                  source={item.poster ? { uri: item.poster } : undefined}
                  style={styles.poster}
                  contentFit="cover"
                  transition={150}
                />
                <ThemedText numberOfLines={1} style={styles.posterTitle}>
                  {item.title}
                </ThemedText>
              </Pressable>
            )}
          />
        </View>

        {/* Flecha derecha */}
        <Pressable
          accessibilityLabel={`Next in ${category.title}`}
          onPress={() => ref.current?.next()}
          hitSlop={12}
          style={[styles.arrow, { right: SIDE_PREVIEW - 6 }]}
        >
          <Ionicons name="chevron-forward" size={22} color={'#fff'} />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  category: {
    marginBottom: 28,
  },
  categoryTitle: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  carouselContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterContainer: {
    width: POSTER_WIDTH,
    alignItems: 'center',
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#222',
  },
  posterTitle: {
    width: POSTER_WIDTH,
    textAlign: 'center',
  },
  arrow: {
    position: 'absolute',
    top: (POSTER_HEIGHT + 56) / 2 - 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 100,
    elevation: 6,
  },
});

export default CarouselRow;
