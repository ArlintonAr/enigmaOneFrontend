import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToUpperCaseFirstLetterPipe } from '../../pipes/toUpperCaseFirstLetter.pipe';
import { RemoveHyphenPipe } from '../../pipes/removeHyphen.pipe';
import { Movement } from '../../../movements/interfaces/movement.interface';
import { MovementService } from '../../../movements/services/movements.service';

@Component({
  selector: 'list-movements',
  imports: [DatePipe,ToUpperCaseFirstLetterPipe,RemoveHyphenPipe],
  templateUrl: './listMyMovements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMovementsComponent {

  private movementService =inject(MovementService)
  public movements = input<Movement[]>();

  public requestMovementName = input<string>();



   //Crear reporte al guardar
  generateMovementReport(movementId: number) {
    this.movementService
      .genereteReportForMovementId(Number(movementId))
      .subscribe((pdf) => {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }


}
