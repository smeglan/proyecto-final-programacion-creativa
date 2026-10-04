# Guía de la API para estudiantes

Esta API permite consultar recursos organizados por temática y practicar cómo crear y consultar turnos de una barbería. Las respuestas están en formato JSON.

## Antes de empezar

Cuando la API se ejecuta en tu computador, la dirección base es:

```text
http://localhost:3000
```

Si tu profesor comparte una URL de Railway, reemplaza `http://localhost:3000` por esa URL. Por ejemplo:

```text
https://mi-api.up.railway.app
```

Puedes abrir las rutas `GET` en el navegador. Para enviar un `POST`, usa una herramienta como Postman, Insomnia, Thunder Client o el ejemplo de JavaScript de esta guía.

## ¿Qué significan GET y POST?

- **GET** solicita información. En esta API puedes consultar temáticas, servicios y turnos.
- **POST** envía información para crear un turno nuevo.

## Rutas disponibles

| Método | Ruta | Para qué sirve |
| --- | --- | --- |
| GET | `/` | Muestra información inicial |
| GET | `/api/tematicas` | Lista las temáticas disponibles |
| GET | `/api/animales` | Consulta ejemplos de animales |
| GET | `/api/espacio` | Consulta ejemplos sobre el espacio |
| GET | `/api/historia` | Consulta acontecimientos históricos |
| GET | `/api/barberia` | Consulta servicios de la barbería |
| GET | `/api/barberia/turnos` | Consulta todos los turnos creados |
| GET | `/api/barberia/turnos/ID` | Consulta un turno usando su ID |
| POST | `/api/barberia/turnos` | Crea un turno |

## Consultar temáticas y servicios

Abre esta dirección en el navegador:

```text
http://localhost:3000/api/tematicas
```

Para ver los servicios de barbería:

```text
http://localhost:3000/api/barberia
```

La respuesta contiene una lista de servicios con su ID, nombre, duración y precio. Los precios son datos de ejemplo.

## Crear un turno con POST

La ruta es:

```text
POST http://localhost:3000/api/barberia/turnos
```

Envía estos campos como JSON:

```json
{
  "nombre": "Ana",
  "servicio": "Corte y barba",
  "fecha": "2026-10-10",
  "hora": "10:30"
}
```

En Postman o una herramienta similar:

1. Selecciona el método **POST**.
2. Escribe la URL de la ruta.
3. En **Body**, selecciona **raw** y el formato **JSON**.
4. Pega el objeto JSON de ejemplo y envía la solicitud.

Si todo sale bien, recibirás el turno creado, con un ID generado por la API:

```json
{
  "id": "id-generado",
  "nombre": "Ana",
  "servicio": "Corte y barba",
  "fecha": "2026-10-10",
  "hora": "10:30",
  "estado": "confirmado",
  "creadoEn": "2026-10-04T12:00:00.000Z"
}
```

El valor de `creadoEn` depende del momento en que se cree el turno. Copia el ID recibido para consultarlo después.

### Ejemplo con JavaScript

```js
const respuesta = await fetch('http://localhost:3000/api/barberia/turnos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Ana',
    servicio: 'Corte y barba',
    fecha: '2026-10-10',
    hora: '10:30'
  })
});

const turno = await respuesta.json();
console.log(turno);
```

## Consultar turnos con GET

Para ver todos los turnos:

```text
GET http://localhost:3000/api/barberia/turnos
```

La respuesta tiene este formato:

```json
{
  "cantidad": 1,
  "turnos": [
    {
      "id": "id-generado",
      "nombre": "Ana",
      "servicio": "Corte y barba",
      "fecha": "2026-10-10",
      "hora": "10:30",
      "estado": "confirmado",
      "creadoEn": "2026-10-04T12:00:00.000Z"
    }
  ]
}
```

Para consultar solo uno, reemplaza `ID` por el ID que devolvió el POST:

```text
GET http://localhost:3000/api/barberia/turnos/ID
```

## Códigos de respuesta comunes

| Código | Significado |
| --- | --- |
| 200 | La consulta se realizó correctamente |
| 201 | El turno se creó correctamente |
| 400 | El JSON no es válido o faltan campos requeridos |
| 404 | La ruta, temática o turno no existe |
| 405 | El método HTTP no está habilitado para esa ruta |
| 413 | El cuerpo de la solicitud supera 10 KB |
| 500 | Ocurrió un error interno del servidor |

Si recibes `400`, revisa que hayas enviado los cuatro campos como textos no vacíos y que el cuerpo sea JSON válido.

## ¿Dónde quedan guardados los turnos?

En local, la API guarda los turnos en `data/turnos.json`. En Railway, el servicio debe tener un Volume montado en `/data` y la variable `DATA_DIR=/data`; así se conserva el archivo entre despliegues. Si el servicio se reinicia sin un Volume configurado, no debes asumir que el archivo sobrevivirá.

Esta API es una demostración para practicar `GET` y `POST`. No comprueba que la fecha y la hora sean válidas ni evita que dos turnos usen el mismo horario.
