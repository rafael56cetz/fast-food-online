'use strict';
const CustomerValidation = (() => {
  const letters = /^[\p{Script=Latin}\p{M}]+(?:[ '\u2019-][\p{Script=Latin}\p{M}]+)*$/u;
  const rules = Object.freeze({
    name: { min: 2, max: 80, pattern: letters, message: 'Escribe tu nombre completo: un nombre y dos apellidos, o dos nombres y un apellido.' },
    address: { min: 8, max: 180, pattern: /^[\p{Script=Latin}\p{M}0-9 .,#/ºª°'\u2019-]+$/u, message: 'Completa tu dirección con calle, número y colonia.' },
    reference: { min: 3, max: 180, pattern: /^[\p{Script=Latin}\p{M}0-9 .,;:#/ºª°'\u2019()¿?¡!-]+$/u, message: 'Escribe una referencia más clara o deja este campo vacío.' },
    notes: { min: 3, max: 300, pattern: /^[\p{Script=Latin}\p{M}0-9 .,;:'\u2019()¿?¡!-]+$/u, message: 'Completa la nota del pedido o deja este campo vacío.' },
  });
  function fieldError(name, value, required = false) {
    const raw = String(value ?? '').normalize('NFC');
    const trimmed = raw.trim().replace(/ +/g, ' ');
    if (!trimmed) return required ? 'Completa este campo; no puede contener solo espacios.' : '';
    const rule = rules[name];
    if (!rule) return '';
    if (trimmed.length < rule.min || raw.length > rule.max || !rule.pattern.test(trimmed) || !/[\p{Script=Latin}0-9]/u.test(trimmed)) return rule.message;
    if (name === 'name' && trimmed.split(' ').length < 3) return 'Escribe tu nombre completo: un nombre y dos apellidos, o dos nombres y un apellido.';
    return '';
  }
  return Object.freeze({
    normalizeField(name, value) {
      if (name === 'phone') return String(value).replace(/[^0-9]/g, '').slice(0, 10);
      const allowed = {
        name: /[\p{Script=Latin}\p{M} '\u2019-]/u,
        address: /[\p{Script=Latin}\p{M}0-9 .,#/ºª°'\u2019-]/u,
        reference: /[\p{Script=Latin}\p{M}0-9 .,;:#/ºª°'\u2019()¿?¡!-]/u,
        notes: /[\p{Script=Latin}\p{M}0-9 .,;:'\u2019()¿?¡!-]/u,
      };
      if (!rules[name]) return String(value);
      return Array.from(String(value).normalize('NFC')).filter(char => allowed[name].test(char)).join('').slice(0, rules[name].max);
    },
    rules,
    fieldError,
    normalizePhone(value) { return String(value).replace(/[^0-9]/g, '').slice(0, 10); },
    isValidPhone(value) { return typeof value === 'string' && /^[0-9]{10}$/.test(value); },
  });
})();
if (typeof module !== 'undefined' && module.exports) module.exports = CustomerValidation;
