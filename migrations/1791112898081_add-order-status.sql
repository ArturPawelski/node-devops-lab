-- Up Migration
ALTER TABLE orders
ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Down Migration
ALTER TABLE orders
DROP COLUMN status;