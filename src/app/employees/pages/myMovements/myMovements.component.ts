import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ListMovementsComponent } from "../../components/listMyMovements/listMyMovements.component";

import { MovementService } from '../../../movements/services/movements.service';
import { pipe } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ToUpperCaseFirstLetterPipe } from '../../pipes/toUpperCaseFirstLetter.pipe';
import { Movement } from '../../../movements/interfaces/movement.interface';

@Component({
  selector: 'app-my-movements',
  imports: [ListMovementsComponent],
  templateUrl: './myMovements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMovementsComponent {

  private movementService = inject(MovementService)
  private authService = inject(AuthService)
  public movements= signal<Movement[]>([])
  public userAuthenticated = this.authService.user

  constructor(){
    this.getMovementForEmployeId()
  }

  getMovementForEmployeId(){

    this.movementService.getMovementByEmployeeId(this.userAuthenticated()?.id)
    .subscribe(
      (response) =>{
        //Validaciones
        this.movements.set(response.data)

      }
    )
  }



}
