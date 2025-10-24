import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ListTrackings } from '../../components/listTrackings/listTrackings';
import { TrackingService } from '../../services/tracking.service';
import { Tracking } from '../../interfaces/ApiResponseTracking';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { OrderService } from '../../../orders/services/orders.service';
import { Order } from '../../../orders/interfaces/order.interface';

@Component({
  selector: 'app-tracking-in-required-state',
  imports: [ListTrackings, SearchComponent],
  templateUrl: './trackingInRequiredState.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingInRequiredState {
  private trackingService = inject(TrackingService)

  listTrackings = signal<Tracking[]>([])

  constructor() {
    this.getAllTrackings()

  }

  getAllTrackings(): void {
    this.trackingService.getAllTrackings('PEDIDO').subscribe({
      next: (resp) => {

        this.listTrackings.set(resp.data || []);

      },
      error: (err) => {
        console.error('Error trackings:', err);
      },
    });
  }


  searchTrackingForId(term: string): void {
    if (term === '' ){
      this.getAllTrackings()
      return;
    }
    const id = Number(term);
    this.trackingService.getTrackingById(id).subscribe({
      next: (resp) => {
        if (resp.data && resp.data.trackingState === 'PEDIDO') {
          this.listTrackings.set([resp.data]);
        } else {
          this.listTrackings.set([]);
        }
      },
      error: (err) => {
        console.error('Error fetching tracking by ID:', err);
        this.listTrackings.set([]);
      },
    });

  }


}



