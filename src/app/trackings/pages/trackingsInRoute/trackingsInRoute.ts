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



   constructor(){
    this.getAllTrackings()
   }

   getAllTrackings():void {

    this.trackingService.getAllTrackings('RUTA')
    .subscribe({
      next: (resp) => {

        this.listTrackings.set(resp.data || [])
      },
      error: (err) => {
        console.error('Error trackings:', err);
      }
    })

  }


  searchTrackingForId(term: string): void {
    if (term === '' ){
      this.getAllTrackings()
      return;
    }
    const id = Number(term);
    this.trackingService.getTrackingById(id).subscribe({
      next: (resp) => {
        if (resp.data && resp.data.trackingState === 'RUTA') {
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
