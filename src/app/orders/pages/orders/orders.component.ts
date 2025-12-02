import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ListOrdersComponent } from "../../components/listOrders/listOrders.component";
import { OrderService } from '../../services/orders.service';
import { Order } from '../../interfaces/order.interface';
import { CreateOrderComponent } from "../../components/createOrder/createOrder.component";
import { SearchComponent } from "../../../shared/components/search/search.component";

@Component({
  selector: 'app-orders',
  imports: [ListOrdersComponent, CreateOrderComponent, SearchComponent],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  private orderService = inject(OrderService)
  public orders = signal<Order[] | null>([])
  public isLoading = signal<boolean>(false)


  @ViewChild(CreateOrderComponent) createOrderModal!: CreateOrderComponent

  constructor() {
    this.getAllOrders()
  }

  openModal(): void {
    this.createOrderModal.openModal()
  }

  getAllOrders() {
    this.isLoading.set(true);
    this.orderService.getAllOrders()
      .subscribe({
        next: (response) => {
          this.orders.set(response.data)
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          this.isLoading.set(false);
        }
      })
  }

  findOrderById(id: string) {
    if (id === '') {
      this.getAllOrders()
      return
    }
    this.isLoading.set(true);
    this.orderService.getOrderById(Number(id))
      .subscribe({
        next: (response) => {
          this.orders.set([response.data])
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error finding order:', err);
          this.isLoading.set(false);
        }
      })

  }

}
