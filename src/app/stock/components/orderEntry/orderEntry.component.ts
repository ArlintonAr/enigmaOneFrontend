import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ListOfOrdersInRouteComponent } from "../listOfOrdersInRoute/listOfOrdersInRoute.component";
import { MaterialOrder } from '../../../orders/interfaces/materialOrder.interface';
import { OrderEventService } from '../../../orders/services/orderEvent.service';
import { DatePipe } from '@angular/common';
import { StockService } from '../../services/stock.service';
import { Form, FormArray, FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { Order } from '../../../orders/interfaces/order.interface';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';

@Component({
  selector: 'order-entry',
  imports: [ListOfOrdersInRouteComponent, DatePipe, ɵInternalFormsSharedModule, ReactiveFormsModule, ErrorAlertComponent,SuccessAlertComponent],
  templateUrl: './orderEntry.component.html',
})
export class OrderEntryComponent {

  private stockService = inject(StockService)
  private orderEvents = inject(OrderEventService)

  materialsOrderEvent = signal<MaterialOrder[]>([])

  orderLocalStorage = signal<Order | null>(null)

  private fb = inject(FormBuilder)
  private cdr = inject(ChangeDetectorRef)
  public stockFormGroup = this.fb.group({
    materials: this.fb.array([] as any[])
  })

  //Variables para manejar errores
  hasError = signal<boolean>(false)
  hasNameError = signal<string>('')

  //Variables de exito
  hasSuccess = signal<boolean>(false)
  hasSuccessMessage = signal<string>('')



  constructor() {

    // Load any saved order from localStorage into the OrderEventService so this component
    // can react to orders that were moved to ALMACEN before this component was created
    try {
      this.orderEvents.loadSavedOrder?.()
    } catch (e) {
      // no-op if method not present
    }

    const currentOrderUpdatedAlmacen = localStorage.getItem('currentOrderUpdatedAlmacen')

      if (currentOrderUpdatedAlmacen){
        const parsedOrder = JSON.parse(currentOrderUpdatedAlmacen)
        this.orderLocalStorage.set(parsedOrder)
        console.log("Orden del localStorage" ,this.orderLocalStorage())
        this.materialsOrderEvent.set(parsedOrder.materialOrders)
        this.syncFormWithMaterials()
      }


    effect(() => {
      const order = this.orderEvents.orderUpdated()
      console.log("[orderEntry] Order actualizado y recibido del backend: ", order)

      if (order != null) {
        this.materialsOrderEvent.set(order.materialOrders)
        this.syncFormWithMaterials()
      }

    })

    // React when a order is moved to ALMACEN (service sets orderMovedToAlmacen)
    effect(() => {
      try {
        const moved = (this.orderEvents as any).orderMovedToAlmacen?.()
        if (moved) {
          console.log('[orderEntry] Detected orderMovedToAlmacen signal -> loading saved order')
          // ensure service loads saved order from localStorage into its signal
          try { this.orderEvents.loadSavedOrder?.() } catch (e) {}
          const saved = (this.orderEvents as any).orderUpdated?.()
          if (saved) {
            this.orderLocalStorage.set(saved)
            this.materialsOrderEvent.set(saved.materialOrders || [])
            this.syncFormWithMaterials()
          }
        }
      } catch (e) {
        // noop
      }
    })
  }

  ngOnInit(): void {
    // Ensure any saved order in localStorage is loaded into the service and into this component
    try { this.orderEvents.loadSavedOrder?.() } catch(e){}
    try {
      const saved = (this.orderEvents as any).orderUpdated?.()
      if (saved) {
        console.log('[orderEntry][ngOnInit] loaded saved order from service:', saved)
        this.orderLocalStorage.set(saved)
        this.materialsOrderEvent.set(saved.materialOrders || [])
        this.syncFormWithMaterials()
        try { this.cdr.detectChanges() } catch(e){}
      }
    } catch(e) {
      // noop
    }
  }

  closeHasSuccess(isClose: boolean) {
    this.hasSuccess.set(isClose)
  }
  closeHasError(isClose: boolean) {
    this.hasError.set(isClose)
  }

  get materialsFormArray() {
    return this.stockFormGroup.get('materials') as FormArray
  }

  @ViewChild('orderEntryDialog') orderEntryDialog!: ElementRef<HTMLDialogElement>
  @ViewChild(ListOfOrdersInRouteComponent) listOfOrdersInRouteComponent!: ListOfOrdersInRouteComponent

  openModal(): void {
    // Ensure we load any saved order immediately before showing the modal
    try { this.orderEvents.loadSavedOrder?.() } catch(e){}
    try {
      const raw = localStorage.getItem('currentOrderUpdatedAlmacen')
      console.log('[orderEntry][openModal] localStorage raw:', raw)
      const saved = (this.orderEvents as any).orderUpdated?.()
      console.log('[orderEntry][openModal] orderUpdated signal:', saved)
      if (saved) {
        this.orderLocalStorage.set(saved)
        this.materialsOrderEvent.set(saved.materialOrders || [])
        this.syncFormWithMaterials()
      }
    } catch(e) {}
    this.orderEntryDialog.nativeElement.showModal()
  }

  closeModal(): void {
    this.orderEntryDialog.nativeElement.close()
  }

  openModalListOrders(): void {
    // Ensure we load any saved order before opening the list modal
    try { this.orderEvents.loadSavedOrder?.() } catch(e){}
    this.listOfOrdersInRouteComponent.openModal()
  }

  closeModalListOrders(): void {

    this.listOfOrdersInRouteComponent.closeModal()
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
    } as MaterialOrder

    // Actualiza el signal
    const currentMaterials = this.materialsOrderEvent()
    this.materialsOrderEvent.set([...currentMaterials, newMaterial])

    // Sincroniza el formulario
    this.syncFormWithMaterials()
    console.log('[orderEntry] addNewMaterial -> materialsOrderEvent:', this.materialsOrderEvent())
    // force change detection in case OnPush or template didn't update
    try { this.cdr.detectChanges() } catch (e) {}
  }
  // Elimina un material por su índice
  removeMaterial(index: number): void {
    const currentMaterials = this.materialsOrderEvent()
    currentMaterials.splice(index, 1)
    this.materialsOrderEvent.set([...currentMaterials])
    this.syncFormWithMaterials()
  }

  // Sincroniza el formulario con materialsOrderEvent
  syncFormWithMaterials(): void {
    // Limpia el FormArray
    while (this.materialsFormArray.length > 0) {
      this.materialsFormArray.removeAt(0)
    }

    // Agrega los controles según materialsOrderEvent
    const materials = this.materialsOrderEvent()
    console.log('[orderEntry] syncFormWithMaterials -> materials count:', materials.length)
    materials.forEach(material => {
      this.materialsFormArray.push(this.fb.group({
        orderId: [material.orderId ?? ''],
        code: [material.code ?? '', [Validators.required]],
        quantity: [material.quantity ?? '', [Validators.required]],
        unitOfMeasure: [material.unitOfMeasure ?? ''],
        characteristics: [material.characteristics ?? ''],
        observations: [material.observations ?? ''],
        entryDate: [material.estimatedDateStock ? material.estimatedDateStock : ''],
        description: [''],
        messageAccordingType: [''],
        accordingType: ['SI'],
        photo: [material.photo]
      }))
    })
    // ensure view updates
    try { this.cdr.detectChanges() } catch (e) {}
  }

  // Actualiza el signal cuando cambia un valor del formulario
  updateMaterialInSignal(index: number, field: string, value: any): void {
    const materials = [...this.materialsOrderEvent()]
    materials[index] = {
      ...materials[index],
      [field]: value
    }
    this.materialsOrderEvent.set(materials)
  }

  createStockEntry(): void {
    const materialsToEntry = this.stockFormGroup.value.materials!.map((material: any) => ({
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
      accordingType: material.accordingType
    }))

    materialsToEntry.forEach((material: any, index: number) => {
      const photoFile = material.photo instanceof File ? material.photo : null
      const { photo, observations, ...stockData } = material

      this.stockService.createStock(stockData, photoFile)
        .subscribe({
          next: (response) => {
          if (response.status === 200) {

            // Remove saved order from localStorage now that materials were persisted
            localStorage.removeItem('currentOrderUpdatedAlmacen')
            // Also notify OrderEventService to clear its signals
            try { this.orderEvents.clearCurrentOrder?.() } catch(e){}

            // Clear local signal copy too
            try { this.orderLocalStorage.set(null) } catch(e){}

            this.hasSuccess.set(true)
            this.hasSuccessMessage.set(`El material con código ${material.code} ha sido ingresado correctamente en stock.`)
          }
          },
          error: (error) => {
            if (error.status === 409) {
            this.hasError.set(true)
            this.hasNameError.set(`El material con código ${material.code} ya existe en stock.`)
          }
          if (error.status === 500) {
            this.hasError.set(true)
            this.hasNameError.set(`Ha ocurrido un problema en el servidor`)
          }
          }
        })

    })

    this.materialsOrderEvent.set([])
    this.syncFormWithMaterials()

  // Ensure UI updates and local storage cleared
  try { this.orderEvents.loadSavedOrder?.() } catch(e){}
  }
}



