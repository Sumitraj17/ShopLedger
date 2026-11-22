# ShopLedger

## Stack

- Node.js CommonJS application using Express and `body-parser`.
- Static browser UI in `public/`; JSON persistence in `data/db.json`.
- The application entry point is `server.js`.

## Module map

- `routes/customers.js` — customer listing and Khata settlement endpoints.
- `routes/orders.js` — order listing, creation, and cancellation endpoints.
- `routes/products.js` — product catalog and active-coupon endpoints.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and export endpoints.
- `lib/coupons.js` — coupon normalization, validation, and discount calculation.
- `lib/dates.js` — Indian-format date and fiscal-year helpers.
- `lib/inventory.js` — product lookup, stock checks, reservation, release, and summary logic.
- `lib/invoice.js` — invoice figures and printable HTML invoice rendering.
- `lib/ledger.js` — customer Khata balances, charges, reversals, and settlements.
- `lib/orders.js` — order creation, lookup, cancellation, and filtering.
- `lib/pricing.js` — cart subtotal, coupon discount, and checkout GST/total calculation.
- `lib/reports.js` — dashboard and invoice-versus-ledger GST reconciliation.
- `lib/store.js` — synchronous JSON datastore read, write, and audit-log helpers.
- `lib/tax.js` — item GST-rate lookup, slab percentage, and CGST/SGST split.

## Commands

- Start the app: `node server.js`.
- Run tests: `node --test`.

## Rules

1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket

Invoice total and GST breakdown do not match what the customer was billed.

Allowed files: `lib/invoice.js`; use `lib/tax.js` only if truly needed.
