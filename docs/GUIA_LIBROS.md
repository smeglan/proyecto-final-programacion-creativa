# API de Libros

La documentación interactiva está en `/docs/libros` y la especificación OpenAPI en `/api/openapi/libros.json`.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/libros` | Consultar el catálogo |
| GET | `/api/libros/ID` | Consultar un libro |
| GET | `/api/libros/reservas` | Listar reservas guardadas |
| GET | `/api/libros/reservas/ID` | Consultar una reserva |
| POST | `/api/libros/reservas` | Reservar un libro |

## Crear una reserva

Usa el ID de un libro existente en el catálogo:

```json
{
  "nombre": "Ana",
  "libroId": 1
}
```

La respuesta incluye un ID único, el título reservado, su estado y la fecha de creación. Las reservas se guardan en `data/reservas-libros.json`. En Railway, configura un Volume en `/data` y `DATA_DIR=/data` para conservarlas entre despliegues.
