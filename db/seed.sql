INSERT INTO orders (user_id, total_cents)
SELECT 1, 9900
WHERE NOT EXISTS (
  SELECT 1
  FROM orders
  WHERE user_id = 1 AND total_cents = 9900
);