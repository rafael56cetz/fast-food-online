# Propuesta: Fast Food Online

## Qué pide el proyecto

La consigna describe **la tienda que ve el cliente**, no un sistema de caja o de administración. La prioridad de esta entrega es demostrar que una persona puede elegir comida, modificar un carrito, seleccionar la entrega y revisar su pedido desde un teléfono o una computadora.

El proyecto anterior sirve como referencia conceptual para el carrito y los pedidos. No trasladamos su panel administrativo ni sus dependencias a esta tienda.

## Tres caminos visuales para discutir

| Propuesta | Apariencia | Cuándo elegirla |
|---|---|---|
| **A. Antojo urbano — implementada** | Crema, naranja y verde oscuro; fotografías grandes; títulos expresivos; carrito lateral. | Para una tienda cálida, contemporánea y fácil de recorrer. |
| B. Diner pop | Rojo, amarillo y crema; bloques de color; tipografía contundente y detalles retro. | Si el equipo quiere una marca más juvenil y llamativa. |
| C. Cocina minimal | Blanco, negro y un acento verde; más espacio libre; protagonismo de los productos. | Para una presentación sobria, con menos elementos decorativos. |

Las propuestas B y C son direcciones para conversar, no versiones implementadas. Podemos cambiar la identidad sin reemplazar la lógica del carrito.

## Primera versión: Antojo urbano

1. **Inicio:** fotografía principal, invitación al menú y promoción del combo clásico.
2. **Catálogo:** cinco categorías, tres productos por categoría y botones de agregar.
3. **Pedido:** cantidades, eliminación, subtotal, envío y total visibles.
4. **Entrega:** recoger sin cargo o domicilio por $35 MXN. El cargo se aplica una sola vez si hay productos.
5. **Datos:** nombre y teléfono; dirección y referencias cuando se elige domicilio.
6. **Resumen:** productos, cantidades, modalidad, datos, notas y total; opción de editar datos antes de confirmar.
7. **Confirmación de prueba:** deja claro que no hubo un pedido ni un pago real.

En escritorio el carrito permanece al lado del catálogo. En móvil se abre mediante una barra fija inferior. Los filtros no vacían el carrito.

### Decisiones editables

- Moneda inicial: MXN. Los precios son ficticios para presentar el flujo.
- Envío fijo: $35 para domicilio y $0 para recoger. Cumple el reto de variar por la opción seleccionada; no calcula distancias.
- Máximo de 20 unidades por producto para evitar pedidos accidentales enormes.
- Fotografías ilustrativas descargadas de Unsplash; algunos combos muestran el producto principal. Para una tienda real se fotografiarían los productos y combos completos.
- Los combos muestran precios de referencia y ahorro. El brownie tiene una oferta semanal con fechas explícitas; consultar PROMOCIONES.md. No hay cupones ni descuentos acumulables.

## ¿Y el administrador?

**Es razonable en un producto real, pero no es obligatorio en los requisitos que compartiste.** No conviene confundirlo con la tienda: el cliente compra; el administrador mantiene el catálogo.

Para esta entrega los productos se editan en `js/catalog.js`. El equipo puede modificar nombres, precios, fotos y descripciones sin una base de datos.

### Segunda fase opcional, todavía solo frontend

Una página `admin.html` podría simular:

- Lista de productos y filtros por categoría.
- Formulario para agregar y editar nombre, categoría, precio, descripción y foto.
- Marcar un producto como disponible o no disponible.
- Vista previa de la tarjeta del cliente.

Si se implementa con `localStorage`, los cambios solamente aparecerían en **ese navegador y origen**. No actualizarían la computadora de un compañero ni una tienda compartida. Un login hecho solo con JavaScript tampoco protegería realmente el administrador. Por eso esta fase debe presentarse como una maqueta de administración, no como un panel seguro o conectado.

### Futura versión con backend

La arquitectura tendría tienda del cliente y panel administrativo, ambos conectados a una API y una base de datos. El servidor controlaría permisos, precios válidos, pedidos, imágenes y disponibilidad. Esto queda fuera del alcance actual de HTML/CSS/JavaScript frontend.

## Criterios de buenas prácticas

- HTML semántico, formularios con etiquetas y botones reales.
- CSS separado, variables de diseño y adaptación por tamaño de pantalla.
- JavaScript dividido en catálogo, cálculos puros e interacción.
- Dinero calculado en centavos, no mediante concatenaciones ni redondeos acumulados.
- Se validan cantidades recuperadas del almacenamiento y se ignoran productos desconocidos.
- Se escapan los datos del formulario antes de mostrarlos en el resumen.
- El carrito se conserva; nombre, teléfono y dirección no se guardan.
- Cero frameworks y cero dependencias necesarias para abrir la interfaz.

## Preguntas para la reunión del equipo

1. ¿Conservamos el nombre y la paleta de Antojo urbano o elegimos otra dirección?
2. ¿Qué productos y precios usaremos para la entrega final?
3. ¿El profesor exige un administrador o lo dejamos como extensión opcional?
4. ¿Quién se encarga de cada parte y quién revisa los cambios antes de integrarlos?
