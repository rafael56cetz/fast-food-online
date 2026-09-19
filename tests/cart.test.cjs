const { test } = require("node:test");
const assert = require("node:assert/strict");
const { totals, sanitizeCart } = require("../js/cart.js");
const catalog = [
  { id: "burger", price: 9900 },
  { id: "drink", price: 2900 },
];
test("recoger no cobra envío y acumula cantidades", () =>
  assert.deepEqual(totals({ burger: 2, drink: 1 }, catalog, "pickup"), {
    subtotal: 22700,
    shipping: 0,
    total: 22700,
    count: 3,
  }));
test("domicilio cobra una sola tarifa por pedido", () =>
  assert.deepEqual(totals({ burger: 2, drink: 1 }, catalog, "delivery"), {
    subtotal: 22700,
    shipping: 3500,
    total: 26200,
    count: 3,
  }));
test("carrito vacío no cobra envío", () =>
  assert.equal(totals({}, catalog, "delivery").total, 0));
test("eliminar un producto actualiza el total", () =>
  assert.equal(totals({ drink: 1 }, catalog, "pickup").total, 2900));
test("datos persistidos inválidos no afectan precios ni cantidades", () =>
  assert.deepEqual(
    sanitizeCart({ burger: -5, drink: 2.5, unknown: 9 }, catalog),
    {},
  ));
test("cantidades se limitan a 20 y los datos nulos se recuperan", () => {
  assert.deepEqual(sanitizeCart({ burger: 999 }, catalog), { burger: 20 });
  assert.deepEqual(sanitizeCart(null, catalog), {});
});
