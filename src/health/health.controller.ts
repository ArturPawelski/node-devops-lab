import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../db/database.provider.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  @Get()
  async check() {
    try {
      await this.pool.query('SELECT 1');
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException('Database unavailable');
    }
  }
}
