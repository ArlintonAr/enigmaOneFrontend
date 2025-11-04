import { Component, effect, inject, signal } from '@angular/core';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ListOrdersComponent } from '../../components/listOrders/listOrders.component';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/orders.service';
import { OrderEventService } from '../../services/orderEvent.service';

@Component({
  selector: 'app-state-orders',
  imports: [ListOrdersComponent],
  templateUrl: './stateOrders.component.html',
})
export class StateOrdersComponent {
  //Servicios
  private orderService = inject(OrderService);
  private orderEventService = inject(OrderEventService);

  //Variables globales
  listOfApprovedOrders = signal<Order[]>([]);
  listOfRejectedOrders = signal<Order[]>([]);

  constructor() {
    this.getApprovedOrders()
    this.getRejectedOrders()

    effect(()=>{
        if (this.orderEventService.isUpdatedToRoute()) {
          this.getApprovedOrders()

          //volver variable a falso
          this.orderEventService.updatedToRoute(false)
        }
    })
  }

  getApprovedOrders() {
    this.orderService.getOrdersByApprovalStatus('APROBADO').subscribe({
      next: (response) => {
        this.listOfApprovedOrders.set(response.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRejectedOrders() {
    this.orderService.getOrdersByApprovalStatus('RECHAZADO').subscribe({
      next: (response) => {
        this.listOfRejectedOrders.set(response.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
