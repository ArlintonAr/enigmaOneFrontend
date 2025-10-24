import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ListOrdersComponent } from "../../components/listOrders/listOrders.component";
import { OrderService } from '../../services/orders.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-modify-trackings',
  imports: [SearchComponent, ListOrdersComponent],
  templateUrl: './modifyTrackings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyTrackingsComponent {

  orderService = inject(OrderService);

  listOrderForModify = signal<Order[]>([]);

  constructor() {
    this.orderListForApprove();
  }



  orderListForApprove() {
    this.orderService.getAllOrders()
      .subscribe(
        (response) => {
          const orders = response.data.filter(order =>
            order.trackings.some(track =>
              track.trackingState === 'PEDIDO' ||
              track.trackingState === 'RUTA' ||
              track.trackingState === 'ALMACEN') //Listar solo los pedidos con estado 'PEDIDO'
          );
          this.listOrderForModify.set(orders);
        }
      )
  }


}
