import {  Component, effect, inject, signal } from '@angular/core';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { ListOrdersComponent } from "../../components/listOrders/listOrders.component";
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/orders.service';
import { OrderEventService } from '../../services/orderEvent.service';

@Component({
  selector: 'app-state-orders',
  imports: [ ListOrdersComponent],
  templateUrl: './stateOrders.component.html',

})
export class StateOrdersComponent {

  //Servicios
  orderService = inject(OrderService);
  orderEventService = inject(OrderEventService)

  //Variables globales
  listOfApprovedOrders = signal<Order[]>([]);
  listOfRejectedOrders = signal<Order[]>([]);

  constructor() {

    //Llamar al iniciar el componente
    this.approvedOrders();
    this.rejectedOrders();

    //Si se actualiza un tracking escucha y actualiza
    effect(()=>{
      const isUpdated = this.orderEventService.isOrderUpdated()

      if(isUpdated){
        this.approvedOrders()
        this.rejectedOrders()
        this.orderEventService.orderUpdatedTracking(false)
      }
    })
  }



  approvedOrders() {
    this.orderService.getAllOrders()
      .subscribe(
        (response) => {
          const orders = response.data.filter(order =>
            order.trackings.some(track => track.trackingState === 'APROBADO') //Listar solo los pedidos con estado 'APROBADO'
          );
          this.listOfApprovedOrders.set(orders);
        }
      )
  }

  rejectedOrders(){
     this.orderService.getAllOrders()
      .subscribe(
        (response) => {
          const orders = response.data.filter(order =>
            order.trackings.some(track => track.trackingState === 'RECHAZADO') //Listar solo los pedidos con estado 'RECHAZADO'
          );
          this.listOfRejectedOrders.set(orders);
        }
      )
  }


}
