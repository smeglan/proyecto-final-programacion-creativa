import { animales } from './animales.js';
import { espacio } from './espacio.js';
import { historia } from './historia.js';
import { barberia } from './barberia.js';
import { libros } from './libros.js';
import { marihuana } from './marihuana.js';
import { peliculas } from './peliculas.js';
import { cosmeticos } from './cosmeticos.js';
import { oftalmologia } from './oftalmologia.js';

export function createThemeRegistry() {
  return [animales, espacio, historia, barberia, libros, marihuana, peliculas, cosmeticos, oftalmologia];
}
