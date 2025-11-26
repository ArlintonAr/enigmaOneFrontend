import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { OrderEntryComponent } from '../../components/orderEntry/orderEntry.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { StockEventService } from '../../services/stockEvent.service';
import { Stock } from '../../interfaces/APIResponseStock.interface';
import { ListStockComponent } from "../../components/listStock/listStock.component";
import { SearchComponent } from "../../../shared/components/search/search.component";
import { WarehousesList } from "../../components/warehousesList/warehousesList";
import { CreateWarehouse } from "../../components/createWarehouse/createWarehouse";

@Component({
  selector: 'app-stock-management',
  imports: [OrderEntryComponent, ListStockComponent, ReactiveFormsModule, SearchComponent, WarehousesList],
  templateUrl: './stockManagement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockManagement {
  @ViewChild(OrderEntryComponent) orderEntryComponent!: OrderEntryComponent
  private stockService = inject(StockService)
  private fb = inject(FormBuilder)
  private stockEventService = inject(StockEventService)

  public idWarehouse = signal<number>(1)
  public stock = signal<Stock[]>([])

  public formValueOfFiler = this.fb.group({
    filterType: [''],

  })


  constructor() {
    this.getAllStock()

    effect(() => {
      //Actualizar lista de stock si es que hay una actualizacion
      const refreshNeeded = this.stockEventService.isUpdatedProduct();
      if (refreshNeeded) {
        this.getAllStock()
        this.stockEventService.modifyValueToUpdatedProduct(false)
      }

      //Actualizar lista de stock si es que hay una eliminacion
      const deleteNeeded = this.stockEventService.isDeleteProduct();
      if (deleteNeeded) {
        this.getAllStock()
        this.stockEventService.modifyValueToDeleteProduct(false)
      }



    })


  }

  openModal(): void {
    this.orderEntryComponent.openModal()
  }
  closeModal(): void {
    this.orderEntryComponent.closeModal()
  }


  getAllStock() {
    this.stockService.getAllStock()
      .subscribe((response) => {
        // Ensure we always set an array to avoid template errors when reading length
        this.stock.set(Array.isArray(response?.data) ? response.data : [])
      })

  }
  searchStockForTerm(term: string) {
    if (term === '') return this.getAllStock()
    const filterType = this.formValueOfFiler.value.filterType
    switch (filterType) {
      case 'id':
        //buscar por id

        this.searchStockForId(term)
        break
      case 'code':
        //buscar por codigo
        this.searchStockForCode(term)
        break
      case 'name':
        //buscar por nombre
        this.searchStockForName(term)
        break

    }


  }
  searchStockForId(id: string) {
    this.stockService.getStockById(id)
      .subscribe(
        (response) => {
          // Some APIs return 404 with no data — ensure we set an array
          if (response?.status === 404) {
            this.stock.set([])
            return
          }
          this.stock.set(Array.isArray(response?.data) ? response.data : [])
        })
  }

  searchStockForCode(code: string) {
    this.stockService.getStockByCode(code)
      .subscribe((response) => {
        // Set empty array unless data is a valid array
        if (response?.status === 200 && Array.isArray(response.data)) {
          this.stock.set(response.data)
        } else {
          this.stock.set([])
        }
      })
  }
  searchStockForName(name: string) {
    this.stockService.getStockByName(name)
      .subscribe((response) => {
        if (response?.status === 200 && Array.isArray(response.data)) {
          this.stock.set(response.data)
        } else {
          this.stock.set([])
        }
      })
  }



}
