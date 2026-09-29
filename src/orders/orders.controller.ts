import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../db/database.provider.js';


type Order = {
  id: number;
  user_id: number;
  total_cents: number;
};

@Controller('orders')
export class OrdersController {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  @Get()
  async getOrders(): Promise<Order[]> {
    const result = await this.pool.query<Order>(
      'SELECT id, user_id, total_cents FROM orders ORDER BY id',
    );
    return result.rows;
  }
}