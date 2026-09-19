"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const money = (cents) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cents / 100);
  const escapeHTML = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const STORAGE = "fast-food-online.cart.v1";
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE)) || {};
  } catch {
    /* Almacenamiento bloqueado o inválido: comenzar vacío. */
  }
  let cart = CartMath.sanitizeCart(stored.cart, FOOD_CATALOG);
  let fulfillment = stored.fulfillment === "delivery" ? "delivery" : "pickup";
  let category = "Todos";
  let customer = null;
  let reviewedTotal = null;
  let toastTimer;
  let cartOpener;
  const dialog = $("#checkout-dialog");
  const form = $("#customer-form");
  function persist() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ cart, fulfillment }));
    } catch {
      /* El carrito sigue funcionando en memoria. */
    }
  }
  function notify(message) {
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(
      () => $("#toast").classList.remove("visible"),
      2400,
    );
  }
  function renderPromotions() {
    $('#promotion-grid').innerHTML = FOOD_CATALOG.filter(product => product.promotion).map(product => {
      const price = CartMath.unitPrice(product);
      const active = price < product.price;
      return `<article class="promotion-card"><img src="assets/images/${product.image}.jpg" alt="${escapeHTML(product.name)}" width="600" height="400" loading="lazy"><div class="promotion-content"><p class="eyebrow">${product.promotion.label}</p><h3>${product.name}</h3><p>${product.description}</p>${product.promotion.components ? `<p class="promotion-breakdown">Por separado: ${product.promotion.components}</p>` : ''}<div class="promotion-price">${active ? `<del>${money(product.price)}</del>` : ''}<strong>${money(price)}</strong>${active ? `<span>Ahorras ${money(product.price-price)}</span>` : '<span>Oferta no vigente</span>'}</div><p class="promotion-terms">${product.promotion.terms}</p><button class="button button-primary" data-promo-add="${product.id}" ${active ? '' : 'disabled'} aria-label="Agregar promoción ${escapeHTML(product.name)}">${active ? 'Agregar promoción +' : 'Fuera de vigencia'}</button></div></article>`;
    }).join('');
  }
  $('#promotion-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-promo-add]');
    if (!button) return;
    const product = FOOD_CATALOG.find(item => item.id === button.dataset.promoAdd);
    if (CartMath.unitPrice(product) >= product.price) { renderPromotions(); notify('Esta oferta ya no está vigente.'); return; }
    updateQuantity(product.id, 1);
    notify(product.name + ' agregado con promoción');
  });
  function renderCatalog() {
    const items = FOOD_CATALOG.filter(
      (product) => category === "Todos" || product.category === category,
    );
    $("#product-grid").innerHTML = items
      .map(
        (product) =>
          `<article class="product-card"><div class="product-image"><img src="assets/images/${product.image}.jpg" alt="${escapeHTML(product.name)}" width="600" height="440" loading="lazy">${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}</div><div class="product-body"><p class="product-detail">${product.detail}</p><div class="product-title"><h3>${product.name}</h3><strong>${money(CartMath.unitPrice(product))}</strong></div><p class="product-description">${product.description}</p><button class="add-button" data-add="${product.id}" aria-label="Agregar ${product.name} al pedido"><span>Agregar al pedido</span><span class="add-plus" aria-hidden="true">+</span></button></div></article>`,
      )
      .join("");
    $("#catalog-count").textContent = `${items.length} productos`;
    $("#catalog-label").textContent =
      category === "Todos" ? "Un poco de todo, mucho sabor." : category;
    document.querySelectorAll("[data-category]").forEach((button) => {
      const selected = button.dataset.category === category;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  function renderCart(focusId, action) {
    const result = CartMath.totals(cart, FOOD_CATALOG, fulfillment);
    $("#cart-items").innerHTML = result.count
      ? FOOD_CATALOG.filter((product) => cart[product.id])
          .map(
            (product) =>
              `<div class="cart-item"><img src="assets/images/${product.image}.jpg" alt="" width="60" height="60"><div class="cart-item-content"><div class="cart-item-title"><h3>${product.name}</h3><button data-remove="${product.id}" aria-label="Eliminar ${product.name}" class="remove-button">×</button></div><div class="cart-item-bottom"><div class="quantity"><button data-decrease="${product.id}" aria-label="Disminuir cantidad de ${product.name}">−</button><span aria-label="Cantidad de ${product.name}: ${cart[product.id]}">${cart[product.id]}</span><button data-increase="${product.id}" aria-label="Aumentar cantidad de ${product.name}" ${cart[product.id] >= CartMath.MAX_QUANTITY ? "disabled" : ""}>+</button></div><strong>${money(CartMath.unitPrice(product) * cart[product.id])}</strong></div></div></div>`,
          )
          .join("")
      : '<div class="cart-empty"><div class="empty-bag" aria-hidden="true">＋</div><h3>Algo rico está por llegar.</h3><p>Agrega tus favoritos del menú.<br>Nosotros guardamos tu lugar aquí.</p></div>';
    for (const id of ["header-count", "cart-count", "mobile-count"])
      $(`#${id}`).textContent = result.count;
    const discount = CartMath.savings(cart, FOOD_CATALOG);
    $('#discount-row').hidden = discount === 0;
    $('#discount').textContent = '−' + money(discount);
    $("#subtotal").textContent = money(result.subtotal + discount);
    $("#shipping").textContent = result.shipping
      ? money(result.shipping)
      : "Sin cargo";
    $("#total").textContent = money(result.total);
    $("#mobile-total").textContent = money(result.total);
    $("#checkout-button").disabled = !result.count;
    document.querySelectorAll('[name="fulfillment"]').forEach((input) => {
      input.checked = input.value === fulfillment;
    });
    persist();
    if (focusId && action) {
      const next = document.querySelector(`[data-${action}="${focusId}"]`);
      if (next && !next.disabled) next.focus();
      else
        $("#checkout-button").disabled
          ? document.querySelector("[data-open-cart]").focus()
          : $("#checkout-button").focus();
    }
  }
  function updateQuantity(id, delta) {
    const product = FOOD_CATALOG.find((item) => item.id === id);
    if (!product) return;
    const next = (cart[id] || 0) + delta;
    if (next > CartMath.MAX_QUANTITY) {
      notify("Máximo 20 unidades por producto en esta demo.");
      return;
    }
    if (next <= 0) delete cart[id];
    else cart[id] = next;
    renderCart();
  }
  function openCart(event) {
    cartOpener = event.currentTarget;
    if (window.matchMedia("(min-width: 1100px)").matches) {
      $("#cart-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      $("#cart-panel").setAttribute("tabindex", "-1");
      $("#cart-panel").focus({ preventScroll: true });
      return;
    }
    $("#cart-panel").classList.add("is-open");
    $("#cart-backdrop").hidden = false;
    document.body.classList.add("cart-open");
    $("#cart-panel").setAttribute("role", "dialog");
    $("#cart-panel").setAttribute("aria-modal", "true");
    document
      .querySelectorAll(
        ".site-header, .hero, .promo-strip, .promotions-section, .menu-section, .how-section, .site-footer, .mobile-cart-bar",
      )
      .forEach((element) => {
        element.inert = true;
      });
    $("#close-cart").focus();
  }
  function closeCart() {
    $("#cart-panel").classList.remove("is-open");
    $("#cart-backdrop").hidden = true;
    document.body.classList.remove("cart-open");
    $("#cart-panel").removeAttribute("role");
    $("#cart-panel").removeAttribute("aria-modal");
    document.querySelectorAll("[inert]").forEach((element) => {
      element.inert = false;
    });
    if (cartOpener) cartOpener.focus();
  }
  function startCheckout() {
    if (!CartMath.totals(cart, FOOD_CATALOG, fulfillment).count) return;
    closeCart();
    form.hidden = false;
    $("#order-review").hidden = true;
    $("#order-success").hidden = true;
    $("#checkout-title").textContent = "Tu pedido, a tu manera.";
    $(".checkout-progress").hidden = false;
    $(".checkout-progress").innerHTML =
      '<span class="current">1. Tus datos</span><span>2. Resumen final</span>';
    $("#address-fields").hidden = fulfillment !== "delivery";
    form.elements.address.required = fulfillment === "delivery";
    form.elements.address.disabled = fulfillment !== "delivery";
    form.elements.reference.disabled = fulfillment !== "delivery";
    $("#delivery-description").textContent =
      fulfillment === "delivery"
        ? "A domicilio · Cargo de envío: $35.00 MXN."
        : "Recoger en establecimiento · Sin cargo de envío.";
    dialog.showModal();
  }
  function renderReview() {
    const result = CartMath.totals(cart, FOOD_CATALOG, fulfillment);
    reviewedTotal = result.total;
    const discount = CartMath.savings(cart, FOOD_CATALOG);
    form.hidden = true;
    $("#order-review").hidden = false;
    $("#checkout-title").textContent = "¿Todo se ve delicioso?";
    $(".checkout-progress").innerHTML =
      '<span>1. Tus datos</span><span class="current">2. Resumen final</span>';
    $("#order-review").innerHTML =
      `<div class="review-customer"><strong>${escapeHTML(customer.name)}</strong><span>${escapeHTML(customer.phone)}</span><span>${fulfillment === "delivery" ? "A domicilio · " + escapeHTML(customer.address) : "Recoger en establecimiento"}</span>${customer.reference ? `<span>Referencias: ${escapeHTML(customer.reference)}</span>` : ""}</div><div class="review-products">${FOOD_CATALOG.filter(
        (product) => cart[product.id],
      )
        .map(
          (product) =>
            `<div><span>${cart[product.id]} × ${product.name}</span><strong>${money(cart[product.id] * CartMath.unitPrice(product))}</strong></div>`,
        )
        .join(
          "",
        )}</div><div class="review-totals"><div><span>Subtotal</span><span>${money(result.subtotal + discount)}</span></div>${discount ? `<div class="discount-row"><span>Ahorro en promociones</span><span>−${money(discount)}</span></div>` : ""}<div><span>Envío</span><span>${result.shipping ? money(result.shipping) : "Sin cargo"}</span></div><div class="total-line"><strong>Total MXN</strong><strong>${money(result.total)}</strong></div></div>${customer.notes ? `<p class="review-notes"><strong>Notas:</strong> ${escapeHTML(customer.notes)}</p>` : ""}<p class="privacy-note">Esta confirmación es una simulación. No se envía a un restaurante ni genera un cobro.</p><div class="dialog-footer"><button class="button button-outline" id="edit-details">Editar datos</button><button class="button button-primary" id="confirm-order">Confirmar pedido de prueba →</button></div>`;
    $("#edit-details").addEventListener("click", () => {
      form.hidden = false;
      $("#order-review").hidden = true;
      $("#checkout-title").textContent = "Tu pedido, a tu manera.";
      $(".checkout-progress").innerHTML =
        '<span class="current">1. Tus datos</span><span>2. Resumen final</span>';
      form.elements.name.focus();
    });
    $("#confirm-order").addEventListener("click", confirmOrder);
    $("#order-review").setAttribute("tabindex", "-1");
    $("#order-review").focus();
  }
  function confirmOrder() {
    const result = CartMath.totals(cart, FOOD_CATALOG, fulfillment);
    if (reviewedTotal !== result.total) { renderReview(); renderCart(); renderCatalog(); renderPromotions(); notify('Cambió la vigencia de una oferta. Revisa el nuevo total antes de confirmar.'); return; }
    const summary = FOOD_CATALOG.filter((product) => cart[product.id])
      .map((product) => `${cart[product.id]} × ${product.name}`)
      .join(" · ");
    $("#order-review").hidden = true;
    $("#order-success").hidden = false;
    $(".checkout-progress").hidden = true;
    $("#checkout-title").textContent = "¡Buen provecho, en modo demo!";
    $("#order-success").innerHTML =
      `<div class="success-symbol" aria-hidden="true">✓</div><h3>Tu pedido de prueba está listo.</h3><p>Así terminaría la experiencia de compra de tu cliente.</p><p class="success-summary">${escapeHTML(summary)}</p><div class="success-total">${money(result.total)} <small>MXN · ${fulfillment === "delivery" ? "Envío incluido" : "Recoger sin cargo"}</small></div><p class="privacy-note">No se ha enviado ningún pedido real. Los datos del formulario se borran al cerrar.</p><button class="button button-primary" id="finish-order">Volver al menú</button>`;
    cart = {};
    persist();
    renderCart();
    $("#finish-order").addEventListener("click", () => dialog.close());
    $("#finish-order").focus();
  }
  $("#product-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const product = FOOD_CATALOG.find((item) => item.id === button.dataset.add);
    updateQuantity(product.id, 1);
    notify(`${product.name} en tu pedido`);
  });
  $("#cart-items").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    let id;
    let action;
    if (button.dataset.remove) {
      id = button.dataset.remove;
      delete cart[id];
      action = "remove";
      notify("Producto eliminado del pedido");
    } else if (button.dataset.increase) {
      id = button.dataset.increase;
      updateQuantity(id, 1);
      action = "increase";
    } else if (button.dataset.decrease) {
      id = button.dataset.decrease;
      updateQuantity(id, -1);
      action = "decrease";
    }
    renderCart(id, action);
  });
  document.querySelectorAll("[data-category]").forEach((button) =>
    button.addEventListener("click", () => {
      category = button.dataset.category;
      renderCatalog();
    }),
  );
  $("#show-combos").addEventListener("click", () => {
    category = "Combos";
    renderCatalog();
    $("#menu").scrollIntoView({ behavior: "smooth" });
    document
      .querySelector('[data-category="Combos"]')
      .focus({ preventScroll: true });
  });
  document.querySelectorAll('[name="fulfillment"]').forEach((input) =>
    input.addEventListener("change", () => {
      fulfillment = input.value;
      renderCart();
      notify(
        fulfillment === "delivery"
          ? "Envío a domicilio: $35.00"
          : "Recoger: sin cargo de envío",
      );
    }),
  );
  document
    .querySelectorAll("[data-open-cart]")
    .forEach((button) => button.addEventListener("click", openCart));
  $("#close-cart").addEventListener("click", closeCart);
  $("#cart-backdrop").addEventListener("click", closeCart);
  $("#checkout-button").addEventListener("click", startCheckout);
  document
    .querySelectorAll("[data-close-dialog]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog.addEventListener("close", () => {
    form.reset();
    customer = null;
    $("#order-review").replaceChildren();
    $("#order-success").replaceChildren();
  });
  const phoneInput = form.elements.phone;
  const phoneMessage = 'Escribe exactamente 10 dígitos, sin letras, espacios ni signos.';
  function validatePhone() {
    phoneInput.setCustomValidity(CustomerValidation.isValidPhone(phoneInput.value) ? '' : phoneMessage);
  }
  phoneInput.addEventListener('input', () => {
    const start = phoneInput.selectionStart;
    const original = phoneInput.value;
    const cleaned = CustomerValidation.normalizePhone(original);
    if (original !== cleaned) {
      const cursor = CustomerValidation.normalizePhone(original.slice(0, start ?? original.length)).length;
      phoneInput.value = cleaned;
      phoneInput.setSelectionRange(cursor, cursor);
    }
    validatePhone();
  });
  phoneInput.addEventListener('invalid', validatePhone);
  form.addEventListener('reset', () => phoneInput.setCustomValidity(''));
  const customerFields = Object.keys(CustomerValidation.rules).map(name => form.elements[name]);
  function validateCustomerField(field) {
    field.setCustomValidity(field.disabled ? '' : CustomerValidation.fieldError(field.name, field.value, field.required));
  }
  customerFields.forEach(field => {
    const rule = CustomerValidation.rules[field.name];
    field.minLength = rule.min;
    field.maxLength = rule.max;
    field.title = rule.message;
    field.addEventListener('input', () => validateCustomerField(field));
    field.addEventListener('blur', () => validateCustomerField(field));
    field.addEventListener('invalid', () => validateCustomerField(field));
  });
  form.addEventListener('reset', () => customerFields.forEach(field => field.setCustomValidity('')));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const name of ["name", "phone", "address", "reference", "notes"]) {
      const field = form.elements[name];
      field.value = field.value.trim();
    }
    validatePhone();
    customerFields.forEach(validateCustomerField);
    if (!form.reportValidity()) return;
    customer = Object.fromEntries(new FormData(form));
    renderReview();
  });
  document.addEventListener("keydown", (event) => {
    if (!$("#cart-panel").classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeCart();
      return;
    }
    if (event.key === "Tab") {
      const focusable = Array.from(
        $("#cart-panel").querySelectorAll(
          'button:not(:disabled), input, [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window
    .matchMedia("(min-width: 1100px)")
    .addEventListener("change", closeCart);
  renderPromotions();
  renderCatalog();
  renderCart();
})();
