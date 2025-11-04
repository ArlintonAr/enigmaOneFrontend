import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ListOrdersComponent } from "../../../orders/components/listOrders/listOrders.component";
import { OrderService } from '../../../orders/services/orders.service';
import { Order } from '../../../orders/interfaces/order.interface';
import { OrderEventService } from '../../../orders/services/orderEvent.service';

@Component({
  selector: 'list-of-orders-in-route',
  imports: [ListOrdersComponent],
  templateUrl: './listOfOrdersInRoute.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfOrdersInRouteComponent {

  private orderService = inject(OrderService)
  private orderEventsService = inject(OrderEventService)
  //variable para guardar orders en ruta
  orderListInRoute = signal<Order[]>([])

  @ViewChild('modalListOrders') modalListOrders!: ElementRef<HTMLDialogElement>


  constructor(){

  }


  openModal(): void {
    this.modalListOrders.nativeElement.showModal();


  }
  closeModal(): void {
      this.modalListOrders.nativeElement.close();

  }






}
