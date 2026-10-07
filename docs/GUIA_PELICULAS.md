# API de Películas

La documentación interactiva está en `/docs/peliculas` y la especificación OpenAPI en `/api/openapi/peliculas.json`.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/peliculas` | Consultar la cartelera |
| GET | `/api/peliculas/ID` | Consultar una película |
| GET | `/api/peliculas/entradas` | Listar entradas guardadas |
| GET | `/api/peliculas/entradas/ID` | Consultar una entrada |
| POST | `/api/peliculas/entradas` | Reservar entradas |

## Crear una entrada

Usa el ID de una película existente en la cartelera e indica la cantidad:

```json
{
  "nombre": "Ana",
  "peliculaId": 1,
  "cantidad": 2
}
```

La respuesta incluye un ID único, la película, la cantidad, el precio unitario, el total, su estado y la fecha de creación. Las entradas se guardan en `data/entradas-peliculas.json`. En Railway, configura un Volume en `/data` y `DATA_DIR=/data` para conservarlas entre despliegues.