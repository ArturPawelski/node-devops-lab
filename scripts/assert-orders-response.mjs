import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const orders = JSON.parse(readFileSync('orders-response.json', 'utf8'));

assert.ok(Array.isArray(orders), 'Expected an array');

for (const order of orders) {
  assert.ok(
    Number.isInteger(order?.id) &&
      Number.isInteger(order?.user_id) &&
      Number.isInteger(order?.total_cents),
    'Expected integer order fields',
  );
}

assert.ok(
  orders.some((order) => order.user_id === 1 && order.total_cents === 9900),
  'Seeded order not found',
);

console.log('Orders smoke test passed');
