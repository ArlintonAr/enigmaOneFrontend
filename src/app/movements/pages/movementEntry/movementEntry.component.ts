import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { ListMovementsComponent } from "../../components/listMovements/listMovements.component";
import { Movement } from '../../interfaces/movement.interface';
import { MovementService } from '../../services/movements.service';

@Component({
  selector: 'app-movement-entry',
  imports: [SearchComponent, ListMovementsComponent],
  templateUrl: './movementEntry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementEntryComponent {

  private movementsService = inject(MovementService)

  movementsEntry = signal<Movement[]>([])

  constructor() {
    this.getMovementsEntry()
  }

  getMovementsEntry() {
    this.movementsService.getAllMovements()
    .subscribe(response =>{

      if(response.status === 200) {
        this.movementsEntry.set(response.data.filter(movement => movement.returnable === 'ENTRADA'))

      }
    })

  }


    searchMovementForRequerteFirstName(term:string){
    this.movementsService.getMovementByRequerter(term)
    .subscribe(response => {
      if(response.status === 200){

        this.movementsEntry.set(response.data.filter(movement => movement.returnable === 'ENTRADA'))
      }
    })
  }



}
