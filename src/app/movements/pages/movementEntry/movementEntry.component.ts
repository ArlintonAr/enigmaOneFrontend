import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ListMovementsComponent } from '../../components/listMovements/listMovements.component';
import { Movement } from '../../interfaces/movement.interface';
import { MovementService } from '../../services/movements.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movement-entry',
  imports: [SearchComponent, ListMovementsComponent, ReactiveFormsModule],
  templateUrl: './movementEntry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementEntryComponent {
  private movementsService = inject(MovementService);
  private fb = inject(FormBuilder);
  movementsEntry = signal<Movement[]>([]);

  constructor() {
    this.getMovementsEntry();
  }

  public formValueOfFiler = this.fb.group({
    filterType: [''],
  });

  getMovementsEntry() {
    this.movementsService.getAllMovements().subscribe((response) => {
      if (response.status === 200) {
        this.movementsEntry.set(
          response.data.filter((movement) => movement.returnable === 'ENTRADA')
        );
      }
    });
  }

  searchMovementForRequerteFirstName(term: string) {
    this.movementsService.getMovementByRequerter(term).subscribe((response) => {
      if (response.status === 200) {
        this.movementsEntry.set(
          response.data.filter((movement) => movement.returnable === 'ENTRADA')
        );
      }
    });
  }

  searchMovementForTransactionCode(code: string) {
    this.movementsService
      .getMovementByTransactionCode(code)
      .subscribe((response) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          if (response.data.length === 0) {
            this.movementsEntry.set([]);
            return;
          }
          this.movementsEntry.set(
            response.data.filter(
              (movement) => movement.returnable === 'ENTRADA'
            )
          );
        }
      });
  }

  searchStockForTerm(term: string) {
    if (term === '') return this.getMovementsEntry();
    const filterType = this.formValueOfFiler.value.filterType;
    console.log(filterType);
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
