import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { OrdersController } from './orders/orders.controller.js';
import { databaseProvider } from './db/database.provider.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [],
  controllers: [AppController, OrdersController, HealthController],
  providers: [AppService, databaseProvider],
})
export class AppModule {}
