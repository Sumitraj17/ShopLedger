var test = require('node:test');
var assert = require('node:assert/strict');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function order(id, items, coupon) {
  return {
    id: id,
    items: items,
    coupon: coupon
  };
}

test('CURRENT BEHAVIOUR: #1001 uses supplied 5% and 12% GST rates without a coupon', function () {
  var items = [
    {
      id: 2,
      name: 'Unpolished Toor Dal 1kg',
      sku: 'GRN-002',
      price: 165,
      qty: 2,
      hsn: '0713',
      gstRate: 5
    },
    {
      id: 7,
      name: 'Pasteurized Table Butter 500g',
      sku: 'DRY-002',
      price: 260,
      qty: 1,
      hsn: '0405',
      gstRate: 12
    }
  ];
  var invoiceFigures = invoice.computeInvoiceFigures(order(1001, items, ''));
  var checkoutFigures = pricing.computeTotals(items, '');

  assert.deepEqual(invoiceFigures, {
    subtotal: 590,
    discount: 0,
    tax: 47.7,
    cgst: 23.85,
    sgst: 23.85,
    total: 637.7,
    rows: [
      { name: 'Unpolished Toor Dal 1kg', sku: 'GRN-002', hsn: '0713', qty: 2, price: 165, gstPercent: 5, line: 330, lineTax: 16.5 },
      { name: 'Pasteurized Table Butter 500g', sku: 'DRY-002', hsn: '0405', qty: 1, price: 260, gstPercent: 12, line: 260, lineTax: 31.2 }
    ]
  });
  assert.deepEqual(checkoutFigures, {
    subtotal: 590,
    discount: 0,
    taxable: 590,
    tax: 47.7,
    cgst: 23.85,
    sgst: 23.85,
    total: 637.7,
    lines: [
      { id: 2, name: 'Unpolished Toor Dal 1kg', hsn: '0713', gstPercent: 5, gross: 330, discount: 0, taxable: 330, tax: 16.5, net: 346.5 },
      { id: 7, name: 'Pasteurized Table Butter 500g', hsn: '0405', gstPercent: 12, gross: 260, discount: 0, taxable: 260, tax: 31.2, net: 291.2 }
    ]
  });
});

test('CURRENT BEHAVIOUR: #1002 applies SAVE10 before GST like checkout', function () {
  var items = [
    {
      id: 1,
      name: 'Indrayani Basmati Rice 5kg',
      sku: 'GRN-001',
      price: 640,
      qty: 1,
      hsn: '1006',
      gstRate: 5
    },
    {
      id: 4,
      name: 'Cold-Pressed Sunflower Oil 1L',
      sku: 'OIL-001',
      price: 190,
      qty: 2,
      hsn: '1512',
      gstRate: 5
    }
  ];
  var invoiceFigures = invoice.computeInvoiceFigures(order(1002, items, 'SAVE10'));
  var checkoutFigures = pricing.computeTotals(items, 'SAVE10');

  assert.deepEqual(invoiceFigures, {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9,
    rows: [
      { name: 'Indrayani Basmati Rice 5kg', sku: 'GRN-001', hsn: '1006', qty: 1, price: 640, gstPercent: 5, line: 640, lineTax: 28.8 },
      { name: 'Cold-Pressed Sunflower Oil 1L', sku: 'OIL-001', hsn: '1512', qty: 2, price: 190, gstPercent: 5, line: 380, lineTax: 17.1 }
    ]
  });
  assert.equal(checkoutFigures.tax, 45.9);
  assert.equal(checkoutFigures.discount, 102);
  assert.equal(checkoutFigures.tax, invoiceFigures.tax);
  assert.equal(checkoutFigures.discount, invoiceFigures.discount);
  assert.equal(checkoutFigures.total, invoiceFigures.total);
});

test('CURRENT BEHAVIOUR: #1004 applies the SAVE10 150-rupee cap before GST', function () {
  var items = [
    {
      id: 5,
      name: 'Cold-Pressed Groundnut Oil 5L',
      sku: 'OIL-002',
      price: 1120,
      qty: 2,
      hsn: '1508',
      gstRate: 5
    }
  ];
  var invoiceFigures = invoice.computeInvoiceFigures(order(1004, items, 'SAVE10'));
  var checkoutFigures = pricing.computeTotals(items, 'SAVE10');

  assert.deepEqual(invoiceFigures, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5,
    rows: [
      { name: 'Cold-Pressed Groundnut Oil 5L', sku: 'OIL-002', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  });
  assert.equal(checkoutFigures.discount, 150);
  assert.equal(checkoutFigures.tax, 104.5);
  assert.equal(checkoutFigures.total, 2194.5);
  assert.equal(checkoutFigures.total, invoiceFigures.total);
});

test('CURRENT BEHAVIOUR: #1008 all-18-percent items agree without a coupon', function () {
  var items = [
    {
      id: 8,
      name: 'Assam CTC Masala Chai 250g',
      sku: 'BEV-001',
      price: 140,
      qty: 1,
      hsn: '0902',
      gstRate: 18
    },
    {
      id: 12,
      name: 'Kokum Sherbet Concentrate 750ml',
      sku: 'BEV-003',
      price: 180,
      qty: 2,
      hsn: '2106',
      gstRate: 18
    }
  ];
  var invoiceFigures = invoice.computeInvoiceFigures(order(1008, items, ''));
  var checkoutFigures = pricing.computeTotals(items, '');

  assert.deepEqual(invoiceFigures, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590,
    rows: [
      { name: 'Assam CTC Masala Chai 250g', sku: 'BEV-001', hsn: '0902', qty: 1, price: 140, gstPercent: 18, line: 140, lineTax: 25.2 },
      { name: 'Kokum Sherbet Concentrate 750ml', sku: 'BEV-003', hsn: '2106', qty: 2, price: 180, gstPercent: 18, line: 360, lineTax: 64.8 }
    ]
  });
  assert.equal(checkoutFigures.total, invoiceFigures.total);
  assert.equal(checkoutFigures.tax, invoiceFigures.tax);
});

test('invoice matches checkout HSN GST and capped SAVE10 discount', function () {
  var items = [
    {
      id: 5,
      name: 'Cold-Pressed Groundnut Oil 5L',
      sku: 'OIL-002',
      price: 1120,
      qty: 2,
      hsn: '1508'
    },
    {
      id: 6,
      name: 'A2 Gir Cow Ghee 500ml',
      sku: 'DRY-001',
      price: 450,
      qty: 1,
      hsn: '0405'
    }
  ];
  var invoiceFigures = invoice.computeInvoiceFigures(order(2001, items, 'SAVE10'));
  var checkoutFigures = pricing.computeTotals(items, 'SAVE10');

  assert.deepEqual(invoiceFigures, {
    subtotal: 2690,
    discount: 150,
    tax: 156.74,
    cgst: 78.37,
    sgst: 78.37,
    total: 2696.74,
    rows: [
      { name: 'Cold-Pressed Groundnut Oil 5L', sku: 'OIL-002', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 105.75 },
      { name: 'A2 Gir Cow Ghee 500ml', sku: 'DRY-001', hsn: '0405', qty: 1, price: 450, gstPercent: 12, line: 450, lineTax: 50.99 }
    ]
  });
  assert.equal(invoiceFigures.subtotal, checkoutFigures.subtotal);
  assert.equal(invoiceFigures.discount, checkoutFigures.discount);
  assert.equal(invoiceFigures.tax, checkoutFigures.tax);
  assert.equal(invoiceFigures.cgst, checkoutFigures.cgst);
  assert.equal(invoiceFigures.sgst, checkoutFigures.sgst);
  assert.equal(invoiceFigures.total, checkoutFigures.total);
});
