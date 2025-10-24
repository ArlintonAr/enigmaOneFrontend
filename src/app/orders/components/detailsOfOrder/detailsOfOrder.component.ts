import { Component, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { MaterialOrder } from '../../interfaces/materialOrder.interface';
import { NoPhotoPipe } from '../../../employees/pipes/noPhoto.pipe';
import { DatePipe } from '@angular/common';
import { ServiceOrder } from '../../interfaces/serviceOrder.interface';
import { ModalEditMaterialComponent } from '../modalEditMaterial/modalEditMaterial.component';
import { OrderService } from '../../services/orders.service';

@Component({
  selector: 'details-of-order',
  imports: [NoPhotoPipe, DatePipe, ModalEditMaterialComponent],
  templateUrl: './detailsOfOrder.component.html',

})
export class DetailsOfOrderComponent {

  orderService = inject(OrderService)

  orderMaterialsList = input<MaterialOrder[] |null >()
  selectedMaterial = signal<MaterialOrder | null>(null)


  @ViewChild('detailsOfOrderModal') detailsOfOrderModal!:ElementRef<HTMLDialogElement>
  @ViewChild(ModalEditMaterialComponent) modalEditMaterial!:ModalEditMaterialComponent

  constructor(){

  }
  openModal():void{
    this.detailsOfOrderModal.nativeElement.showModal()
  }

  clouseModal():void{
    this.detailsOfOrderModal.nativeElement.close()
  }


  openModalEditMaterial(material: MaterialOrder):void{
    this.selectedMaterial.set(material)
    this.modalEditMaterial.openModal()
  }

  deleteMaterial(id:number):void{

    if(id){
      const idConvert = id.toString()

      //llamar al servicio para eliminar el material
      this.orderService.deleteMaterialOrder(idConvert)
      .subscribe(
        (response)=>{
          window.alert('Material eliminado correctamente')
          window.location.reload()
        }
      )

    }

  }



}
