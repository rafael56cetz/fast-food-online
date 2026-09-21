# Trabajo en equipo

## Reparto sugerido

Adapten estos cuatro bloques al número de integrantes; no asignan responsabilidades a personas concretas.

| Bloque | Responsabilidad | Archivos principales |
|---|---|---|
| Diseño y estructura | Inicio, promociones, navegación, coherencia de textos | `index.html`, `css/styles.css` |
| Catálogo | 15 productos, fotografías, categorías, descripciones | `js/data/catalog.js`, `assets/images/` |
| Pedido | Carrito, cantidades, eliminación, envío y totales | `js/domain/cart.js`, `js/controllers/storefront.js`, `tests/` |
| Checkout y QA | Formulario, resumen, pruebas de teclado, móvil y escritorio | `index.html`, `js/controllers/storefront.js`, `docs/PRUEBAS.md` |

Acuerden los cambios que tocan archivos compartidos para no modificar el mismo bloque al mismo tiempo.

## Descargar

```bash
git clone https://github.com/rafael56cetz/fast-food-online.git
cd fast-food-online
```

Abrir `index.html` o ejecutar `npm start` si tienen Node.js. No hace falta `npm install`.

## Proponer cambios como colaborador

```bash
git switch main
git pull --ff-only
git switch -c mejora/catalogo
# Editar y comprobar la interfaz.
git add js/data/catalog.js
git commit -m "Actualiza las descripciones del catálogo"
git push -u origin mejora/catalogo
```

En GitHub crear un pull request hacia `main`, describir qué cambió y adjuntar una captura si afecta al diseño. Otro compañero revisa antes de integrar. Para subir directamente necesitan una invitación de colaborador del propietario; que el repositorio sea público solo permite leerlo.

Si no tienen permiso de escritura: **Fork**, clonar su fork, crear una rama y abrir un pull request hacia el repositorio original.

## Acuerdos útiles

- Mantener todos los textos para el cliente en español.
- No subir contraseñas, archivos `.env`, datos personales ni bases de datos.
- No subir `node_modules` o registros de terminal.
- Conservar identificadores únicos en el catálogo y precios en centavos.
- Comprobar en móvil y escritorio antes de solicitar revisión.
- Actualizar la documentación si cambian los comandos, la tarifa o el alcance.
- No borrar cambios del compañero para resolver un conflicto sin revisarlos juntos.

## Reunión de presentación sugerida

1. Mostrar la portada y comparar las tres direcciones visuales de `PROPUESTA.md`.
2. Agregar dos productos de distintas categorías.
3. Cambiar cantidades y demostrar la actualización del total.
4. Alternar recoger/domicilio y mostrar el cargo de $35.
5. Completar datos ficticios, revisar el resumen y confirmar la demo.
6. Abrir las herramientas responsive o probar desde una ventana estrecha.
7. Anotar decisiones y repartir tareas antes de empezar a modificar archivos.
