-- Up Migration
CREATE TABLE IF NOT EXISTS orders (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id integer NOT NULL,
  total_cents integer NOT NULL
);

-- Down Migration
DROP TABLE orders;