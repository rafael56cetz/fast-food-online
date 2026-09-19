const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {unitPrice,totals,savings}=require('../js/cart.js');
const catalog=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/catalog.js'),'utf8')+';FOOD_CATALOG;');
const active=new Date(2026,8,20,12);
const brownie=catalog.find(p=>p.id==='dessert-brownie');
test('dos combos y oferta semanal calculan ahorro y envio una sola vez',()=>{
 const cart={'combo-classic':1,'combo-double':1,'dessert-brownie':1};
 assert.equal(totals(cart,catalog,'pickup',active).total,37700);
 assert.equal(totals(cart,catalog,'delivery',active).total,41200);
 assert.equal(savings(cart,catalog,active),4600);
});
test('cantidades y eliminacion actualizan el descuento',()=>{
 assert.equal(savings({'combo-classic':2},catalog,active),3600);
 assert.equal(totals({'combo-classic':2},catalog,'pickup',active).total,29800);
 assert.equal(savings({},catalog,active),0);
});
test('oferta semanal respeta inicio y fin inclusivos',()=>{
 assert.equal(unitPrice(brownie,new Date(2026,8,18,23,59)),4900);
 assert.equal(unitPrice(brownie,new Date(2026,8,19,0,0)),3900);
 assert.equal(unitPrice(brownie,new Date(2026,8,25,23,59)),3900);
 assert.equal(unitPrice(brownie,new Date(2026,8,26,0,0)),4900);
 assert.equal(savings({'dessert-brownie':1},catalog,new Date(2026,8,26)),0);
});
test('precio de referencia no reemplaza el precio de un combo vigente',()=>{
 const combo=catalog.find(p=>p.id==='combo-classic');
 assert.equal(combo.price,16700);
 assert.equal(unitPrice(combo,active),14900);
 assert.equal(unitPrice({price:100,promotion:{price:-5}},active),100);
});
