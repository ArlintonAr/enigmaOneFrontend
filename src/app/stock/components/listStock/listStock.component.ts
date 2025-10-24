import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
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


  public listStock = input.required<Stock[]>();

   openModalDetailStock(product: Stock) {
    this.detailStockComponent.product.set(product);
    this.detailStockComponent.initializeForm();
    this.detailStockComponent.modalDetailStock.nativeElement.showModal();
  }

  openModalConfirmDelete(id:number) {
    this.confirmDeleteStockComponent.idStock.set(id);
    this.confirmDeleteStockComponent.openModal();
  }
}



