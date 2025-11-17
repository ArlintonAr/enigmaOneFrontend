import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Warehouse } from '../../interfaces/APIResponseWarehouse';
import { WarehouseService } from '../../services/warehouse.service';
import { StockEventService } from '../../services/stockEvent.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'warehouses-list',
  imports: [],
  templateUrl: './warehousesList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehousesList {
  private warehouseService = inject(WarehouseService)
  private estockEventService = inject(StockEventService)
  private fb = inject(FormBuilder)

  public warehouses = signal<Warehouse[]>([])
  public formSelectedWarehouse = this.fb.group({
    selectedWarehouse: [,[]],
  })




  constructor(){
    this.getAllWarehouses()

    effect(()=>{
      //Actualizar lista de almacenes si es que se crea uno nuevo
      const creationNeeded = this.estockEventService.isCreatedWarehouse();
      if(creationNeeded){
        this.getAllWarehouses()
        this.estockEventService.createWarehouse(false)
      }
    })
  }

  getAllWarehouses(){
    this.warehouseService.getAllWarehouses()
    .subscribe({
      next:(response)=>{
        this.warehouses.set(response.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  onSelectedWarehouse(value?: any){
    // value comes from the <select> change event (or can be read from the form)
    const raw = value ?? this.formSelectedWarehouse.get('selectedWarehouse')!.value
    const selectedWarehouse = raw == null ? null : Number(raw)
    // pass either a valid number or null to the service
    this.estockEventService.selectWarehouse(Number.isNaN(selectedWarehouse) ? null : selectedWarehouse)
  }
}
