import { animales } from './animales.js';
import { espacio } from './espacio.js';
import { historia } from './historia.js';
import { barberia } from './barberia.js';
import { libros } from './libros.js';

export function createThemeRegistry() {
  return [animales, espacio, historia, barberia, libros];
}
