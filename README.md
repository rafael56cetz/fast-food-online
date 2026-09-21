# Fast Food Online

**Del antojo al pedido: un prototipo de tienda de comida rápida hecho con HTML, CSS y JavaScript puro.**

Primera propuesta para revisión del equipo. No necesita React, backend, base de datos, cuentas ni instalación de dependencias.

## Descargar y abrir

```bash
git clone https://github.com/rafael56cetz/fast-food-online.git
cd fast-food-online
```

Abre `index.html` en un navegador moderno. En Windows también puedes hacer doble clic en `ABRIR.cmd`. Las fotografías están incluidas: la interfaz funciona sin internet.

Alternativa sin Git: en GitHub selecciona **Code → Download ZIP**, extrae la carpeta y abre `index.html`.

Si prefieres localhost y tienes Node.js 18 o superior:

```bash
npm start
```

Abre **http://localhost:3200**. No hace falta `npm install`. Para detener el servidor, pulsa `Ctrl+C` en su terminal. También puedes usar Live Server en VS Code.

## Qué incluye

- Inicio con promoción de combos.
- 15 productos con fotografías, divididos en Hamburguesas, Pizzas, Combos, Bebidas y Postres.
- Filtro por categoría y botones para agregar al pedido.
- Carrito con incremento, decremento y eliminación de productos.
- Totales calculados en centavos para evitar errores de decimales.
- Recoger sin cargo o entrega a domicilio con **$35 MXN** de envío por pedido.
- Formulario de nombre y teléfono; dirección obligatoria solamente para domicilio.
- Revisión final editable y confirmación de demostración.
- Diseño responsive: carrito lateral en escritorio y panel desplegable en móvil.
- Carrito persistente en el navegador, navegación con teclado, etiquetas accesibles y movimiento reducido.

**Alcance:** es una demo académica. No cobra, no envía pedidos, no tiene autenticación y no sincroniza información entre dispositivos. Los datos del formulario no se persisten ni se envían. Usa datos ficticios para las pruebas. El comportamiento de `localStorage` al abrir archivos depende del navegador; localhost ofrece un origen estable.

## Estructura

```text
index.html                          Vista: inicio, carrito y formulario
css/styles.css                      Diseño y responsive
js/data/catalog.js                  Productos y promociones
js/domain/cart.js                   Cálculos del pedido
js/domain/customer-validation.js    Reglas y filtrado de campos
js/ui/customer-form.js              Eventos y errores del formulario
js/controllers/storefront.js        Navegación, estado y renderizado
assets/images/                      Fotografías incluidas
tests/                              Pruebas automatizadas
docs/                               Arquitectura y guías del equipo
server.cjs                          Servidor local opcional
```

## Dónde modificar

| Cambio | Archivo |
|---|---|
| Productos, categorías, precios, fotos | `js/data/catalog.js` |
| Colores y diseño | Variables `:root` en `css/styles.css` |
| Textos, navegación y formulario | `index.html` |
| Tarifa de envío | `SHIPPING` en `js/domain/cart.js`; actualizar también textos de `index.html` y `js/controllers/storefront.js` |
| Lógica del recorrido | `js/controllers/storefront.js` |

Los precios del catálogo están en **centavos**: `9900` representa `$99.00 MXN`. Cada producto debe tener un `id` único.

## Pruebas

```bash
npm test
```

Requiere Node.js, pero no dependencias externas. Para probar el recorrido visual, consulta [la guía de pruebas](docs/PRUEBAS.md).

## Colaboración

Lean primero [la propuesta](docs/PROPUESTA.md) y [la guía del equipo](docs/EQUIPO.md). Cada compañero puede clonar o descargar el repositorio público. Para subir cambios debe ser colaborador autorizado o trabajar con un fork y un pull request.

No se incluye el código de PizzaDigital: este proyecto es una implementación nueva de la experiencia del cliente. Las fotografías son ilustrativas; sus fuentes y condiciones se documentan [aquí](docs/FOTOGRAFIAS.md).

## Promociones
Dos combos con ahorro y una oferta semanal con fechas de vigencia. Los descuentos aparecen en el carrito y el resumen. Consulta [precios y condiciones](docs/PROMOCIONES.md).

## Organización y formulario
Consulta [la arquitectura por capas](docs/ARQUITECTURA.md). El formulario filtra caracteres mientras escribes; los errores aparecen al revisar el pedido, sin tooltips técnicos. El nombre completo requiere al menos tres partes.
