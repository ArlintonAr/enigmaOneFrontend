import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { Order } from '../../interfaces/order.interface';
import { DatePipe } from '@angular/common';
import { DetailsOfOrderComponent } from '../detailsOfOrder/detailsOfOrder.component';
import { DetailOfServiceOrderComponent } from '../detailOfServiceOrder/detailOfServiceOrder.component';
import { MaterialOrder } from '../../interfaces/materialOrder.interface';
import { ServiceOrder } from '../../interfaces/serviceOrder.interface';
import { OrderService } from '../../services/orders.service';
import { ApprovedOrder } from '../approvedOrder/approvedOrder';
import { ActiveButtonToRouteOrder } from '../activeButtonToRouteOrder/activeButtonToRouteOrder';
import { ActiveButtonToWarehouse } from "../../../stock/components/activeButtonToWarehouse/activeButtonToWarehouse";

@Component({
  selector: 'order-card',
  imports: [
    DatePipe,
    DetailsOfOrderComponent,
    DetailOfServiceOrderComponent,
    ApprovedOrder,
    ActiveButtonToRouteOrder,
    ActiveButtonToWarehouse
],
  templateUrl: './orderCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCard {
  @ViewChild(DetailsOfOrderComponent)
  detailsOfOrderComponent!: DetailsOfOrderComponent;
  @ViewChild(DetailOfServiceOrderComponent)
  detailOfServiceOrderComponent!: DetailOfServiceOrderComponent;

  orderService = inject(OrderService);

  order = input.required<Order>();

  selectedMaterials = signal<MaterialOrder[] | null>(null);
  selectedServices = signal<ServiceOrder[] | null>(null);

  //Autorizacion de ordenes: Variables para mostrar botones
  activeButtonAuthorization = input<boolean>();
  activeButtonInRoute = input<boolean>();
  activeButtonForToWarehouse = input<boolean>();

  openModal(materials: MaterialOrder[]): void {
    console.log(materials);
    if (materials.length === 0) return;
    this.selectedMaterials.set(materials);
    this.detailsOfOrderComponent.openModal();
  }
  openModalServices(services: ServiceOrder[]): void {
    if (services.length === 0) return;
    this.selectedServices.set(services);
    this.detailOfServiceOrderComponent.openModal();
  }
  clouseModal(): void {
    this.detailsOfOrderComponent.clouseModal();
    this.detailOfServiceOrderComponent.clouseModal();
  }

  //Metodo para obtener el paso en seguimiento de la orden
  getCurrentStep(order: Order): number {
    // Lógica para determinar el paso según el tracking de la orden
    if (!order.trackings || order.trackings.length === 0) return 0;
    const lastTracking = order.trackings[order.trackings.length - 1];
    switch (lastTracking.trackingState) {
      case 'PEDIDO':
        return 0;
      case 'RUTA':
        return 1;
      case 'ALMACEN':
        return 2;
      default:
        return 0;
    }
  }

  generateReport(id: number) {
    this.orderService.generateOrdersReport(id).subscribe({
      next: (pdf) => {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err) => {},
    });
  }
}
