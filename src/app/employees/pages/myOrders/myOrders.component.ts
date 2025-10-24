import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { OrderService } from '../../../orders/services/orders.service';
import { ListMyOrdersComponent } from "../../components/listMyOrders/listMyOrders.component";
import { Order } from '../../../orders/interfaces/order.interface';

@Component({
  selector: 'app-my-orders',
  imports: [ListMyOrdersComponent],
  templateUrl: './myOrders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrdersComponent {

  private orderService = inject(OrderService)

  public myOrders = signal<Order[] | null>(null)

  userAuthenticated = computed(() => {
    const user = localStorage.getItem('user')
    return !user? null: JSON.parse(user)
  })
  user:User = this.userAuthenticated()

  constructor(){
    this.getAllOrdersForEmployeeId()
  }



  getAllOrdersForEmployeeId(){
    this.orderService.getOrdersByEmployee(Number(this.user.id))
    .subscribe((response)=>{
      console.log(response)
      this.myOrders.set(response.data)
    })

  }

 }
