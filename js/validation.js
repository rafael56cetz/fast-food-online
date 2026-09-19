'use strict';
// Se conserva como texto para no perder ceros iniciales.
const CustomerValidation = Object.freeze({
  normalizePhone(value) {
    return String(value).replace(/[^0-9]/g, '').slice(0, 10);
  },
  isValidPhone(value) {
    return typeof value === 'string' && /^[0-9]{10}$/.test(value);
  },
});
if (typeof module !== 'undefined' && module.exports) module.exports = CustomerValidation;
