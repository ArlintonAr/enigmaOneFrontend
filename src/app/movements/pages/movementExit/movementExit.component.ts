import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ListMovementsComponent } from '../../components/listMovements/listMovements.component';
import { MovementService } from '../../services/movements.service';
import { Movement } from '../../interfaces/movement.interface';
import { ListStockComponent } from '../../components/listStock/listStock.component';
import { CreateMovementComponent } from '../../components/createMovement/createMovement.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movement-exit',
  imports: [SearchComponent, ListMovementsComponent, ReactiveFormsModule],
  templateUrl: './movementExit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementExitComponent {
  private movementsService = inject(MovementService);
  private fb = inject(FormBuilder);

  movementsExit = signal<Movement[]>([]);

  public formValueOfFiler = this.fb.group({
    filterType: [''],
  });

  constructor() {
    this.getMovementsExit();
  }

  getMovementsExit() {
    this.movementsService.getAllMovements().subscribe((response) => {
      if (response.status === 200) {
        this.movementsExit.set(
          response.data.filter((movement) => movement.returnable === 'SALIDA')
        );
      }
    });
  }

  searchMovementForRequerteFirstName(term: string) {
    this.movementsService.getMovementByRequerter(term).subscribe((response) => {
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          this.movementsExit.set([]);
          return;
        }
        this.movementsExit.set(
          response.data.filter((movement) => movement.returnable === 'SALIDA')
        )

      }
    });
  }

  searchMovementForTransactionCode(code: string) {
    this.movementsService.getMovementByTransactionCode(code).subscribe((response) => {

        if (response.status === 200 && Array.isArray(response.data)) {
          if (response.data.length === 0) {
            this.movementsExit.set([]);
            return;
          }
          this.movementsExit.set(
            response.data.filter((movement) => movement.returnable === 'SALIDA')
          );
        }
      });
  }

  searchStockForTerm(term: string) {
    if (term === '') return this.getMovementsExit();
    const filterType = this.formValueOfFiler.value.filterType;
    console.log(filterType)
    switch (filterType) {
      case'firstName':
        this.searchMovementForRequerteFirstName(term);
        break;
      case'code':
        this.searchMovementForTransactionCode(term);
        break;
    }
  }
}
