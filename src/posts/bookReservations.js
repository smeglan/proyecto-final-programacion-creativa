import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const dataDirectory = process.env.DATA_DIR || './data';
const filePath = path.join(dataDirectory, 'reservas-libros.json');

async function readReservations() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(filePath, '[]\n', 'utf8');
    return [];
  }
}

export async function listBookReservations() {
  return readReservations();
}

export async function findBookReservation(id) {
  const reservations = await readReservations();
  return reservations.find((reservation) => reservation.id === id) ?? null;
}

export async function createBookReservation(input, book) {
  const reservations = await readReservations();
  const reservation = {
    id: randomUUID(),
    nombre: input.nombre.trim(),
    libroId: book.id,
    titulo: book.titulo,
    estado: 'reservado',
    creadoEn: new Date().toISOString()
  };
  reservations.push(reservation);
  await writeFile(filePath, `${JSON.stringify(reservations, null, 2)}\n`, 'utf8');
  return reservation;
}
