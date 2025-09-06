import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Layout:
 * - Cada slide (CARD_WIDTH) es más angosto que la ventana para que “asomen” los vecinos.
 * - Parallax con escala suave y offset alineado al espacio lateral real.
 */
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.28); // ancho de la tarjeta central visible
const SIDE_PREVIEW = Math.round((SCREEN_WIDTH - CARD_WIDTH) / 50); // lo que “asoma” a cada lado
const GUTTER = 12; // padding interno del slide

const POSTER_WIDTH = CARD_WIDTH - GUTTER * 2;
const POSTER_HEIGHT = Math.round(POSTER_WIDTH * 1.5); // relación 2:3

export const CAROUSEL = {
  CARD_WIDTH,
  SIDE_PREVIEW,
  GUTTER,
  POSTER_WIDTH,
  POSTER_HEIGHT,
  SCREEN_WIDTH
};
