const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizePhone, isValidPhone } = require('../js/validation.js');
test('telefono permite exactamente diez digitos y conserva ceros iniciales', () => {
  assert.equal(isValidPhone('0123456789'), true);
  assert.equal(normalizePhone('0123456789'), '0123456789');
});
test('rechaza numeros cortos, largos, letras y signos', () => {
  for (const value of ['', '123456789', '12345678901', 'abcdefghij', '+123456789', '12345 6789', '<script />', '１２３４５６７８９０', '123456789\n', null, 1234567890]) {
    assert.equal(isValidPhone(value), false, String(value));
  }
});
test('limpia texto pegado y limita la longitud', () => {
  assert.equal(normalizePhone('abc(012) 345-6789+xyz'), '0123456789');
  assert.equal(normalizePhone('012345678901234'), '0123456789');
  assert.equal(normalizePhone('<script>alert(1)</script>'), '1');
  assert.equal(isValidPhone(normalizePhone('<script>alert(1)</script>')), false);
});
