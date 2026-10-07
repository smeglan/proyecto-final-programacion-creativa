# API de Marihuana

La documentación interactiva está en `/docs/marihuana` y la especificación OpenAPI en `/api/openapi/marihuana.json`.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/marihuana` | Consultar los productos disponibles |
| GET | `/api/marihuana/ID` | Consultar un producto |
| GET | `/api/marihuana/pedidos` | Listar pedidos guardados |
| GET | `/api/marihuana/pedidos/ID` | Consultar un pedido |
| POST | `/api/marihuana/pedidos` | Crear un pedido |

## Crear un pedido

Usa el ID de un producto existente en el catálogo e indica la cantidad:

```json
{
  "nombre": "Ana",
  "productoId": 1,
  "cantidad": 2
}
```

La respuesta incluye un ID único, el producto pedido, su categoría, la cantidad, el precio unitario, el total, su estado y la fecha de creación. Los pedidos se guardan en `data/pedidos-marihuana.json`. En Railway, configura un Volume en `/data` y `DATA_DIR=/data` para conservarlos entre despliegues.
