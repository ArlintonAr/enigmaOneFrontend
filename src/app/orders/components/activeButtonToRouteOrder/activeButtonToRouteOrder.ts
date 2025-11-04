import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { OrderService } from '../../services/orders.service';
import { TrackingActionDTO } from '../../interfaces/apiResponseOrdersApprovals.interface';
import {
  FormBuilder,
  FormGroup,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrderEventService } from '../../services/orderEvent.service';

@Component({
  selector: 'active-button-to-route-order',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './activeButtonToRouteOrder.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveButtonToRouteOrder {
  @ViewChild('modalChangeToRoute')
  modalChangeToRoute!: ElementRef<HTMLDialogElement>;
  private orderService = inject(OrderService);
  private orderEventService = inject(OrderEventService)
  private fb = inject(FormBuilder);

  orderId = input.required<number>();
  constructor() {}

  formUpdatedOrderTracking: FormGroup = this.fb.group({
    note: [''],
  });

  openModal() {
    this.modalChangeToRoute.nativeElement.showModal();
  }
  closeModal() {
    this.modalChangeToRoute.nativeElement.close();
  }

  updatedOrderTrackingInRoute() {
    const orderId = this.orderId();
    const { note } = this.formUpdatedOrderTracking.value;
    const state = 'RUTA';

    const trackingAction: TrackingActionDTO = { state, note };
    console.log({ orderId, trackingAction });
    this.orderService.updateTracking(orderId, trackingAction).subscribe({
      next: (response) => {


        //Avisar a variable que se produjo la actualizacicon
        this.orderEventService.updatedToRoute(true)

        this.formUpdatedOrderTracking.reset();
        this.closeModal();
      },
      error: (err) => {
        console.log(err);

        this.formUpdatedOrderTracking.reset();
        this.closeModal();
      },
    });
  }
}
