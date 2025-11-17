import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, ViewChild, effect } from '@angular/core';
import { Stock } from '../../interfaces/APIResponseStock.interface';
import { ToUpperCaseFirstLetterPipe } from '../../../employees/pipes/toUpperCaseFirstLetter.pipe';
import { NoPhotoPipe } from '../../../employees/pipes/noPhoto.pipe';

import { DatePipe, UpperCasePipe } from '@angular/common';
import { DetailStockComponent } from '../detailStock/detailStock.component';
import { DetailEmployeeComponent } from "../../../employees/components/detailEmployee/detailEmployee.component";
import { StockService } from '../../services/stock.service';
import { StockEventService } from '../../services/stockEvent.service';
import { ConfirmDeleteStockComponent } from '../confirmDeleteStock/confirmDeleteStock.component';

@Component({
  selector: 'list-stock',
  imports: [ToUpperCaseFirstLetterPipe, DatePipe, NoPhotoPipe, DetailStockComponent, ConfirmDeleteStockComponent],
  templateUrl: './listStock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListStockComponent {
  @ViewChild(DetailStockComponent) detailStockComponent!: DetailStockComponent
  @ViewChild(ConfirmDeleteStockComponent) confirmDeleteStockComponent!: ConfirmDeleteStockComponent
  private stockEventService = inject(StockEventService)
  private stockService = inject(StockService)
/*
  public listStock = input.required<Stock[]>() */

  public listStockForWarehouse = signal<Stock[]>([])
  public idWarehouse = input<number>()

   openModalDetailStock(product: Stock) {
    this.detailStockComponent.product.set(product)
    this.detailStockComponent.initializeForm()
    this.detailStockComponent.modalDetailStock.nativeElement.showModal()
  }

  openModalConfirmDelete(id:number) {
    this.confirmDeleteStockComponent.idStock.set(id)
    this.confirmDeleteStockComponent.openModal()
  }


  getStockForWarehouse(id?: number){
    // resolve id from param, stockEventService or input prop
    const idWarehouseEvent = id ?? this.stockEventService.selectedWarehouseId() ?? (this.idWarehouse ? this.idWarehouse() : null)
    if (!idWarehouseEvent) {
      // clear list when no warehouse selected
      this.listStockForWarehouse.set([])
      return
    }

    this.stockService.getStockByWarehouseId(idWarehouseEvent)
    .subscribe({
      next: (response) => {
        this.listStockForWarehouse.set(Array.isArray(response.data) ? response.data : [])
      },
      error: (err) => {
        console.error('getStockForWarehouse error', err)
        this.listStockForWarehouse.set([])
      }
    })
  }

  constructor() {

    effect(() => {
      const selectedFromService = this.stockEventService.selectedWarehouseId()
      const selectedFromInput = this.idWarehouse ? this.idWarehouse() : null
      const raw = selectedFromService ?? selectedFromInput
      const selected = raw == null ? null : Number(raw)
      if (selected == null || Number.isNaN(selected)) {
        this.listStockForWarehouse.set([])
        return
      }
      this.getStockForWarehouse(selected)
    })
  }


}



