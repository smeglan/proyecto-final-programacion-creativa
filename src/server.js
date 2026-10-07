import { createServer } from 'node:http';
import { createAppointment, findAppointment, listAppointments } from './appointments.js';
import { createThemeRegistry } from './themes/index.js';
import { createBookReservation, findBookReservation, listBookReservations } from './bookReservations.js';
import { createOrder, findOrder, listOrders } from './orders.js';
import { createTicket, findTicket, listTickets } from './tickets.js';
import { createCosmeticAppointment, findCosmeticAppointment, listCosmeticAppointments } from './cosmeticAppointments.js';
import { createEyeAppointment, findEyeAppointment, listEyeAppointments } from './eyeAppointments.js';
import { apiSpecifications } from './openapi.js';

const themes = createThemeRegistry();
const port = Number(process.env.PORT) || 3000;

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end(JSON.stringify(body, null, 2));
}

async function readJsonBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 10_000) throw new Error('BODY_TOO_LARGE');
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error('INVALID_JSON');
  }
}

const server = createServer(async (request, response) => {
  try {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return response.end();
  }

  let pathname;
  try {
    pathname = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`).pathname;
  } catch {
    return sendJson(response, 400, { error: 'URL no válida.' });
  }

  if (request.method === 'GET' && pathname === '/docs') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return response.end('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Documentación de la API</title><body><h1>Documentación de la API</h1><ul><li><a href="/docs/barberia">API de Barbería</a></li><li><a href="/docs/libros">API de Libros</a></li><li><a href="/docs/marihuana">API de Marihuana</a></li><li><a href="/docs/peliculas">API de Películas</a></li><li><a href="/docs/cosmeticos">API de Cosméticos</a></li><li><a href="/docs/oftalmologia">API de Oftalmología</a></li></ul></body></html>');
  }

  const docsRoute = pathname.match(/^\/docs\/(barberia|libros|marihuana|peliculas|cosmeticos|oftalmologia)\/?$/);
  if (docsRoute && request.method === 'GET') {
    const grupo = docsRoute[1];
    const specUrl = `/api/openapi/${grupo}.json`;
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return response.end(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Documentación ${grupo}</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"></head><body><nav><a href="/docs">Todas las API</a></nav><div id="swagger-ui"></div><script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script><script>SwaggerUIBundle({ url: '${specUrl}', dom_id: '#swagger-ui' });</script></body></html>`);
  }

  const specRoute = pathname.match(/^\/api\/openapi\/(barberia|libros|marihuana|peliculas|cosmeticos|oftalmologia)\.json$/);
  if (specRoute && request.method === 'GET') return sendJson(response, 200, apiSpecifications[specRoute[1]]);

  const appointmentRoute = pathname.match(/^\/api\/barberia\/turnos(?:\/([^/]+))?\/?$/);
  if (appointmentRoute) {
    const id = appointmentRoute[1] ? decodeURIComponent(appointmentRoute[1]) : null;
    if (request.method === 'GET') {
      if (id) {
        const appointment = await findAppointment(id);
        return appointment
          ? sendJson(response, 200, appointment)
          : sendJson(response, 404, { error: 'Turno no encontrado.' });
      }
      const appointments = await listAppointments();
      return sendJson(response, 200, { cantidad: appointments.length, turnos: appointments });
    }
    if (request.method === 'POST' && !id) {
      let input;
      try {
        input = await readJsonBody(request);
      } catch (error) {
        const status = error.message === 'BODY_TOO_LARGE' ? 413 : 400;
        const message = error.message === 'BODY_TOO_LARGE' ? 'El cuerpo supera el límite de 10 KB.' : 'Envía un JSON válido.';
        return sendJson(response, status, { error: message });
      }
      const { nombre, servicio, fecha, hora } = input ?? {};
      if (![nombre, servicio, fecha, hora].every((value) => typeof value === 'string' && value.trim())) {
        return sendJson(response, 400, { error: 'Se requieren nombre, servicio, fecha y hora como textos no vacíos.' });
      }
      const appointment = await createAppointment({ nombre, servicio, fecha, hora });
      return sendJson(response, 201, appointment);
    }
    return sendJson(response, 405, { error: 'Usa GET para consultar turnos y POST para crear uno.' });
  }

  const bookReservationRoute = pathname.match(/^\/api\/libros\/reservas(?:\/([^/]+))?\/?$/);
  if (bookReservationRoute) {
    const id = bookReservationRoute[1] ? decodeURIComponent(bookReservationRoute[1]) : null;
    if (request.method === 'GET') {
      if (id) {
        const reservation = await findBookReservation(id);
        return reservation
          ? sendJson(response, 200, reservation)
          : sendJson(response, 404, { error: 'Reserva no encontrada.' });
      }
      const reservations = await listBookReservations();
      return sendJson(response, 200, { cantidad: reservations.length, reservas: reservations });
    }
    if (request.method === 'POST' && !id) {
      let input;
      try {
        input = await readJsonBody(request);
      } catch (error) {
        const status = error.message === 'BODY_TOO_LARGE' ? 413 : 400;
        const message = error.message === 'BODY_TOO_LARGE' ? 'El cuerpo supera el límite de 10 KB.' : 'Envía un JSON válido.';
        return sendJson(response, status, { error: message });
      }
      const { nombre, libroId } = input ?? {};
      if (typeof nombre !== 'string' || !nombre.trim() || !Number.isInteger(libroId) || libroId < 1) {
        return sendJson(response, 400, { error: 'Se requieren nombre (texto no vacío) y libroId (número entero).' });
      }
      const book = themes.find((theme) => theme.slug === 'libros')?.recursos.find((item) => item.id === libroId);
      if (!book) return sendJson(response, 404, { error: 'No existe un libro con ese libroId.' });
      const reservation = await createBookReservation({ nombre }, book);
      return sendJson(response, 201, reservation);
    }
    return sendJson(response, 405, { error: 'Usa GET para consultar reservas y POST para crear una.' });
  }

  const orderRoute = pathname.match(/^\/api\/marihuana\/pedidos(?:\/([^/]+))?\/?$/);
  if (orderRoute) {
    const id = orderRoute[1] ? decodeURIComponent(orderRoute[1]) : null;
    if (request.method === 'GET') {
      if (id) {
        const order = await findOrder(id);
        return order
          ? sendJson(response, 200, order)
          : sendJson(response, 404, { error: 'Pedido no encontrado.' });
      }
      const orders = await listOrders();
      return sendJson(response, 200, { cantidad: orders.length, pedidos: orders });
    }
    if (request.method === 'POST' && !id) {
      let input;
      try {
        input = await readJsonBody(request);
      } catch (error) {
        const status = error.message === 'BODY_TOO_LARGE' ? 413 : 400;
        const message = error.message === 'BODY_TOO_LARGE' ? 'El cuerpo supera el límite de 10 KB.' : 'Envía un JSON válido.';
        return sendJson(response, status, { error: message });
      }
      const { nombre, productoId, cantidad } = input ?? {};
      if (typeof nombre !== 'string' || !nombre.trim() || !Number.isInteger(productoId) || productoId < 1 || !Number.isInteger(cantidad) || cantidad < 1) {
        return sendJson(response, 400, { error: 'Se requieren nombre (texto no vacío), productoId (número entero) y cantidad (número entero mayor o igual a 1).' });
      }
      const product = themes.find((theme) => theme.slug === 'marihuana')?.recursos.find((item) => item.id === productoId);
      if (!product) return sendJson(response, 404, { error: 'No existe un producto con ese productoId.' });
      const order = await createOrder({ nombre, cantidad }, product);
      return sendJson(response, 201, order);
    }
    return sendJson(response, 405, { error: 'Usa GET para consultar pedidos y POST para crear uno.' });
  }

  const ticketRoute = pathname.match(/^\/api\/peliculas\/entradas(?:\/([^/]+))?\/?$/);
  if (ticketRoute) {
    const id = ticketRoute[1] ? decodeURIComponent(ticketRoute[1]) : null;
    if (request.method === 'GET') {
      if (id) {
        const ticket = await findTicket(id);
        return ticket
          ? sendJson(response, 200, ticket)
          : sendJson(response, 404, { error: 'Entrada no encontrada.' });
      }
      const tickets = await listTickets();
      return sendJson(response, 200, { cantidad: tickets.length, entradas: tickets });
    }
    if (request.method === 'POST' && !id) {
      let input;
      try {
        input = await readJsonBody(request);
      } catch (error) {
        const status = error.message === 'BODY_TOO_LARGE' ? 413 : 400;
        const message = error.message === 'BODY_TOO_LARGE' ? 'El cuerpo supera el límite de 10 KB.' : 'Envía un JSON válido.';
        return sendJson(response, status, { error: message });
      }
      const { nombre, peliculaId, cantidad } = input ?? {};
      if (typeof nombre !== 'string' || !nombre.trim() || !Number.isInteger(peliculaId) || peliculaId < 1 || !Number.isInteger(cantidad) || cantidad < 1) {
        return sendJson(response, 400, { error: 'Se requieren nombre (texto no vacío), peliculaId (número entero) y cantidad (número entero mayor o igual a 1).' });
      }
      const movie = themes.find((theme) => theme.slug === 'peliculas')?.recursos.find((item) => item.id === peliculaId);
      if (!movie) return sendJson(response, 404, { error: 'No existe una película con ese peliculaId.' });
      const ticket = await createTicket({ nombre, cantidad }, movie);
      return sendJson(response, 201, ticket);
    }
    return sendJson(response, 405, { error: 'Usa GET para consultar entradas y POST para crear una.' });
  }

  const cosmeticAppointmentRoute = pathname.match(/^\/api\/cosmeticos\/citas(?:\/([^/]+))?\/?$/);
  if (cosmeticAppointmentRoute) {
    const id = cosmeticAppointmentRoute[1] ? decodeURIComponent(cosmeticAppointmentRoute[1]) : null;
    if (request.method === 'GET') {
      if (id) {
        const appointment = await findCosmeticAppointment(id);
        return appointment
          ? sendJson(response, 200, appointment)
          : sendJson(response, 404, { error: 'Cita no encontrada.' });
      }
      const appointments = await listCosmeticAppointments();
      return sendJson(response, 200, { cantidad: appointments.length, citas: appointments });
    }
    if (request.method === 'POST' && !id) {
      let input;
      try {
        input = await readJsonBody(request);
      } catch (error) {
        const status = error.message === 'BODY_TOO_LARGE' ? 413 : 400;
        const message = error.message === 'BODY_TOO_LARGE' ? 'El cuerpo supera el límite de 10 KB.' : 'Envía un JSON válido.';
        return sendJson(response, status, { error: message });
      }
      const { nombre, servicio, fecha, hora } = input ?? {};
      if (![nombre, servicio, fecha, hora].every((value) => typeof value === 'string' && value.trim())) {
        return sendJson(response, 400, { error: 'Se requieren nombre, servicio, fecha y hora como textos no vacíos.' });
      }
      const appointment = await createCosmeticAppointment({ nombre, servicio, fecha, hora });
      return sendJson(response, 201, appointment);
    }
    return sendJson(response, 405, { error: 'Usa GET para consultar citas y POST para crear una.' });
  }

  const eyeAppointmentRoute = pathname.match(/^\/api\/oftalmologia\/citas(?:\/([^/]+))?\/?$/);
  if (eyeAppointmentRoute) {
    const id = eyeAppointmentRoute[1] ? decodeURIComponent(eyeAppointmentRoute[1]) : null;
    if (request.method === 'GET') {
      if (id) {
        const appointment = await findEyeAppointment(id);
        return appointment
          ? sendJson(response, 200, appointment)
          : sendJson(response, 404, { error: 'Cita no encontrada.' });
      }
      const appointments = await listEyeAppointments();
      return sendJson(response, 200, { cantidad: appointments.length, citas: appointments });
    }
    if (request.method === 'POST' && !id) {
      let input;
      try {
        input = await readJsonBody(request);
      } catch (error) {
        const status = error.message === 'BODY_TOO_LARGE' ? 413 : 400;
        const message = error.message === 'BODY_TOO_LARGE' ? 'El cuerpo supera el límite de 10 KB.' : 'Envía un JSON válido.';
        return sendJson(response, status, { error: message });
      }
      const { pacienteId, motivo, fecha, hora } = input ?? {};
      if (!Number.isInteger(pacienteId) || pacienteId < 1 || ![motivo, fecha, hora].every((value) => typeof value === 'string' && value.trim())) {
        return sendJson(response, 400, { error: 'Se requieren pacienteId (número entero), motivo, fecha y hora como textos no vacíos.' });
      }
      const patient = themes.find((theme) => theme.slug === 'oftalmologia')?.recursos.find((item) => item.id === pacienteId);
      if (!patient) return sendJson(response, 404, { error: 'No existe un paciente con ese pacienteId.' });
      const appointment = await createEyeAppointment({ motivo, fecha, hora }, patient);
      return sendJson(response, 201, appointment);
    }
    return sendJson(response, 405, { error: 'Usa GET para consultar citas y POST para crear una.' });
  }

  if (request.method !== 'GET') {
    return sendJson(response, 405, { error: 'Método no permitido. Esta ruta solo acepta GET.' });
  }

  if (pathname === '/' || pathname === '/api') {
    return sendJson(response, 200, {
      nombre: 'API por temáticas',
      mensaje: 'Explora los recursos organizados por temática.',
      rutas: { tematicas: '/api/tematicas', recursos: '/api/:tematica' }
    });
  }

  if (pathname === '/api/tematicas') {
    return sendJson(response, 200, {
      cantidad: themes.length,
      tematicas: themes.map(({ slug, nombre, descripcion, ruta }) => ({ slug, nombre, descripcion, ruta }))
    });
  }

  let segments;
  try {
    segments = pathname.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return sendJson(response, 400, { error: 'La ruta contiene caracteres no válidos.' });
  }
  if (segments[0] !== 'api' || !segments[1]) {
    return sendJson(response, 404, { error: 'Ruta no encontrada.' });
  }

  const theme = themes.find((item) => item.slug === segments[1]);
  if (!theme) {
    return sendJson(response, 404, {
      error: `No existe la temática "${segments[1]}".`,
      tematicasDisponibles: themes.map(({ slug }) => slug)
    });
  }

  if (segments.length === 2) {
    return sendJson(response, 200, { tematica: theme.nombre, cantidad: theme.recursos.length, recursos: theme.recursos });
  }

  if (segments.length === 3) {
    const recurso = theme.recursos.find((item) => String(item.id) === segments[2]);
    return recurso
      ? sendJson(response, 200, recurso)
      : sendJson(response, 404, { error: 'Recurso no encontrado en esta temática.' });
  }

  return sendJson(response, 404, { error: 'Ruta no encontrada.' });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return sendJson(response, 500, { error: 'Error interno del servidor.' });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`API disponible en el puerto ${port}`);
});
