import { ChangeDetectionStrategy, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { ModalCreateEmployeeComponent } from "../../../employees/components/modalCreateEmployee/modalCreateEmployee.component";
import { MaterialOrder, MaterialOrderUpdate } from '../../interfaces/materialOrder.interface';
import { DatePipe } from '@angular/common';
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/orders.service';




const typeMaterialOrder = [
  { value: "REPUESTOS", id: 1 },
  { value: "MERCADERIA", id: 2 },
  { value: "PRODUCTO_TERMINADO", id: 3 },
  { value: "SALUD", id: 4 },
  { value: "SEGURIDAD_MEDIO_AMBIENTE", id: 5 },
  { value: "ACTIVOS", id: 6 },
  { value: "HERRAMIENTAS", id: 7 },
  { value: "SISTEMAS", id: 8 }
]



@Component({
  selector: 'modal-edit-material',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule,DatePipe],
  templateUrl: './modalEditMaterial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditMaterialComponent {

  private orderService = inject(OrderService)
  private fb = inject(FormBuilder)

  material = input.required<MaterialOrder | null>()

  typeMaterialOrder = typeMaterialOrder

  @ViewChild('modalEditMaterial') modalEditMaterial!: ElementRef<HTMLDialogElement>

  public editMaterialForm = this.fb.group({

    typeMaterial: [, []],
    quantity: [, []],
    unitOfMeasure: [, []],
    characteristics: [, []],
    estimatedDateStock: [, []],
    observations: [, []],

  })

  constructor() {

  }

  openModal(): void {
    this.modalEditMaterial.nativeElement.showModal();
  }

  clouseModal(): void {
    this.modalEditMaterial.nativeElement.close();

  }


  updateMaterial() {
    const material = this.material()

    if (material) {
      const id = material.id.toString()

      const newMaterial = this.editMaterialForm.value

      //Si estimatedDateStock es un objeto Date, conviértelo a string:
      const {estimatedDateStock} = {...newMaterial}

      console.log(estimatedDateStock)
      const updateMaterial: Partial<MaterialOrderUpdate> = {
        ...(newMaterial as any),

      }

      this.orderService.updateMaterialOrder(id, updateMaterial)
        .subscribe(
          (res) => {
            this.clouseModal()

          }
        )
    }

  }





}
