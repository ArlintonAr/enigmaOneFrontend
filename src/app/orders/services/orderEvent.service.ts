
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../interfaces/order.interface';
import { OrderService } from './orders.service';

@Injectable({providedIn: 'root'})
export class OrderEventService {

  private orderService = inject(OrderService)
  orderUpdated = signal<Order| null>(null)
  orderMovedToAlmacen = signal<boolean>(false)

  isOrderUpdated = signal<boolean>(false)

  constructor() { }


  /* sendOrderToEntry(id: number) {
    this.orderService.getOrderById(id).subscribe(response => {
      if (response.data.trackings[0].trackingState === 'ALMACEN') {
        this.orderUpdated.set(response.data)
        localStorage.setItem('currentOrderUpdatedAlmacen', JSON.stringify(response.data))
        console.log("Este es mi order del servicio event",this.orderUpdated())
      }
    });
  } */

    sendOrderToEntry(id: number) {
    this.orderService.getOrderById(id).subscribe(response => {
      const order = response.data

      // Verificar si algún tracking está en ALMACEN
      const isInAlmacen = order.trackings.some(
        tracking => tracking.trackingState === 'ALMACEN'
      )

      if (isInAlmacen) {
        this.orderUpdated.set(order)
        localStorage.setItem('currentOrderUpdatedAlmacen', JSON.stringify(order))

        // Notificar que se movió a ALMACEN
        this.orderMovedToAlmacen.set(true)

        console.log("Orden actualizada a ALMACEN:", this.orderUpdated())

        // Nota: no resetear automáticamente la notificación aquí.
        // Dejamos que los consumidores llamen a `clearCurrentOrder()` cuando hayan procesado la orden.
      }
    })
  }

  orderUpdatedTracking(isUpdated:boolean){
      this.isOrderUpdated.set(isUpdated)
  }


   // Método para limpiar la orden actual
  clearCurrentOrder(): void {
    this.orderUpdated.set(null)
    localStorage.removeItem('currentOrderUpdatedAlmacen')
  }

  // Método para verificar si hay una orden guardada
  loadSavedOrder(): void {
    const savedOrder = localStorage.getItem('currentOrderUpdatedAlmacen')
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder)
        this.orderUpdated.set(parsedOrder)
      } catch (error) {
        console.error('Error al cargar orden guardada:', error)
        localStorage.removeItem('currentOrderUpdatedAlmacen')
      }
    }
  }


}
