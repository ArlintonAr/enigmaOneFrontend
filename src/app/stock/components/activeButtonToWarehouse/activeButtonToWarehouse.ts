import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Order } from '../../../orders/interfaces/order.interface';
import { OrderEventService } from '../../../orders/services/orderEvent.service';

@Component({
  selector: 'active-button-to-warehouse',
  imports: [],
  templateUrl: './activeButtonToWarehouse.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveButtonToWarehouse {

  order = input.required<Order>();

  private orderEvents = inject(OrderEventService);

  onClick() {
    const order = this.order();
    if (!order) return;
    this.orderEvents.sendOrderToWarehouse(order);
  }
}
