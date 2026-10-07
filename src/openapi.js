const idParameter = {
  name: 'id', in: 'path', required: true,
  schema: { type: 'string' }, description: 'ID devuelto al crear el registro.'
};

const jsonResponse = (description, schema) => ({
  description,
  content: { 'application/json': { schema } }
});

const errorResponse = {
  description: 'Solicitud incorrecta o recurso no encontrado.',
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
};

const sharedSchemas = {
  Error: {
    type: 'object', properties: { error: { type: 'string' } }
  }
};

const appointmentSchema = {
  type: 'object', properties: {
    id: { type: 'string' }, nombre: { type: 'string' }, servicio: { type: 'string' },
    fecha: { type: 'string', example: '2026-10-10' }, hora: { type: 'string', example: '10:30' },
    estado: { type: 'string', example: 'confirmado' }, creadoEn: { type: 'string', format: 'date-time' }
  }
};

const reservationSchema = {
  type: 'object', properties: {
    id: { type: 'string' }, nombre: { type: 'string' }, libroId: { type: 'integer' },
    titulo: { type: 'string' }, estado: { type: 'string', example: 'reservado' },
    creadoEn: { type: 'string', format: 'date-time' }
  }
};

const orderSchema = {
  type: 'object', properties: {
    id: { type: 'string' }, nombre: { type: 'string' }, productoId: { type: 'integer' },
    producto: { type: 'string' }, categoria: { type: 'string' }, cantidad: { type: 'integer' },
    precioUnitario: { type: 'integer' }, total: { type: 'integer' },
    estado: { type: 'string', example: 'pendiente' }, creadoEn: { type: 'string', format: 'date-time' }
  }
};

export const apiSpecifications = {
  barberia: {
    openapi: '3.0.3', info: { title: 'API de Barbería', version: '1.0.0', description: 'Consulta los servicios y gestiona turnos de barbería.' },
    servers: [{ url: '/' }], tags: [{ name: 'Servicios' }, { name: 'Turnos' }],
    paths: {
      '/api/barberia': {
        get: { tags: ['Servicios'], summary: 'Listar servicios disponibles', responses: { 200: jsonResponse('Lista de servicios', { type: 'object', properties: { tematica: { type: 'string' }, cantidad: { type: 'integer' }, recursos: { type: 'array', items: { type: 'object' } } } }) } }
      },
      '/api/barberia/turnos': {
        get: { tags: ['Turnos'], summary: 'Listar turnos', responses: { 200: jsonResponse('Turnos registrados', { type: 'object', properties: { cantidad: { type: 'integer' }, turnos: { type: 'array', items: { $ref: '#/components/schemas/Turno' } } } }) } },
        post: { tags: ['Turnos'], summary: 'Crear un turno', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre', 'servicio', 'fecha', 'hora'], properties: { nombre: { type: 'string' }, servicio: { type: 'string' }, fecha: { type: 'string', example: '2026-10-10' }, hora: { type: 'string', example: '10:30' } } } } } }, responses: { 201: jsonResponse('Turno creado', { $ref: '#/components/schemas/Turno' }), 400: errorResponse, 413: { description: 'El cuerpo supera 10 KB.' } } }
      },
      '/api/barberia/turnos/{id}': {
        get: { tags: ['Turnos'], summary: 'Consultar un turno', parameters: [idParameter], responses: { 200: jsonResponse('Turno encontrado', { $ref: '#/components/schemas/Turno' }), 404: errorResponse } }
      }
    }, components: { schemas: { ...sharedSchemas, Turno: appointmentSchema } }
  },
  libros: {
    openapi: '3.0.3', info: { title: 'API de Libros', version: '1.0.0', description: 'Consulta el catálogo y crea o consulta reservas de libros.' },
    servers: [{ url: '/' }], tags: [{ name: 'Catálogo' }, { name: 'Reservas' }],
    paths: {
      '/api/libros': {
        get: { tags: ['Catálogo'], summary: 'Listar libros', responses: { 200: jsonResponse('Libros disponibles', { type: 'object', properties: { tematica: { type: 'string' }, cantidad: { type: 'integer' }, recursos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, titulo: { type: 'string' }, autor: { type: 'string' }, anio: { type: 'integer' }, genero: { type: 'string' } } } } } }) } }
      },
      '/api/libros/{id}': {
        get: { tags: ['Catálogo'], summary: 'Consultar un libro', parameters: [{ ...idParameter, description: 'ID del libro en el catálogo.' }], responses: { 200: jsonResponse('Libro encontrado', { type: 'object' }), 404: errorResponse } }
      },
      '/api/libros/reservas': {
        get: { tags: ['Reservas'], summary: 'Listar reservas', responses: { 200: jsonResponse('Reservas registradas', { type: 'object', properties: { cantidad: { type: 'integer' }, reservas: { type: 'array', items: { $ref: '#/components/schemas/Reserva' } } } }) } },
        post: { tags: ['Reservas'], summary: 'Reservar un libro del catálogo', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre', 'libroId'], properties: { nombre: { type: 'string', example: 'Ana' }, libroId: { type: 'integer', example: 1, description: 'ID existente en el catálogo de libros.' } } } } } }, responses: { 201: jsonResponse('Reserva creada', { $ref: '#/components/schemas/Reserva' }), 400: errorResponse, 404: errorResponse, 413: { description: 'El cuerpo supera 10 KB.' } } }
      },
      '/api/libros/reservas/{id}': {
        get: { tags: ['Reservas'], summary: 'Consultar una reserva', parameters: [idParameter], responses: { 200: jsonResponse('Reserva encontrada', { $ref: '#/components/schemas/Reserva' }), 404: errorResponse } }
      }
    }, components: { schemas: { ...sharedSchemas, Reserva: reservationSchema } }
  },
  marihuana: {
    openapi: '3.0.3', info: { title: 'API de Marihuana', version: '1.0.0', description: 'Consulta los productos y gestiona pedidos de una tienda de marihuana.' },
    servers: [{ url: '/' }], tags: [{ name: 'Productos' }, { name: 'Pedidos' }],
    paths: {
      '/api/marihuana': {
        get: { tags: ['Productos'], summary: 'Listar productos disponibles', responses: { 200: jsonResponse('Productos disponibles', { type: 'object', properties: { tematica: { type: 'string' }, cantidad: { type: 'integer' }, recursos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, producto: { type: 'string' }, categoria: { type: 'string' }, thc: { type: 'string' }, precio: { type: 'integer' } } } } } }) } }
      },
      '/api/marihuana/{id}': {
        get: { tags: ['Productos'], summary: 'Consultar un producto', parameters: [{ ...idParameter, description: 'ID del producto en el catálogo.' }], responses: { 200: jsonResponse('Producto encontrado', { type: 'object' }), 404: errorResponse } }
      },
      '/api/marihuana/pedidos': {
        get: { tags: ['Pedidos'], summary: 'Listar pedidos', responses: { 200: jsonResponse('Pedidos registrados', { type: 'object', properties: { cantidad: { type: 'integer' }, pedidos: { type: 'array', items: { $ref: '#/components/schemas/Pedido' } } } }) } },
        post: { tags: ['Pedidos'], summary: 'Crear un pedido de un producto del catálogo', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre', 'productoId', 'cantidad'], properties: { nombre: { type: 'string', example: 'Ana' }, productoId: { type: 'integer', example: 1, description: 'ID existente en el catálogo de marihuana.' }, cantidad: { type: 'integer', example: 2, description: 'Número de unidades, mayor o igual a 1.' } } } } } }, responses: { 201: jsonResponse('Pedido creado', { $ref: '#/components/schemas/Pedido' }), 400: errorResponse, 404: errorResponse, 413: { description: 'El cuerpo supera 10 KB.' } } }
      },
      '/api/marihuana/pedidos/{id}': {
        get: { tags: ['Pedidos'], summary: 'Consultar un pedido', parameters: [idParameter], responses: { 200: jsonResponse('Pedido encontrado', { $ref: '#/components/schemas/Pedido' }), 404: errorResponse } }
      }
    }, components: { schemas: { ...sharedSchemas, Pedido: orderSchema } }
  }
};
