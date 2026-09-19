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
  function unitPrice(product, date = new Date()) {
    const promotion = product.promotion;
    if (!promotion || !Number.isInteger(promotion.price) || promotion.price < 0 || promotion.price >= product.price) return product.price;
    const day = [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
    if ((promotion.start && day < promotion.start) || (promotion.end && day > promotion.end)) return product.price;
    return promotion.price;
  }
  function savings(cart, catalog, date = new Date()) {
    const valid = sanitizeCart(cart, catalog);
    return catalog.reduce((sum, product) => sum + (product.price - unitPrice(product, date)) * (valid[product.id] || 0), 0);
  }
  function totals(cart, catalog, fulfillment, date = new Date()) {
    const valid = sanitizeCart(cart, catalog);
    const subtotal = catalog.reduce(
      (sum, product) => sum + unitPrice(product, date) * (valid[product.id] || 0),
      0,
    );
    const count = Object.values(valid).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
    const shipping = count > 0 && fulfillment === "delivery" ? SHIPPING : 0;
    return { subtotal, shipping, total: subtotal + shipping, count };
  }
  return Object.freeze({ SHIPPING, MAX_QUANTITY, sanitizeCart, unitPrice, savings, totals });
})();
if (typeof module !== "undefined" && module.exports) module.exports = CartMath;
