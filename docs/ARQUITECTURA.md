# Estructura del frontend

Arquitectura por capas, sin framework ni backend. No es un MVC completo: el controlador principal aún renderiza tarjetas y resumen; el formulario tiene un adaptador separado.

- index.html: vista semántica.
- css/styles.css: estilos y responsive, sin cambios en esta revisión.
- js/data/catalog.js: catálogo y promociones.
- js/domain/cart.js: cálculos puros del pedido.
- js/domain/customer-validation.js: validación y filtrado, sin DOM.
- js/ui/customer-form.js: eventos del formulario y presentación de errores.
- js/controllers/storefront.js: coordina navegación, estado local y renderizado.
- assets/: imágenes e icono.
- tests/: pruebas de reglas.
- docs/: documentación del equipo.
- server.cjs: servidor estático opcional de desarrollo; no procesa pedidos.

Los scripts clásicos defer se cargan en orden para conservar la apertura directa de index.html, sin instalaciones.

El nombre exige al menos tres partes: un nombre y dos apellidos, o dos nombres y un apellido. No se intenta distinguir legalmente nombres y apellidos. Se admiten acentos, guiones, apóstrofos y nombres compuestos. Los espacios repetidos se normalizan.

No hay tooltips con instrucciones técnicas. Se filtran caracteres al escribir o pegar, preservando el cursor y la composición de acentos. Los errores aparecen al revisar el pedido. Se mantiene el escape del resumen: el filtrado no sustituye la protección de salida ni una futura validación del servidor.
