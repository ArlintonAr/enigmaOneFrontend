import { ChangeDetectionStrategy, Component, input, ViewChild } from '@angular/core';
import { Movement } from '../../interfaces/movement.interface';

import { RemoveHyphenPipe } from '../../../employees/pipes/removeHyphen.pipe';
import { ToUpperCaseFirstLetterPipe } from '../../../employees/pipes/toUpperCaseFirstLetter.pipe';
import { DetailsMovements } from '../detailsMovements/detailsMovements';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'list-movements',
  imports: [RemoveHyphenPipe,ToUpperCaseFirstLetterPipe,DetailsMovements,DatePipe],
  templateUrl: './listMovements.component.html',

})
export class ListMovementsComponent {



  movements= input<Movement[]>([])




 }
