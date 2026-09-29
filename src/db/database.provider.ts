import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

export const databaseProvider = {
  provide: DATABASE_POOL,
  useFactory: () =>
    new Pool({
      connectionString:
        process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/orders',
    }),
};