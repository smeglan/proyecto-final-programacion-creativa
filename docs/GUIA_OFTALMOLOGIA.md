# API de Oftalmología

La documentación interactiva está en `/docs/oftalmologia` y la especificación OpenAPI en `/api/openapi/oftalmologia.json`.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/oftalmologia` | Consultar pacientes registrados |
| GET | `/api/oftalmologia/ID` | Consultar un paciente |
| GET | `/api/oftalmologia/citas` | Listar citas guardadas |
| GET | `/api/oftalmologia/citas/ID` | Consultar una cita |
| POST | `/api/oftalmologia/citas` | Crear una cita |

## Crear una cita

Usa el ID de un paciente existente en la lista e indica el motivo, la fecha y la hora:

```json
{
  "pacienteId": 1,
  "motivo": "Control de miopía",
  "fecha": "2026-10-10",
  "hora": "10:30"
}
```

La respuesta incluye un ID único, el paciente, su diagnóstico, el motivo, la fecha, la hora, su estado y la fecha de creación. Las citas se guardan en `data/citas-oftalmologia.json`. En Railway, configura un Volume en `/data` y `DATA_DIR=/data` para conservarlas entre despliegues.