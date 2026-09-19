# Guía de pruebas

## Cálculos automáticos

Con Node.js instalado, ejecutar `npm test`. Las pruebas cubren recoger, domicilio, cantidades, eliminación, carrito vacío y recuperación de datos inválidos.

## Recorrido manual

1. Abrir `index.html` o `http://localhost:3200`.
2. Comprobar que Todo muestra 15 tarjetas y que cada categoría muestra 3.
3. Agregar La Clásica ($99) y Refresco de la Casa ($29): total de recoger $128.
4. Aumentar La Clásica a 2: subtotal $227.
5. Seleccionar domicilio: total $262. Volver a recoger: total $227.
6. Eliminar el refresco: total de recoger $198.
7. Recargar: se conserva el carrito y la modalidad seleccionada.
8. Intentar continuar con el carrito vacío: el botón debe estar deshabilitado y el total en cero.
9. En domicilio, intentar enviar el formulario sin nombre, teléfono o dirección: el navegador debe señalar el campo.
10. En recoger, no debe solicitar dirección. Utilizar datos ficticios.
11. Revisar el resumen: cantidades, precios, envío, datos y notas deben coincidir.
12. Volver a editar datos sin perder los productos.
13. Confirmar el pedido de prueba: mostrar mensaje de simulación y vaciar el carrito.
14. Cerrar y abrir un nuevo checkout: los datos personales anteriores deben estar vacíos.

## Responsive y accesibilidad

- En ancho de 1440 px, catálogo y carrito aparecen lado a lado.
- En 390 px, los productos se muestran en dos columnas; los filtros se desplazan horizontalmente y la página no tiene desbordamiento horizontal.
- La barra inferior abre el carrito móvil. Cerrar mediante X, fondo o Escape.
- Navegar con Tab; el foco es visible. En el carrito móvil el foco queda dentro hasta cerrarlo.
- El checkout es un diálogo nativo; Escape lo cierra y las etiquetas están asociadas a sus campos.
- Comprobar que no haya imágenes rotas, errores de JavaScript ni peticiones a un backend.

## Límites conocidos

- Las fotografías son ilustrativas y algunas se reutilizan en combos.
- El almacenamiento local es por navegador y origen; no sincroniza equipos.
- Sin backend, no se comprueban existencias, domicilios reales, permisos ni pagos.
- Este servidor local es únicamente para desarrollo, no para publicación en internet.

## Teléfono
- Aceptar exactamente 10 dígitos, incluidos ceros iniciales.
- No permitir avanzar con 9 o 11 dígitos.
- Al escribir o pegar, quitar letras, espacios y signos; limitar a 10 dígitos.
- Mantener el escape de HTML en el resumen: notas y direcciones se muestran como texto.
- La validación del navegador no sustituye la validación de un futuro servidor.

## Otros campos
- Nombre: 2–80 caracteres, letras y acentos; separadores internos de espacio, apóstrofo o guion. Rechazar números.
- Dirección: 8–180 caracteres, letras, números y puntuación de domicilio; obligatoria solo a domicilio.
- Referencias: opcionales, 3–180 caracteres si se completan.
- Notas: opcionales, 3–300 caracteres si se completan.
- Rechazar HTML, emojis, controles y símbolos fuera de las reglas; comprobar que el formulario no avance y muestre el motivo.
- Mantener escape del resumen: restringir caracteres no sustituye la protección de salida ni la validación del servidor.
