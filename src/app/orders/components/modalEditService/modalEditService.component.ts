import { ChangeDetectionStrategy, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { OrderService } from '../../services/orders.service';
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceOrder, ServiceOrderUpdate } from '../../interfaces/serviceOrder.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'modal-edit-service',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule,DatePipe],
  templateUrl: './modalEditService.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditServiceComponent {

  private orderService = inject(OrderService)
  private fb = inject(FormBuilder)

  service = input.required<ServiceOrder | null>()


  @ViewChild('modalEditService') modalEditService!: ElementRef<HTMLDialogElement>

  public editServiceForm = this.fb.group({
    characteristics: [, []],
    deliveryDate: [, []],
  })


  constructor() {

  }

  openModal(): void {
    this.modalEditService.nativeElement.showModal();
  }

  closeModal(): void {
    this.modalEditService.nativeElement.close();

  }


  updateService() {
    const service = this.service()

    if (service) {
      const id = service.id.toString()

      const newService = this.editServiceForm.value
      console.log(newService)
      const updateService: Partial<ServiceOrderUpdate> = {
        ...(newService as any),
      }

      this.orderService.updateServiceOrder(id, updateService)
        .subscribe(
          (res) => {
            this.closeModal()
          }
        )
    }

  }




 }
