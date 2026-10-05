# API de Barbería

La documentación interactiva está en `/docs/barberia` y la especificación OpenAPI en `/api/openapi/barberia.json`.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/barberia` | Consultar servicios disponibles |
| GET | `/api/barberia/turnos` | Listar turnos guardados |
| GET | `/api/barberia/turnos/ID` | Consultar un turno |
| POST | `/api/barberia/turnos` | Crear un turno |

## Crear un turno

Envía un JSON con nombre, servicio, fecha y hora:

```json
{
  "nombre": "Ana",
  "servicio": "Corte y barba",
  "fecha": "2026-10-10",
  "hora": "10:30"
}
```

Los turnos se guardan en `data/turnos.json`. En Railway, configura un Volume en `/data` y `DATA_DIR=/data` para conservarlos entre despliegues.
