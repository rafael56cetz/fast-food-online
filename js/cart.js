"use strict";
// Funciones puras: no acceden al DOM ni dependen de un servidor.
const CartMath = (() => {
  const SHIPPING = 3500;
  const MAX_QUANTITY = 20;
  function sanitizeCart(value, catalog) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const clean = {};
    for (const product of catalog) {
      const quantity = Number(value[product.id]);
      if (Number.isInteger(quantity) && quantity > 0)
        clean[product.id] = Math.min(quantity, MAX_QUANTITY);
    }
    return clean;
  }
  function totals(cart, catalog, fulfillment) {
    const valid = sanitizeCart(cart, catalog);
    const subtotal = catalog.reduce(
      (sum, product) => sum + product.price * (valid[product.id] || 0),
      0,
    );
    const count = Object.values(valid).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
    const shipping = count > 0 && fulfillment === "delivery" ? SHIPPING : 0;
    return { subtotal, shipping, total: subtotal + shipping, count };
  }
  return Object.freeze({ SHIPPING, MAX_QUANTITY, sanitizeCart, totals });
})();
if (typeof module !== "undefined" && module.exports) module.exports = CartMath;
