import { ServiceUnavailableException } from '@nestjs/common';
import { Pool } from 'pg';
import { describe, expect, it, vi } from 'vitest';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('reports 503 when the database query fails', async () => {
    const pool = {
      query: vi.fn().mockRejectedValue(new Error('Connection refused')),
    };

    const controller = new HealthController(pool as unknown as Pool);

    await expect(controller.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('returns ok when the database responds', async () => {
    const pool = {
      query: vi.fn().mockResolvedValue({ rows: [{ value: 1 }] }),
    };

    const controller = new HealthController(pool as unknown as Pool);

    await expect(controller.check()).resolves.toEqual({ status: 'ok' });
    expect(pool.query).toHaveBeenCalledWith('SELECT 1');
  });
});
