import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToUpperCaseFirstLetterPipe } from '../../pipes/toUpperCaseFirstLetter.pipe';
import { RemoveHyphenPipe } from '../../pipes/removeHyphen.pipe';
import { Movement } from '../../../movements/interfaces/movement.interface';

@Component({
  selector: 'list-movements',
  imports: [DatePipe,ToUpperCaseFirstLetterPipe,RemoveHyphenPipe],
  templateUrl: './listMyMovements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMovementsComponent {


  public movements = input<Movement[]>();

  public requestMovementName = input<string>();




}
