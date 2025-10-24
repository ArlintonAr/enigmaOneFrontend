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


    //efecto si esa variable cambia
    effect(()=>{
      const isUpdated = this.orderEventsService.isOrderUpdated()
      if(isUpdated){
        this.orderListInRouteForModal()
        this.orderEventsService.orderUpdatedTracking(false)
        this.closeModal()
      }
    })

  }


  openModal(): void {
    this.modalListOrders.nativeElement.showModal();
    this.orderListInRouteForModal()
    // orderListInRouteForModal sets the signal asynchronously; don't log its (undefined) return

  }
  closeModal(): void {
      this.modalListOrders.nativeElement.close();

  }

  //obtener estado para asignar a currentStep
  orderListInRouteForModal() {
    this.orderService.getAllOrders()
      .subscribe({
        next: (resp) => {


            // strict filter: has tracking RUTA and has materialOrders (non-empty) and no serviceOrders
            const strict = (resp?.data || []).filter(order => {
              const hasRuta = Array.isArray(order.trackings) && order.trackings.some((track: any) => (track?.trackingState || '').toUpperCase() === 'RUTA')
              const hasMaterials = Array.isArray(order.materialOrders) && order.materialOrders.length > 0
              const noServices = Array.isArray(order.serviceOrders) && order.serviceOrders.length === 0
              return !!hasRuta && hasMaterials && noServices
            })

            if (strict.length > 0) {

              this.orderListInRoute.set(strict)
              return
            }

            // fallback: only check trackingState === 'RUTA' (useful if material/service arrays differ)
            const relaxed = (resp?.data || []).filter(order => Array.isArray(order.trackings) && order.trackings.some((track: any) => (track?.trackingState || '').toUpperCase() === 'RUTA'))

            // Optionally set the relaxed list so the modal shows something to diagnose
            this.orderListInRoute.set(relaxed)
        }
      })
  }






}
