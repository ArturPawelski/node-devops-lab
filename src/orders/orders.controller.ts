import { Controller, Get, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

type Order = {
  id: number;
  user_id: number;
  total_cents: number;
};

@Controller('orders')
export class OrdersController implements OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/orders',
  });

  @Get()
  async getOrders(): Promise<Order[]> {
    const result = await this.pool.query<Order>(
      'SELECT id, user_id, total_cents FROM orders ORDER BY id',
    );
    return result.rows;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}