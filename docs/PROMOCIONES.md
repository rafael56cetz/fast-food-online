# Promociones de demostración

La sección Promociones contiene dos combos y una oferta semanal. Cada tarjeta muestra foto, contenido, precio de referencia, precio final, ahorro y condiciones. Agregar desde esta sección o desde el catálogo aplica el mismo precio; no se acumula otro descuento por usar ambos botones.

| Oferta | Referencia | Precio final | Ahorro |
|---|---|---|---|
| Combo Clásico | Hamburguesa $99 + papas $39 + bebida $29 = $167 | $149 | $18 |
| Combo Doble | Hamburguesa $139 + papas $39 + bebida $29 = $207 | $189 | $18 |
| Brownie Intenso | $49 | $39 | $10 |

Los precios individuales de las papas son referencias de esta demo; no se agregó una categoría nueva. Los combos no tienen fecha de cierre. El brownie tiene vigencia del 19 al 25 de septiembre de 2026, inclusive, según la fecha local del dispositivo. Fuera de ese periodo la tarjeta deja de ofrecer el descuento y el catálogo utiliza $49. La fecha no se renueva automáticamente. Para otra semana, editar `promotion.start` y `promotion.end` en `js/catalog.js`.

El subtotal del carrito muestra los precios de referencia y una línea separada resta el ahorro. Los importes de cada producto ya reflejan su oferta. El envío conserva su tarifa de $35 o $0 al recoger. No se implementó envío gratis ni cupones en esta etapa.

Para cambiar ofertas: editar `price` (referencia) y `promotion.price` (precio final) en centavos, y actualizar contenido y condiciones. `CartMath.unitPrice` centraliza los precios. El navegador recalcula al modificar el carrito, revisar y confirmar; si una oferta vence durante la revisión, se pide revisar el total de nuevo. En una versión real, vigencia y precios deben validarse en el servidor.
