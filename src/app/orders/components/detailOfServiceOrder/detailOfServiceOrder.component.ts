import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { ServiceOrder } from '../../interfaces/serviceOrder.interface';
import { DatePipe } from '@angular/common';
import { ModalEditServiceComponent } from "../modalEditService/modalEditService.component";
import { OrderService } from '../../services/orders.service';

@Component({
  selector: 'detail-of-service-order',
  imports: [DatePipe, ModalEditServiceComponent],
  templateUrl: './detailOfServiceOrder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailOfServiceOrderComponent {

  orderService = inject(OrderService)

  orderServiceList = input.required<ServiceOrder[] | null>()
  selectedService = signal<ServiceOrder | null>(null)

  @ViewChild('detailsOfOrderModal') detailsOfOrderModal!: ElementRef<HTMLDialogElement>
  @ViewChild(ModalEditServiceComponent) modalEditService!: ModalEditServiceComponent;


  constructor() {

  }

  openModal(): void {
    this.detailsOfOrderModal.nativeElement.showModal()
  }

  clouseModal(): void {
    this.detailsOfOrderModal.nativeElement.close()
  }


  openModalEditService(service: ServiceOrder): void {
    this.selectedService.set(service)
    this.modalEditService.openModal()
  }

  deleteService(id: number): void {

    if (id) {
      const idConvert = id.toString()

      //llamar al servicio para eliminar el material
      this.orderService.deleteServiceOrder(idConvert)
        .subscribe(
          (response) => {
            window.alert('Servicio eliminado correctamente')
            window.location.reload()
          }
        )

    }

  }



}
