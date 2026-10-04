import { createServer } from 'node:http';
import { createAppointment, findAppointment, listAppointments } from './appointments.js';
import { createThemeRegistry } from './themes/index.js';

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
