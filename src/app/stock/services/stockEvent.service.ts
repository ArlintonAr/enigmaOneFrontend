import { Injectable, signal } from "@angular/core";


@Injectable({providedIn: 'root'})
export class StockEventService{

  public isUpdatedProduct = signal<boolean>(false)
  public isDeleteProduct = signal<boolean>(false)
  public isCreatedWarehouse = signal<boolean>(false)

  //seleccion de almacen
  public selectedWarehouseId = signal<number | null>(null)

  constructor(){}



  modifyValueToUpdatedProduct(value:boolean){
    this.isUpdatedProduct.set(value)
  }

  modifyValueToDeleteProduct(value:boolean){
   this.isDeleteProduct.set(value)
  }

  createWarehouse (value:boolean){
    this.isCreatedWarehouse.set(value)
  }


  selectWarehouse(id:number | null){
    this.selectedWarehouseId.set(id)
  }

}

