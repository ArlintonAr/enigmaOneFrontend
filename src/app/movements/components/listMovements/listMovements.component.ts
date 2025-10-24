import { ChangeDetectionStrategy, Component, input, ViewChild } from '@angular/core';
import { Movement } from '../../interfaces/movement.interface';
import { DatePipe } from '@angular/common';
import { RemoveHyphenPipe } from '../../../employees/pipes/removeHyphen.pipe';
import { ToUpperCaseFirstLetterPipe } from '../../../employees/pipes/toUpperCaseFirstLetter.pipe';
import { DetailsMovements } from '../detailsMovements/detailsMovements';

@Component({
  selector: 'list-movements',
  imports: [DatePipe,RemoveHyphenPipe,ToUpperCaseFirstLetterPipe,DetailsMovements],
  templateUrl: './listMovements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMovementsComponent {

  

  movements= input<Movement[]>([])


 

 }
