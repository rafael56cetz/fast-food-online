const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizePhone, isValidPhone } = require('../js/domain/customer-validation.js');
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
const { fieldError } = require('../js/domain/customer-validation.js');
test('nombres aceptan acentos y separadores válidos, no números ni símbolos', () => {
  for (const name of ['María José Pérez', "Ana O’Connor López", 'Ana-María Pérez López', 'José de la Cruz', 'Li Mei Chen']) assert.equal(fieldError('name', name, true), '', name);
  for (const name of ['Ana123', '<b>Ana</b>', 'Ana🙂', 'A', ' '.repeat(5), 'Ana@@', 'Ana--María', 'A'.repeat(81)]) assert.notEqual(fieldError('name', name, true), '', name);
});
test('dirección requiere longitud y admite números de domicilio', () => {
  assert.equal(fieldError('address', 'Calle 10 #25, depto. 2-A', true), '');
  for (const value of ['Calle', '........', 'Calle <script>', 'Calle\n123', 'Calle🙂 123', 'a'.repeat(181)]) assert.notEqual(fieldError('address', value, true), '');
});
test('campos opcionales vacíos, límites exactos y símbolos no permitidos', () => {
  for (const field of ['reference', 'notes']) {
    assert.equal(fieldError(field, ''), '');
    assert.equal(fieldError(field, 'Sin cebolla, por favor.'), '');
    for (const value of ['ab', '<img src=x>', 'Pedido 😀', 'Texto\\script', '!!!', 'Texto\u0000']) assert.notEqual(fieldError(field, value), '');
  }
  assert.equal(fieldError('notes', 'a'.repeat(300)), '');
  assert.notEqual(fieldError('notes', 'a'.repeat(301)), '');
  assert.equal(fieldError('reference', 'a'.repeat(180)), '');
  assert.notEqual(fieldError('reference', 'a'.repeat(181)), '');
});
const { normalizeField } = require('../js/domain/customer-validation.js');
test('filtra caracteres al escribir sin quitar acentos ni puntuacion de domicilio', () => {
  assert.equal(normalizeField('name', 'Rafael123 Pérez🙂 López'), 'Rafael Pérez López');
  assert.equal(normalizeField('name', 'Mari\u0301a Pérez López'), 'María Pérez López');
  assert.equal(normalizeField('address', 'Calle 10 #25 <>{}'), 'Calle 10 #25 ');
  assert.equal(normalizeField('reference', 'Puerta azul🙂'), 'Puerta azul');
  assert.equal(normalizeField('notes', 'Sin cebolla!!!<>'), 'Sin cebolla!!!');
  assert.equal(normalizeField('notes', 'a'.repeat(301)).length, 300);
});
test('nombre completo admite ambas combinaciones y espacios repetidos', () => {
  for (const value of ['Rafael', 'Rafael Pérez']) assert.match(fieldError('name', value, true), /un nombre y dos apellidos/);
  for (const value of ['Rafael Pérez López', 'José Rafael Pérez', '  Rafael  Pérez  López  ']) assert.equal(fieldError('name', value, true), '');
});
