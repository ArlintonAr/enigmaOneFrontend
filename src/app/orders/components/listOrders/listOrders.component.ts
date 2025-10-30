import { ChangeDetectionStrategy, Component, inject, input, signal, ViewChild } from '@angular/core';

import { Order } from '../../interfaces/order.interface';
import { DatePipe, NgClass } from '@angular/common';
import { DetailsOfOrderComponent } from '../detailsOfOrder/detailsOfOrder.component';
import { MaterialOrder } from '../../interfaces/materialOrder.interface';
import { FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { Tracking, TrackingUpdate } from '../../../trackings/interfaces/ApiResponseTracking';
import { OrderService } from '../../services/orders.service';

import { ServiceOrder } from '../../interfaces/serviceOrder.interface';
import { DetailOfServiceOrderComponent } from '../detailOfServiceOrder/detailOfServiceOrder.component';
import { OrderEventService } from '../../services/orderEvent.service';





const trackingStateArray = [
  { name: 'PEDIDO', id: 0 },
  { name: 'APROBADO', id: 1 },
  { name: 'RECHAZADO', id: 2 }
]

const stepsForModify = [
  { name: 'APROBADO', id: 0 },
  { name: 'RUTA', id: 1 },
  { name: 'ALMACEN', id: 2 },
]

@Component({
  selector: 'list-orders',
  imports: [DatePipe, DetailsOfOrderComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, DetailOfServiceOrderComponent],
  templateUrl: './listOrders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOrdersComponent {
  @ViewChild(DetailsOfOrderComponent) detailsOfOrderComponent!: DetailsOfOrderComponent
  @ViewChild(DetailOfServiceOrderComponent) detailOfServiceOrderComponent!: DetailOfServiceOrderComponent

  //Servicios
  private fb = inject(FormBuilder)
  private orderService = inject(OrderService)
  private orderEvents = inject(OrderEventService)

  //Variables globales
  orderList = input<Order[] | null>(null)

  authorizedOrder = input<boolean>(false)
  updatedTracking = input<boolean>(false)



  //Crear formulario para actualizar
  trackingState = trackingStateArray
  updateTrackingForm = this.fb.group({
    trackingState: [this.trackingState[0].name, [Validators.required]]
  })

  //Variables para error y éxito

  //Variables para manejar el actual estado de mi componente step
  steps = stepsForModify
  updateTrackingForStepsForm = this.fb.group({
    trackingState: [this.steps[0].name, [Validators.required]]
  })




  selectedMaterials = signal<MaterialOrder[] | null>(null)
  selectedServices = signal<ServiceOrder[] | null>(null)

  openModal(materials: MaterialOrder[]): void {
    if (materials.length === 0) return
    this.selectedMaterials.set(materials)
    this.detailsOfOrderComponent.openModal()
  }
  openModalServices(services: ServiceOrder[]): void {
    if (services.length === 0) return
    this.selectedServices.set(services)
    this.detailOfServiceOrderComponent.openModal()
  }
  clouseModal(): void {
    this.detailsOfOrderComponent.clouseModal()
    this.detailOfServiceOrderComponent.clouseModal()
  }

  updateOrderTracking(id: number) {
    if (!this.updateTrackingForm.valid) return console.log("Formulario no valido")

    const newTracking = this.updateTrackingForm.value

    const trackingLike: Partial<TrackingUpdate> = {
      ...(newTracking as any),
    }

    this.orderService.updateOrder(id, trackingLike)
      .subscribe(
        (response) => {

            this.orderEvents.orderUpdatedTracking(true);
        }
      )

  }


 updateOrderTrackingForSteps(id: number) {
  if (!this.updateTrackingForStepsForm.valid) {
    console.log("Formulario no válido")
    return
  }

  const newTracking = this.updateTrackingForStepsForm.value

  const trackingLike: Partial<TrackingUpdate> = {
    ...(newTracking as any),
  }

  this.orderService.updateOrder(id, trackingLike)
    .subscribe({
      next: (response) => {
        const idOrder = response.data.orderId
        const updatedOrder = response.data

        console.log('Orden actualizada:', updatedOrder)

        // Verificar si el nuevo estado es ALMACEN
        const movedToAlmacen = updatedOrder.trackingState.includes('ALMACEN')


        if (movedToAlmacen) {
          console.log('Orden movida a ALMACEN, enviando al servicio...')
          // Enviar la orden al servicio de eventos
          this.orderEvents.sendOrderToEntry(idOrder)
        }

        //actualizar variable de orderEventService
        this.orderEvents.orderUpdatedTracking(true)

      },
      error: (error) => {
        console.error('Error al actualizar orden:', error)
        // Aquí puedes manejar el error mostrando un mensaje al usuario
      }
    })
}

  //obtener estado para asignar a currentStep
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

        }

      )
  }

  getCurrentStep(order: Order): number {
    // Lógica para determinar el paso según el tracking de la orden
    if (!order.trackings || order.trackings.length === 0) return 0;
    const lastTracking = order.trackings[order.trackings.length - 1];
    switch (lastTracking.trackingState) {
      case 'PEDIDO': return 0;
      case 'RUTA': return 1;
      case 'ALMACEN': return 2;
      default: return 0;
    }
  }

}
