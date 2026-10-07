import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const dataDirectory = process.env.DATA_DIR || './data';
const filePath = path.join(dataDirectory, 'pedidos-marihuana.json');

async function readOrders() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(filePath, '[]\n', 'utf8');
    return [];
  }
}

export async function listOrders() {
  return readOrders();
}

export async function findOrder(id) {
  const orders = await readOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function createOrder(input, product) {
  const orders = await readOrders();
  const cantidad = input.cantidad;
  const order = {
    id: randomUUID(),
    nombre: input.nombre.trim(),
    productoId: product.id,
    producto: product.producto,
    categoria: product.categoria,
    cantidad,
    precioUnitario: product.precio,
    total: product.precio * cantidad,
    estado: 'pendiente',
    creadoEn: new Date().toISOString()
  };
  orders.push(order);
  await writeFile(filePath, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
  return order;
}
