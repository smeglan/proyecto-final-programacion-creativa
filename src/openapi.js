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

const ticketSchema = {
  type: 'object', properties: {
    id: { type: 'string' }, nombre: { type: 'string' }, peliculaId: { type: 'integer' },
    titulo: { type: 'string' }, genero: { type: 'string' }, cantidad: { type: 'integer' },
    precioUnitario: { type: 'integer' }, total: { type: 'integer' },
    estado: { type: 'string', example: 'reservada' }, creadoEn: { type: 'string', format: 'date-time' }
  }
};

const cosmeticAppointmentSchema = {
  type: 'object', properties: {
    id: { type: 'string' }, nombre: { type: 'string' }, servicio: { type: 'string' },
    fecha: { type: 'string', example: '2026-10-10' }, hora: { type: 'string', example: '10:30' },
    estado: { type: 'string', example: 'confirmado' }, creadoEn: { type: 'string', format: 'date-time' }
  }
};

const eyeAppointmentSchema = {
  type: 'object', properties: {
    id: { type: 'string' }, pacienteId: { type: 'integer' }, paciente: { type: 'string' },
    diagnostico: { type: 'string' }, motivo: { type: 'string' },
    fecha: { type: 'string', example: '2026-10-10' }, hora: { type: 'string', example: '10:30' },
    estado: { type: 'string', example: 'confirmado' }, creadoEn: { type: 'string', format: 'date-time' }
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
  },
  peliculas: {
    openapi: '3.0.3', info: { title: 'API de Películas', version: '1.0.0', description: 'Consulta la cartelera y crea o consulta entradas de películas.' },
    servers: [{ url: '/' }], tags: [{ name: 'Cartelera' }, { name: 'Entradas' }],
    paths: {
      '/api/peliculas': {
        get: { tags: ['Cartelera'], summary: 'Listar películas disponibles', responses: { 200: jsonResponse('Películas disponibles', { type: 'object', properties: { tematica: { type: 'string' }, cantidad: { type: 'integer' }, recursos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, titulo: { type: 'string' }, genero: { type: 'string' }, anio: { type: 'integer' }, duracionMinutos: { type: 'integer' }, clasificacion: { type: 'string' }, precio: { type: 'integer' } } } } } }) } }
      },
      '/api/peliculas/{id}': {
        get: { tags: ['Cartelera'], summary: 'Consultar una película', parameters: [{ ...idParameter, description: 'ID de la película en la cartelera.' }], responses: { 200: jsonResponse('Película encontrada', { type: 'object' }), 404: errorResponse } }
      },
      '/api/peliculas/entradas': {
        get: { tags: ['Entradas'], summary: 'Listar entradas', responses: { 200: jsonResponse('Entradas registradas', { type: 'object', properties: { cantidad: { type: 'integer' }, entradas: { type: 'array', items: { $ref: '#/components/schemas/Entrada' } } } }) } },
        post: { tags: ['Entradas'], summary: 'Reservar entradas de una película', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre', 'peliculaId', 'cantidad'], properties: { nombre: { type: 'string', example: 'Ana' }, peliculaId: { type: 'integer', example: 1, description: 'ID existente en la cartelera de películas.' }, cantidad: { type: 'integer', example: 2, description: 'Número de entradas, mayor o igual a 1.' } } } } } }, responses: { 201: jsonResponse('Entrada creada', { $ref: '#/components/schemas/Entrada' }), 400: errorResponse, 404: errorResponse, 413: { description: 'El cuerpo supera 10 KB.' } } }
      },
      '/api/peliculas/entradas/{id}': {
        get: { tags: ['Entradas'], summary: 'Consultar una entrada', parameters: [idParameter], responses: { 200: jsonResponse('Entrada encontrada', { $ref: '#/components/schemas/Entrada' }), 404: errorResponse } }
      }
    }, components: { schemas: { ...sharedSchemas, Entrada: ticketSchema } }
  },
  cosmeticos: {
    openapi: '3.0.3', info: { title: 'API de Cosméticos', version: '1.0.0', description: 'Consulta los servicios de cosmetología y gestiona citas.' },
    servers: [{ url: '/' }], tags: [{ name: 'Servicios' }, { name: 'Citas' }],
    paths: {
      '/api/cosmeticos': {
        get: { tags: ['Servicios'], summary: 'Listar servicios de cosmetología disponibles', responses: { 200: jsonResponse('Servicios disponibles', { type: 'object', properties: { tematica: { type: 'string' }, cantidad: { type: 'integer' }, recursos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, servicio: { type: 'string' }, duracionMinutos: { type: 'integer' }, precio: { type: 'integer' } } } } } }) } }
      },
      '/api/cosmeticos/{id}': {
        get: { tags: ['Servicios'], summary: 'Consultar un servicio', parameters: [{ ...idParameter, description: 'ID del servicio en el catálogo.' }], responses: { 200: jsonResponse('Servicio encontrado', { type: 'object' }), 404: errorResponse } }
      },
      '/api/cosmeticos/citas': {
        get: { tags: ['Citas'], summary: 'Listar citas', responses: { 200: jsonResponse('Citas registradas', { type: 'object', properties: { cantidad: { type: 'integer' }, citas: { type: 'array', items: { $ref: '#/components/schemas/Cita' } } } }) } },
        post: { tags: ['Citas'], summary: 'Crear una cita', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre', 'servicio', 'fecha', 'hora'], properties: { nombre: { type: 'string' }, servicio: { type: 'string' }, fecha: { type: 'string', example: '2026-10-10' }, hora: { type: 'string', example: '10:30' } } } } } }, responses: { 201: jsonResponse('Cita creada', { $ref: '#/components/schemas/Cita' }), 400: errorResponse, 413: { description: 'El cuerpo supera 10 KB.' } } }
      },
      '/api/cosmeticos/citas/{id}': {
        get: { tags: ['Citas'], summary: 'Consultar una cita', parameters: [idParameter], responses: { 200: jsonResponse('Cita encontrada', { $ref: '#/components/schemas/Cita' }), 404: errorResponse } }
      }
    }, components: { schemas: { ...sharedSchemas, Cita: cosmeticAppointmentSchema } }
  },
  oftalmologia: {
    openapi: '3.0.3', info: { title: 'API de Oftalmología', version: '1.0.0', description: 'Consulta los pacientes y gestiona citas de una consulta de oftalmología.' },
    servers: [{ url: '/' }], tags: [{ name: 'Pacientes' }, { name: 'Citas' }],
    paths: {
      '/api/oftalmologia': {
        get: { tags: ['Pacientes'], summary: 'Listar pacientes', responses: { 200: jsonResponse('Pacientes registrados', { type: 'object', properties: { tematica: { type: 'string' }, cantidad: { type: 'integer' }, recursos: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, edad: { type: 'integer' }, diagnostico: { type: 'string' }, agudezaVisual: { type: 'string' } } } } } }) } }
      },
      '/api/oftalmologia/{id}': {
        get: { tags: ['Pacientes'], summary: 'Consultar un paciente', parameters: [{ ...idParameter, description: 'ID del paciente en la consulta.' }], responses: { 200: jsonResponse('Paciente encontrado', { type: 'object' }), 404: errorResponse } }
      },
      '/api/oftalmologia/citas': {
        get: { tags: ['Citas'], summary: 'Listar citas', responses: { 200: jsonResponse('Citas registradas', { type: 'object', properties: { cantidad: { type: 'integer' }, citas: { type: 'array', items: { $ref: '#/components/schemas/Cita' } } } }) } },
        post: { tags: ['Citas'], summary: 'Crear una cita para un paciente', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['pacienteId', 'motivo', 'fecha', 'hora'], properties: { pacienteId: { type: 'integer', example: 1, description: 'ID existente en la lista de pacientes.' }, motivo: { type: 'string', example: 'Control de miopía' }, fecha: { type: 'string', example: '2026-10-10' }, hora: { type: 'string', example: '10:30' } } } } } }, responses: { 201: jsonResponse('Cita creada', { $ref: '#/components/schemas/Cita' }), 400: errorResponse, 404: errorResponse, 413: { description: 'El cuerpo supera 10 KB.' } } }
      },
      '/api/oftalmologia/citas/{id}': {
        get: { tags: ['Citas'], summary: 'Consultar una cita', parameters: [idParameter], responses: { 200: jsonResponse('Cita encontrada', { $ref: '#/components/schemas/Cita' }), 404: errorResponse } }
      }
    }, components: { schemas: { ...sharedSchemas, Cita: eyeAppointmentSchema } }
  }
};
