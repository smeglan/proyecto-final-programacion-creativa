import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const dataDirectory = process.env.DATA_DIR || './data';

function filePathFor(slug) {
  return path.join(dataDirectory, `publicaciones-${slug}.json`);
}

async function readPublications(slug) {
  await mkdir(dataDirectory, { recursive: true });
  const filePath = filePathFor(slug);
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(filePath, '[]\n', 'utf8');
    return [];
  }
}

export async function listPublications(slug) {
  return readPublications(slug);
}

export async function findPublication(slug, id) {
  const publications = await readPublications(slug);
  return publications.find((publication) => publication.id === id) ?? null;
}

export async function createPublication(slug, input) {
  const publications = await readPublications(slug);
  const publication = {
    id: randomUUID(),
    tematica: slug,
    titulo: input.titulo.trim(),
    contenido: input.contenido.trim(),
    estado: 'publicada',
    creadoEn: new Date().toISOString()
  };
  publications.push(publication);
  await writeFile(filePathFor(slug), `${JSON.stringify(publications, null, 2)}\n`, 'utf8');
  return publication;
}
