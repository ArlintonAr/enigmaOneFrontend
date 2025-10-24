import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Tracking } from '../../interfaces/ApiResponseTracking';
import { TrackingService } from '../../services/tracking.service';
import { DatePipe } from '@angular/common';
import { Order } from '../../../orders/interfaces/order.interface';
import { OrderService } from '../../../orders/services/orders.service';

@Component({
  selector: 'list-trackings',
  imports: [DatePipe],
  templateUrl: './listTrackings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTrackings {
  private orderService = inject(OrderService)

  order = signal<Order | null>(null)
  listTrackings = input<Tracking[]>()

  getOrderById(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe({
      next: (resp) => {
        this.order.set(resp.data || null)
        console.log(this.order())
      },
      error: (err) => {
        console.error('Error order:', err)
      },
    });
  }
}
