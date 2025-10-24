import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { ListMovementsComponent } from '../../components/listMovements/listMovements.component';
import { MovementService } from '../../services/movements.service';
import { Movement } from '../../interfaces/movement.interface';
import { ListStockComponent } from "../../components/listStock/listStock.component";
import { CreateMovementComponent } from "../../components/createMovement/createMovement.component";

@Component({
  selector: 'app-movement-exit',
  imports: [ SearchComponent, ListMovementsComponent],
  templateUrl: './movementExit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementExitComponent {

  private movementsService = inject(MovementService)

   movementsExit = signal<Movement[]>([])

  constructor() {
    this.getMovementsExit()
  }


  getMovementsExit() {
    this.movementsService.getAllMovements()
    .subscribe(response =>{

      if(response.status === 200) {
        this.movementsExit.set(response.data.filter(movement => movement.returnable === 'SALIDA'))

      }

    })
  }

  searchMovementForRequerteFirstName(term:string){
    this.movementsService.getMovementByRequerter(term)
    .subscribe(response => {
      if(response.status === 200){

        this.movementsExit.set(response.data.filter(movement => movement.returnable === 'SALIDA'))
      }
    })
  }


 }
