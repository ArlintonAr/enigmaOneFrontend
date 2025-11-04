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
import { OrderCard } from '../orderCard/orderCard';





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
  imports: [ ɵInternalFormsSharedModule, ReactiveFormsModule,OrderCard],
  templateUrl: './listOrders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOrdersComponent {


  //Servicios
  private fb = inject(FormBuilder)
  private orderService = inject(OrderService)
  private orderEvents = inject(OrderEventService)

  //Variables globales
  orderList = input<Order[] | null>(null)

 //Autorizacion de ordenes: Variables para mostrar botones
  activeButtonAuthorization = input<boolean>()
  activeButtonInRoute= input<boolean>()


}
