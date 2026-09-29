import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { OrdersController } from './orders/orders.controller.js';
import { databaseProvider } from './db/database.provider.js';

@Module({
  imports: [],
  controllers: [AppController, OrdersController],
  providers: [AppService, databaseProvider],
})
export class AppModule {}
