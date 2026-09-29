CREATE TABLE IF NOT EXISTS orders (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id integer NOT NULL,
  total_cents integer NOT NULL
);

INSERT INTO orders (user_id, total_cents) VALUES (1, 9900);