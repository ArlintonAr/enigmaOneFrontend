import { Injectable, signal } from "@angular/core";


@Injectable({providedIn: 'root'})
export class StockEventService{

  public isUpdatedProduct = signal<boolean>(false)
  public isDeleteProduct = signal<boolean>(false)

  constructor(){}



  modifyValueToUpdatedProduct(value:boolean){
    this.isUpdatedProduct.set(value)
  }

  modifyValueToDeleteProduct(value:boolean){
   this.isDeleteProduct.set(value)
  }


}

