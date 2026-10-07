# Guía de la API para estudiantes

Esta API permite consultar recursos organizados por temática y practicar cómo crear y consultar turnos de una barbería y reservas de libros. Las respuestas están en formato JSON.

## Antes de empezar

Cuando la API se ejecuta en tu computador, la dirección base es:

```text
http://localhost:3000
```

Si tu profesor comparte una URL de Railway, reemplaza `http://localhost:3000` por esa URL. Puedes abrir las rutas `GET` en el navegador. Para enviar un `POST`, usa Postman, Insomnia, Thunder Client o el ejemplo de JavaScript de esta guía.

## ¿Qué significan GET y POST?

- **GET** solicita información. Puedes consultar temáticas, libros, servicios, turnos y reservas.
- **POST** envía información para crear un turno o una reserva.

## Rutas disponibles

| Método | Ruta | Para qué sirve |
| --- | --- | --- |
| GET | `/` | Muestra información inicial |
| GET | `/api/tematicas` | Lista las temáticas disponibles |
| GET | `/api/animales` | Consulta ejemplos de animales |
| GET | `/api/espacio` | Consulta ejemplos sobre el espacio |
| GET | `/api/historia` | Consulta acontecimientos históricos |
| GET | `/api/barberia` | Consulta servicios de barbería |
| GET | `/api/barberia/turnos` | Consulta todos los turnos creados |
| GET | `/api/barberia/turnos/ID` | Consulta un turno usando su ID |
| POST | `/api/barberia/turnos` | Crea un turno |
| GET | `/api/libros` | Consulta el catálogo de libros |
| GET | `/api/libros/ID` | Consulta un libro por su ID |
| GET | `/api/libros/reservas` | Consulta todas las reservas creadas |
| GET | `/api/libros/reservas/ID` | Consulta una reserva por su ID |
| POST | `/api/libros/reservas` | Crea una reserva de libro |
| GET | `/api/marihuana` | Consulta el catálogo de productos |
| GET | `/api/marihuana/ID` | Consulta un producto por su ID |
| GET | `/api/marihuana/pedidos` | Consulta todos los pedidos creados |
| GET | `/api/marihuana/pedidos/ID` | Consulta un pedido por su ID |
| POST | `/api/marihuana/pedidos` | Crea un pedido de producto |

## Consultar recursos

Abre `http://localhost:3000/api/tematicas` para ver los temas disponibles. Puedes consultar los servicios de barbería en `/api/barberia` y el catálogo de libros en `/api/libros`.

## Crear un turno de barbería

Envía un `POST` a `/api/barberia/turnos` con estos campos como JSON:

```json
{
  "nombre": "Ana",
  "servicio": "Corte y barba",
  "fecha": "2026-10-10",
  "hora": "10:30"
}
```

En Postman, selecciona el método **POST**, escribe la URL, elige **Body → raw → JSON** y envía el objeto. La respuesta contiene el turno creado y un ID que puedes usar para consultarlo después.

```js
const respuesta = await fetch('http://localhost:3000/api/barberia/turnos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Ana', servicio: 'Corte y barba', fecha: '2026-10-10', hora: '10:30' })
});
const turno = await respuesta.json();
console.log(turno);
```

Puedes consultar todos los turnos en `/api/barberia/turnos` o uno en `/api/barberia/turnos/ID`.

## Reservar un libro

Consulta primero `/api/libros` y elige el ID de un libro. Envía un `POST` a `/api/libros/reservas` con tu nombre y el ID:

```json
{
  "nombre": "Ana",
  "libroId": 1
}
```

La API responde con el ID de la reserva, el título del libro, su estado y la fecha de creación. Puedes consultar todas las reservas en `/api/libros/reservas` o una reserva en `/api/libros/reservas/ID`.

```js
const respuesta = await fetch('http://localhost:3000/api/libros/reservas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Ana', libroId: 1 })
});
const reserva = await respuesta.json();
console.log(reserva);
```

## Hacer un pedido de marihuana

Consulta primero `/api/marihuana` y elige el ID de un producto. Envía un `POST` a `/api/marihuana/pedidos` con tu nombre, el ID del producto y la cantidad:

```json
{
  "nombre": "Ana",
  "productoId": 1,
  "cantidad": 2
}
```

La API responde con el ID del pedido, el producto, su categoría, la cantidad, el precio unitario, el total, su estado y la fecha de creación. Puedes consultar todos los pedidos en `/api/marihuana/pedidos` o uno en `/api/marihuana/pedidos/ID`.

```js
const respuesta = await fetch('http://localhost:3000/api/marihuana/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Ana', productoId: 1, cantidad: 2 })
});
const pedido = await respuesta.json();
console.log(pedido);
```

## Documentación interactiva

Las rutas y ejemplos también están disponibles en Swagger UI, separados por servicio: `/docs/barberia`, `/docs/libros` y `/docs/marihuana`. Las guías especializadas están en [API de Barbería](./GUIA_BARBERIA.md), [API de Libros](./GUIA_LIBROS.md) y [API de Marihuana](./GUIA_MARIHUANA.md).

## Códigos de respuesta comunes

| Código | Significado |
| --- | --- |
| 200 | La consulta se realizó correctamente |
| 201 | El turno o la reserva se creó correctamente |
| 400 | El JSON no es válido o faltan campos requeridos |
| 404 | La ruta, recurso, turno o libro no existe |
| 405 | El método HTTP no está habilitado para esa ruta |
| 413 | El cuerpo de la solicitud supera 10 KB |
| 500 | Ocurrió un error interno del servidor |

## ¿Dónde quedan guardados los datos?

En local, los turnos se guardan en `data/turnos.json`, las reservas en `data/reservas-libros.json` y los pedidos de marihuana en `data/pedidos-marihuana.json`. En Railway, configura un Volume montado en `/data` y la variable `DATA_DIR=/data` para conservar esos archivos entre despliegues.

Esta API es una demostración para practicar `GET` y `POST`. No comprueba que la fecha y la hora de los turnos sean válidas ni evita que dos turnos usen el mismo horario.
