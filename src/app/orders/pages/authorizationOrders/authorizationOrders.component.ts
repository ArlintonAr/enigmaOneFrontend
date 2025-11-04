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


  //Variables de error y acierto
  hasError = signal<Boolean>(false)
  errorMessage = signal<string>('')

  hasSuccess = signal<Boolean>(false)
  successMessage = signal<string>('')


  constructor() {
    this.getOrdersForAproved();

    effect(()=>{
      if(this.orderEventsService.isUpdatedStatusOrder()){
        this.getOrdersForAproved()
        //Devolver la variable a falso despues del proceso
        this.orderEventsService.updatedStatusOrder(false)
      }
    })
  }



  getOrdersForAproved() {
    this.orderService.getOrdersByApprovalStatus('PENDIENTE')
    .subscribe({
      next: ({ data }) => {
        this.hasSuccess.set(true)
        this.listOrderForAproved.set(data);
      },
      error: (err) => {
        if (err.status ===403) {
          this.hasError.set(true);
          this.errorMessage.set('No tiene permiso para ver las órdenes pendientes de aprobación.');
          this.listOrderForAproved.set([]);
          return;
        }

      }
    })
  }


}
