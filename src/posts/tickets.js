import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const dataDirectory = process.env.DATA_DIR || './data';
const filePath = path.join(dataDirectory, 'entradas-peliculas.json');

async function readTickets() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(filePath, '[]\n', 'utf8');
    return [];
  }
}

export async function listTickets() {
  return readTickets();
}

export async function findTicket(id) {
  const tickets = await readTickets();
  return tickets.find((ticket) => ticket.id === id) ?? null;
}

export async function createTicket(input, movie) {
  const tickets = await readTickets();
  const cantidad = input.cantidad;
  const ticket = {
    id: randomUUID(),
    nombre: input.nombre.trim(),
    peliculaId: movie.id,
    titulo: movie.titulo,
    genero: movie.genero,
    cantidad,
    precioUnitario: movie.precio,
    total: movie.precio * cantidad,
    estado: 'reservada',
    creadoEn: new Date().toISOString()
  };
  tickets.push(ticket);
  await writeFile(filePath, `${JSON.stringify(tickets, null, 2)}\n`, 'utf8');
  return ticket;
}
