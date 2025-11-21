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
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../interfaces/APIResponseWarehouse';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'order-entry',
  imports: [
    ListOfOrdersInRouteComponent,
    DatePipe,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
    SuccessAlertComponent,
    LoaderComponent,
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
  private warehouseService = inject(WarehouseService);

  warehouses = signal<Warehouse[]>([]);
  selectedWarehouseId = signal<number | null>(null); // Almacén seleccionado globalmente

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

  //Variables para manejar estados de carga
  isLoadingWarehouses = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  constructor() {
    // Cargar almacenes
    this.loadWarehouses();

    effect(() => {
      const order = this.orderEvents.orderForWarehouse();
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


      //TODO: Verificar si esto causa algun problema
      Promise.resolve().then(() => {
        try { this.orderEntryDialog.nativeElement.showModal(); } catch (e) { }
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

  loadWarehouses(): void {
    this.isLoadingWarehouses.set(true);
    this.warehouseService.getAllWarehouses().subscribe({
      next: (response) => {
        this.warehouses.set(response.data);
        this.isLoadingWarehouses.set(false);
      },
      error: (err) => {
        console.error('Error cargando almacenes:', err);
        this.isLoadingWarehouses.set(false);
      }
    });
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


    this.listOfOrdersInRouteComponent.openModal();
  }

  closeModalListOrders(): void {
    this.listOfOrdersInRouteComponent.closeModal();
  }

  // Asigna el almacén seleccionado a todos los materiales
  assignWarehouseToAll(warehouseId: string): void {
    const id = warehouseId ? Number(warehouseId) : null;
    this.selectedWarehouseId.set(id); // Guardar selección
    this.materialsFormArray.controls.forEach(control => {
      control.patchValue({ warehouseId: id });
    });
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

    // Sincroniza el formulario (ahora incluye asignación de almacén automáticamente)
    this.syncFormWithMaterials();

    try {
      this.cdr.detectChanges();
    } catch (e) { }
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
    // Guardar los archivos PDF existentes antes de limpiar
    const existingFiles = this.materialsFormArray.controls.map(control => ({
      orderGuides: control.get('orderGuides')?.value,
      photo: control.get('photo')?.value
    }));

    // Limpia el FormArray
    while (this.materialsFormArray.length > 0) {
      this.materialsFormArray.removeAt(0);
    }

    // Agrega los controles según materialsOrderEvent
    const materials = this.materialsOrderEvent();
    const selectedWarehouse = this.selectedWarehouseId(); // Obtener almacén seleccionado

    materials.forEach((material, index) => {
      // Recuperar archivos existentes si los hay
      const existingFile = existingFiles[index];

      this.materialsFormArray.push(
        this.fb.group({
          orderId: [material.orderId ?? ''],
          code: [material.code ?? '', []],
          quantity: [material.quantity ?? 0, [Validators.required]],
          unitOfMeasure: [material.unitOfMeasure ?? ''],
          characteristics: [material.characteristics ?? ''],
          observations: [material.observations ?? ''],
          entryDate: [
            material.estimatedDateStock ? material.estimatedDateStock : '',
          ],
          photo: [existingFile?.photo || material.photo],
          orderGuides: [existingFile?.orderGuides || null], // Preservar archivo existente
          description: [''],
          messageAccordingType: [''],
          accordingType: ['SI'],
          warehouseId: [selectedWarehouse, [Validators.required]], // Asignar almacén seleccionado
        })
      );
    });

    try {
      this.cdr.detectChanges();
    } catch (e) { }
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

  // Maneja la carga del archivo PDF de guías
  onOrderGuidesChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log(`📄 PDF cargado para material ${index}:`, file.name);
      // Solo actualizar el campo orderGuides sin afectar otros campos
      this.materialsFormArray.at(index).patchValue(
        { orderGuides: file },
        { emitEvent: false } // No emitir evento para evitar efectos secundarios
      );
      console.log(`✅ PDF asignado al FormControl ${index}`);
    }
  }

  createStockEntry(): void {
    // Validar formulario
    if (!this.stockFormGroup.valid) {
      console.log('❌ Formulario inválido');
      console.log('Estado del formulario:', this.stockFormGroup.value);
      console.log('Errores por material:');
      this.materialsFormArray.controls.forEach((control, index) => {
        if (control.invalid) {
          console.log(`Material ${index}:`, {
            value: control.value,
            errors: control.errors,
            invalidFields: Object.keys(control.value).filter(key => {
              const field = control.get(key);
              return field?.invalid;
            })
          });
        }
      });

      this.hasError.set(true);
      this.hasNameError.set('El formulario no es válido. Debe llenar los campos requeridos');
      return;
    }

    // Activar loader
    this.isSaving.set(true);

    // Preparar materiales para guardar
    const materialsToEntry = this.stockFormGroup.value.materials!.map((material: any) => ({
      orderId: material.orderId,
      code: material.code,
      quantity: material.quantity,
      unitOfMeasure: material.unitOfMeasure,
      characteristics: material.characteristics,
      entryDate: material.entryDate,
      description: material.description,
      messageAccordingType: material.messageAccordingType,
      accordingType: material.accordingType,
      warehouseId: material.warehouseId,
      photo: material.photo,
      orderGuides: material.orderGuides,
    }))

    materialsToEntry.forEach((material: any, index: number) => {
      console.log(`Material ${index + 1}:`, {
        code: material.code,
        hasPDF: material.orderGuides instanceof File,
        pdfName: material.orderGuides instanceof File ? material.orderGuides.name : 'Sin PDF',
        hasPhoto: material.photo instanceof File,
        photoName: material.photo instanceof File ? material.photo.name : 'Sin foto'
      });
    });

    // Guardar cada material
    let completedRequests = 0;
    const totalRequests = materialsToEntry.length;

    materialsToEntry.forEach((material: any) => {
      // Extraer archivos
      const photoFile = material.photo instanceof File ? material.photo : null;
      const guidesFile = material.orderGuides instanceof File ? material.orderGuides : null;

      // Preparar datos sin los archivos
      const { photo, orderGuides, ...stockData } = material;

      // Llamar al servicio
      this.stockService.createStock(stockData, photoFile, guidesFile).subscribe({
        next: (response) => {
          completedRequests++;

          if (response.status === 200) {
            // Cambiar estado de la orden a ALMACEN
            if (response.data.orderId != null) {
              this.changeOrderOfRouteToWarehouse(material.orderId, material.messageAccordingType);
            }

            // Limpiar formulario
            this.materialsOrderEvent.set([]);
            this.syncFormWithMaterials();

            // Mostrar éxito
            this.hasSuccess.set(true);
            this.hasSuccessMessage.set(
              `Material ${material.code} ingresado correctamente en stock.`
            );
          }

          // Desactivar loader cuando todas las peticiones terminen
          if (completedRequests === totalRequests) {
            this.isSaving.set(false);
          }
        },
        error: (error) => {
          completedRequests++;
          this.hasError.set(true);

          if (error.status === 409) {
            this.hasNameError.set(`El material ${material.code} ya existe en stock.`);
          } else if (error.status === 500) {
            this.hasNameError.set('Ha ocurrido un problema en el servidor');
          } else if (error.status === 403) {
            this.hasNameError.set('Petición incorrecta. Comuníquese con el administrador.');
          } else {
            this.hasNameError.set('Error al guardar el material');
          }

          // Desactivar loader cuando todas las peticiones terminen
          if (completedRequests === totalRequests) {
            this.isSaving.set(false);
          }
        },
      });
    });
  }

  //cambiar estado de seguimiento a ALMACEN
  changeOrderOfRouteToWarehouse(orderId: number, note: string): void {
    this.orderService.updateTracking(orderId, { state: 'ALMACEN', note: note })
      .subscribe({
        next: (response) => {

          console.log("Orden actualizada a ALMACEN");
        },
        error: (err) => {

        }
      })
  }




}
