const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const catalog = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data/catalog.js'), 'utf8') + '; FOOD_CATALOG;');
test('catálogo con 15 productos únicos y tres por categoría', () => {
  assert.equal(catalog.length, 15);
  assert.equal(new Set(catalog.map(product => product.id)).size, 15);
  for (const category of ['Hamburguesas', 'Pizzas', 'Combos', 'Bebidas', 'Postres']) {
    assert.equal(catalog.filter(product => product.category === category).length, 3);
  }
});
test('cada producto tiene un precio válido y una fotografía local', () => {
  for (const product of catalog) {
    assert.ok(Number.isInteger(product.price) && product.price > 0);
    assert.ok(fs.existsSync(path.join(root, 'assets/images', product.image + '.jpg')), product.id);
  }
});
