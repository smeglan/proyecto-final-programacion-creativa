# API de Cosméticos

La documentación interactiva está en `/docs/cosmeticos` y la especificación OpenAPI en `/api/openapi/cosmeticos.json`.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/cosmeticos` | Consultar servicios de cosmetología disponibles |
| GET | `/api/cosmeticos/ID` | Consultar un servicio |
| GET | `/api/cosmeticos/citas` | Listar citas guardadas |
| GET | `/api/cosmeticos/citas/ID` | Consultar una cita |
| POST | `/api/cosmeticos/citas` | Crear una cita |

## Crear una cita

Envía un JSON con nombre, servicio, fecha y hora:

```json
{
  "nombre": "Ana",
  "servicio": "Limpieza facial profunda",
  "fecha": "2026-10-10",
  "hora": "10:30"
}
```

Las citas se guardan en `data/citas-cosmeticos.json`. En Railway, configura un Volume en `/data` y `DATA_DIR=/data` para conservarlas entre despliegues.