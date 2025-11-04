
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../interfaces/order.interface';
import { OrderService } from './orders.service';

@Injectable({providedIn: 'root'})
export class OrderEventService {

  isUpdatedStatusOrder = signal<boolean>(false)
  isUpdatedToRoute = signal<boolean>(false)

  updatedStatusOrder(isUpdated:boolean){
    this.isUpdatedStatusOrder.set(isUpdated)
  }
  updatedToRoute(isUpdated:boolean){
    this.isUpdatedToRoute.set(isUpdated)
  }
}
