import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OrderApproval } from '../../interfaces/apiResponseOrdersApprovals.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'details-order-approval',
  imports: [DatePipe],
  templateUrl: './detailsOrderApproval.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsOrderApproval {


  approval = input.required<OrderApproval>();


 }
