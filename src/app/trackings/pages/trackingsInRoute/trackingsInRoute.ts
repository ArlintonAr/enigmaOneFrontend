import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import { Tracking } from '../../interfaces/ApiResponseTracking';
import { ListTrackings } from "../../components/listTrackings/listTrackings";
import { SearchComponent } from "../../../shared/components/search/search.component";

@Component({
  selector: 'app-trackings-in-route',
  imports: [ListTrackings, SearchComponent],
  templateUrl: './trackingsInRoute.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingsInRoute {

  private trackingService = inject(TrackingService)

  listTrackings = signal<Tracking[]>([])
  isLoading = signal<boolean>(false)



  constructor() {
    this.getAllTrackings()
  }

  getAllTrackings(): void {

    this.isLoading.set(true);
    this.trackingService.getAllTrackings('RUTA')
      .subscribe({
        next: (resp) => {

          this.listTrackings.set(resp.data || [])
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error trackings:', err);
          this.isLoading.set(false);
        }
      })

  }


  searchTrackingForId(term: string): void {
    if (term === '') {
      this.getAllTrackings()
      return;
    }
    const id = Number(term);
    this.isLoading.set(true);
    this.trackingService.getTrackingById(id).subscribe({
      next: (resp) => {
        if (resp.data && resp.data.trackingState === 'RUTA') {
          this.listTrackings.set([resp.data]);
        } else {
          this.listTrackings.set([]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tracking by ID:', err);
        this.listTrackings.set([]);
        this.isLoading.set(false);
      },
    });

  }


}
