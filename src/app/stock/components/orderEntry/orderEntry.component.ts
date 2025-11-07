import { Component, effect, ElementRef, inject, signal, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { ListOfOrdersInRouteComponent } from '../listOfOrdersInRoute/listOfOrdersInRoute.component';
import { MaterialOrder } from '../../../orders/interfaces/materialOrder.interface';
import { OrderEventService } from '../../../orders/services/orderEvent.service';
import { DatePipe } from '@angular/common';
import { StockService } from '../../services/stock.service';
import {
  Form,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { Order } from '../../../orders/interfaces/order.interface';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';
import { OrderService } from '../../../orders/services/orders.service';

@Component({
  selector: 'order-entry',
  imports: [
    ListOfOrdersInRouteComponent,
    DatePipe,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
    SuccessAlertComponent,
  ],
  templateUrl: './orderEntry.component.html',
})
export class OrderEntryComponent {
  @ViewChild('orderEntryDialog')
  orderEntryDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild(ListOfOrdersInRouteComponent)
  listOfOrdersInRouteComponent!: ListOfOrdersInRouteComponent;
  private stockService = inject(StockService);
  private orderService = inject(OrderService);
  private orderEvents = inject(OrderEventService);

  materialsOrderEvent = signal<MaterialOrder[]>([]);

  orderLocalStorage = signal<Order | null>(null);

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  public stockFormGroup = this.fb.group({
    materials: this.fb.array([] as any[]),
  });

  //Variables para manejar errores
  hasError = signal<boolean>(false);
  hasNameError = signal<string>('');

  //Variables de exito
  hasSuccess = signal<boolean>(false);
  hasSuccessMessage = signal<string>('');

  constructor() {

    effect(() => {
      const order = this.orderEvents.orderForWarehouse();
      console.log(order)
      if (!order) return;


      const materials = (order.materialOrders ?? []).map((m: any) => ({
        orderId: order.id,
        code: m.code ?? '',
        quantity: m.quantity ?? 0,
        unitOfMeasure: m.unitOfMeasure ?? '',
        characteristics: m.characteristics ?? '',
        observations: m.observations ?? '',
        estimatedDateStock: m.estimatedDateStock ? new Date(m.estimatedDateStock) : new Date(),
        photo: m.photo ?? null,
      })) as MaterialOrder[];

      this.materialsOrderEvent.set(materials);

      this.syncFormWithMaterials();

      Promise.resolve().then(() => {
        try { this.orderEntryDialog.nativeElement.showModal(); } catch (e) {}
      });


      this.orderEvents.clearOrderForWarehouse();
    });
  }

  closeHasSuccess(isClose: boolean) {
    this.hasSuccess.set(isClose);
  }
  closeHasError(isClose: boolean) {
    this.hasError.set(isClose);
  }

  get materialsFormArray() {
    return this.stockFormGroup.get('materials') as FormArray;
  }

  openModal(): void {
    this.orderEntryDialog.nativeElement.showModal();
  }

  closeModal(): void {
    this.orderEntryDialog.nativeElement.close();
  }

  openModalListOrders(): void {
    // Ensure we load any saved order before opening the list modal

    this.listOfOrdersInRouteComponent.openModal();
  }

  closeModalListOrders(): void {
    this.listOfOrdersInRouteComponent.closeModal();
  }

  // Agrega un nuevo material vacío
  addNewMaterial(): void {
    const newMaterial: MaterialOrder = {
      orderId: null,
      code: '',
      quantity: 0,
      unitOfMeasure: '',
      characteristics: '',
      observations: '',
      estimatedDateStock: new Date(),
      photo: '',
    } as MaterialOrder;

    // Actualiza el signal
    const currentMaterials = this.materialsOrderEvent();
    this.materialsOrderEvent.set([...currentMaterials, newMaterial]);

    // Sincroniza el formulario
    this.syncFormWithMaterials();
    // force change detection in case OnPush or template didn't update
    try {
      this.cdr.detectChanges();
    } catch (e) {}
  }
  // Elimina un material por su índice
  removeMaterial(index: number): void {
    const currentMaterials = this.materialsOrderEvent();
    currentMaterials.splice(index, 1);
    this.materialsOrderEvent.set([...currentMaterials]);
    this.syncFormWithMaterials();
  }

  // Sincroniza el formulario con materialsOrderEvent
  syncFormWithMaterials(): void {
    // Limpia el FormArray
    while (this.materialsFormArray.length > 0) {
      this.materialsFormArray.removeAt(0);
    }

    // Agrega los controles según materialsOrderEvent
    const materials = this.materialsOrderEvent();

    materials.forEach((material) => {
      this.materialsFormArray.push(
        this.fb.group({
          orderId: [material.orderId ?? ''],
          code: [material.code ?? '', [Validators.required]],
          quantity: [material.quantity ?? '', [Validators.required]],
          unitOfMeasure: [material.unitOfMeasure ?? ''],
          characteristics: [material.characteristics ?? ''],
          observations: [material.observations ?? ''],
          entryDate: [
            material.estimatedDateStock ? material.estimatedDateStock : '',
          ],
          description: [''],
          messageAccordingType: [''],
          accordingType: ['SI'],
          photo: [material.photo],
        })
      );
    });

    try {
      this.cdr.detectChanges();
    } catch (e) {}
  }

  // Actualiza el signal cuando cambia un valor del formulario
  updateMaterialInSignal(index: number, field: string, value: any): void {
    const materials = [...this.materialsOrderEvent()];
    materials[index] = {
      ...materials[index],
      [field]: value,
    };
    this.materialsOrderEvent.set(materials);
  }

  createStockEntry(): void {
    const materialsToEntry = this.stockFormGroup.value.materials!.map(
      (material: any) => ({
        orderId: material.orderId,
        code: material.code,
        quantity: material.quantity,
        unitOfMeasure: material.unitOfMeasure,
        characteristics: material.characteristics,
        observations: material.observations,
        entryDate: material.entryDate,
        photo: material.photo,
        description: material.description,
        messageAccordingType: material.messageAccordingType,
        accordingType: material.accordingType,
      })
    );

    materialsToEntry.forEach((material: any, index: number) => {
      const photoFile = material.photo instanceof File ? material.photo : null;
      const { photo, observations, ...stockData } = material;

      this.stockService.createStock(stockData, photoFile).subscribe({
        next: (response) => {
          if (response.status === 200) {

            //Despues de guardar el material, cambiar estado de la orden a ALMACEN
            this.changeOrderOfRouteToWarehouse(material.orderId,material.messageAccordingType)

            this.hasSuccess.set(true);
            this.hasSuccessMessage.set(
              `El material con código ${material.code} ha sido ingresado correctamente en stock.`
            );
          }
        },
        error: (error) => {
          if (error.status === 409) {
            this.hasError.set(true);
            this.hasNameError.set(
              `El material con código ${material.code} ya existe en stock.`
            );
          }
          if (error.status === 500) {
            this.hasError.set(true);
            this.hasNameError.set(`Ha ocurrido un problema en el servidor`);
          }
        },
      });
    });

    this.materialsOrderEvent.set([]);
    this.syncFormWithMaterials();
  }

  //cambiar estado de seguimiento a ALMACEN
  changeOrderOfRouteToWarehouse(orderId:number,note:string): void {
    this.orderService.updateTracking(orderId,{state:'ALMACEN',note:note})
    .subscribe({
      next: (response) => {

        console.log("Orden actualizada a ALMACEN");
      },
      error: (err) => {

      }
    })
  }




}
