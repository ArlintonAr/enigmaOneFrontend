import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { ListOrdersComponent } from "../../components/listOrders/listOrders.component";
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/orders.service';
import { OrderEventService } from '../../services/orderEvent.service';

@Component({
  selector: 'app-authorization-orders',
  imports: [SearchComponent, ListOrdersComponent],
  templateUrl: './authorizationOrders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationOrdersComponent {

  orderService = inject(OrderService);
  orderEventsService = inject(OrderEventService)
  listOrderForAproved = signal<Order[]>([]);

  constructor() {
    //cuando inicia el componente
    this.orderListForApprove();

    effect(()=>{
      //al escuchar un cambio
      const isUpdatedOrder = this.orderEventsService.isOrderUpdated()
      if (isUpdatedOrder) {
        this.orderListForApprove()
        this.orderEventsService.orderUpdatedTracking(false)
      }
    })
  }



  orderListForApprove() {
    this.orderService.getAllOrders()
      .subscribe(
        (response) => {
          const orders = response.data.filter(order =>
            order.trackings.some(track => track.trackingState === 'PEDIDO') //Listar solo los pedidos con estado 'PEDIDO'
          );
          this.listOrderForAproved.set(orders);
        }
      )
  }



}
