import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ListOrdersComponent } from "../../components/listOrders/listOrders.component";
import { OrderService } from '../../services/orders.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-modify-trackings',
  imports: [SearchComponent],
  templateUrl: './modifyTrackings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyTrackingsComponent {

  orderService = inject(OrderService);

  listOrderForModify = signal<Order[]>([]);

  constructor() {

  }





}
