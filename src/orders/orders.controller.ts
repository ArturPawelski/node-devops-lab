import { Controller, Get } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  @Get()
  getOrders() {
    return [{ id: 1, userId: 1, total: 99 }];
  }
}
