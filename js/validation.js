'use strict';
const CustomerValidation = (() => {
  const letters = /^[\p{Script=Latin}\p{M}]+(?:[ '\u2019-][\p{Script=Latin}\p{M}]+)*$/u;
  const rules = Object.freeze({
    name: { min: 2, max: 80, pattern: letters, message: 'Nombre: de 2 a 80 caracteres. Solo letras, acentos, espacios, apóstrofos y guiones entre palabras.' },
    address: { min: 8, max: 180, pattern: /^[\p{Script=Latin}\p{M}0-9 .,#/ºª°'\u2019-]+$/u, message: 'Dirección: de 8 a 180 caracteres. Usa letras, números, espacios y puntuación de domicilio (. , # / - º ª ° o apóstrofo).' },
    reference: { min: 3, max: 180, pattern: /^[\p{Script=Latin}\p{M}0-9 .,;:#/ºª°'\u2019()¿?¡!-]+$/u, message: 'Referencias: de 3 a 180 caracteres, sin etiquetas HTML, emojis ni símbolos especiales. Puedes dejarlo vacío.' },
    notes: { min: 3, max: 300, pattern: /^[\p{Script=Latin}\p{M}0-9 .,;:'\u2019()¿?¡!-]+$/u, message: 'Notas: de 3 a 300 caracteres, con letras, números y puntuación habitual. Sin HTML, emojis ni símbolos especiales. Puedes dejarlo vacío.' },
  });
  function fieldError(name, value, required = false) {
    const raw = String(value ?? '').normalize('NFC');
    const trimmed = raw.trim();
    if (!trimmed) return required ? 'Completa este campo; no puede contener solo espacios.' : '';
    const rule = rules[name];
    if (!rule) return '';
    if (trimmed.length < rule.min || raw.length > rule.max || !rule.pattern.test(raw) || !/[\p{Script=Latin}0-9]/u.test(trimmed)) return rule.message;
    return '';
  }
  return Object.freeze({
    rules,
    fieldError,
    normalizePhone(value) { return String(value).replace(/[^0-9]/g, '').slice(0, 10); },
    isValidPhone(value) { return typeof value === 'string' && /^[0-9]{10}$/.test(value); },
  });
})();
if (typeof module !== 'undefined' && module.exports) module.exports = CustomerValidation;
