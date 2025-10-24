import {  Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { OrderEntryComponent } from '../../../stock/components/orderEntry/orderEntry.component';
import { ListOrdersComponent } from '../../../orders/components/listOrders/listOrders.component';
import { OrdersComponent } from '../../../orders/pages/orders/orders.component';
import { Order } from '../../../orders/interfaces/order.interface';
import { OrderService } from '../../../orders/services/orders.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dashboard-pricipal-page',
  imports: [ OrderEntryComponent,ListOrdersComponent,RouterLink],
  templateUrl: './pricipalPage.component.html',

})
export class PricipalPageComponent {

  @ViewChild(OrderEntryComponent) orderEntryComponent!: OrderEntryComponent
  @ViewChild(OrdersComponent) ordersComponent!: OrdersComponent
  @ViewChild('openListOrders') openListOrders!: ElementRef<HTMLDialogElement>;

  private ordersService = inject(OrderService)

  listOrders = signal<Order[]>([])


  openOrderEntryModal() {
    this.orderEntryComponent.openModal()
  }

  openModalListOrders(){
    this.ordersService.getAllOrders()
    .subscribe((response)=>{
      this.listOrders.set(response.data)
    })
    this.openListOrders.nativeElement.showModal()
  }
  closeModalListOrders(){
    this.openListOrders.nativeElement.close()
  }



 }
