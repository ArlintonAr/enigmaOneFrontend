import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Order } from '../../../orders/interfaces/order.interface';
import { ListOrdersComponent } from "../../../orders/components/listOrders/listOrders.component";

@Component({
  selector: 'list-my-orders',
  imports: [ListOrdersComponent],
  templateUrl: './listMyOrders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMyOrdersComponent {

  myOrders = input.required<Order[] | null>()




}
