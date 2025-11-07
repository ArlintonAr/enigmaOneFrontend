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
  @ViewChild('modalListOrders') modalListOrders!: ElementRef<HTMLDialogElement>

  private orderService = inject(OrderService)
  private orderEventsService = inject(OrderEventService)

  //variable para guardar orders en ruta
  ordersListInRoute = signal<Order[]>([])


  constructor(){
    // cerrar el modal
    effect(() => {
      const shouldClose = this.orderEventsService.requestCloseListModal();
      if (shouldClose && this.modalListOrders) {
        try {
          this.modalListOrders.nativeElement.close();
        } catch (e) {}
        // reset el valor de la variable
        this.orderEventsService.requestCloseListModal.set(false);
      }
    });
  }

  openModal(): void {
    this.getAllOrdersInRoute()
    this.modalListOrders.nativeElement.showModal();


  }
  closeModal(): void {
      this.modalListOrders.nativeElement.close();
  }


  getAllOrdersInRoute(){
    this.orderService.getOrdersByTrackingState('RUTA')
    .subscribe({
      next:(response)=>{
        this.ordersListInRoute.set(response.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }





}
