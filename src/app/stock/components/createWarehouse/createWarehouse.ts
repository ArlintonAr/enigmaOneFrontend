import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { WarehouseService } from '../../services/warehouse.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseCreateDTO } from '../../interfaces/APIResponseWarehouse';
import { ErrorAlertComponent } from "../../../shared/components/errorAlert/errorAlert.component";
import { SuccessAlertComponent } from "../../../shared/components/exitAlert/successAlert.component";
import { StockEventService } from '../../services/stockEvent.service';

@Component({
  selector: 'create-warehouse',
  imports: [ReactiveFormsModule, ErrorAlertComponent, SuccessAlertComponent],
  templateUrl: './createWarehouse.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWarehouse {
  @ViewChild('modalCreateWarehouse') createWarehouseModal!: ElementRef<HTMLDialogElement>;

  private warehouseService = inject(WarehouseService)
  private stockEventService = inject(StockEventService)

  private fb = inject(FormBuilder)


  public formCreateWarehouse:FormGroup = this.fb.group({
    locationName: ['', [Validators.required, Validators.minLength(3)]],
    latitude: [''],
    longitude: ['']
  })

  //Variables de errores y aciertos
  public hasError = signal<boolean>(false)
  public errorMessage = signal<string>('')

  public hasSuccess = signal<boolean>(false)
  public successMessage = signal<string>('')


  constructor(){}



  openModal():void{
    this.createWarehouseModal.nativeElement.showModal();
  }
  closeModal():void{
    this.createWarehouseModal.nativeElement.close();
  }



  createWarehouse(){
   if(!this.formCreateWarehouse.valid){
      this.hasError.set(true)
      this.errorMessage.set('Formulario inválido. El nombre del almacén es obligatorio, debe tener al menos 3 letras.')
      return
   }
   const {locationName,latitude,longitude} = this.formCreateWarehouse.value
   const warehouse:WarehouseCreateDTO ={
      locationName,
      latitude,
      longitude
   }
   console.log({warehouse})
    this.warehouseService.createWarehouse(warehouse)
    .subscribe({
      next:(response)=>{
        this.hasSuccess.set(true)
        this.successMessage.set('Almacén creado exitosamente.')
        this.formCreateWarehouse.reset()
        //Si se crea que se actualice la lista
        this.stockEventService.createWarehouse(true)
      },
      error:(err)=>{
        this.hasError.set(true)
        this.errorMessage.set(`Error al crear el almacén. ${err}`)

      }
    })

  }

}
