import { ChangeDetectionStrategy, Component, EventEmitter, inject, signal, Output, OnInit } from '@angular/core';

import { StockService } from '../../../stock/services/stock.service';
import { Stock } from '../../../stock/interfaces/APIResponseStock.interface';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { WarehouseService } from '../../../stock/services/warehouse.service';
import { Warehouse } from '../../../stock/interfaces/APIResponseWarehouse';


@Component({
  selector: 'list-stock-in-movements',
  imports: [SearchComponent],
  templateUrl: './listStock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListStockComponent implements OnInit {

  private stockService = inject(StockService)
  private warehouseService = inject(WarehouseService)

  public listStock = signal<Stock[]>([])
  public warehouses = signal<Warehouse[]>([])
  public selectedWarehouseId = signal<number | null>(null)

  //Variables de error y acierto
  public hasError = signal<boolean>(false)
  public hasNameError = signal<string>('')

  public hasSuccess = signal<boolean>(false)
  public hasNameSuccess = signal<string>('')

  ngOnInit(): void {
    this.getAllStocks()
    this.getWarehouses()
  }

  @Output() selectedStock = new EventEmitter<Stock>()

  selectStock(stock: Stock) {
    this.selectedStock.emit(stock)
  }

  getAllStocks() {
    this.stockService.getAllStock()
      .subscribe(
        (response) => {

          this.listStock.set(Array.isArray(response?.data) ? response.data : [])
          this.hasSuccess.set(true)
        }
      )
  }

  getWarehouses() {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (resp) => {
        this.warehouses.set(resp.data || []);
      },
      error: (err) => console.error('Error loading warehouses', err)
    });
  }

  filterByWarehouse(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (!value || value === 'all') {
      this.selectedWarehouseId.set(null);
      this.getAllStocks();
      return;
    }

    const id = Number(value);
    this.selectedWarehouseId.set(id);

    this.stockService.getStockByWarehouseId(id).subscribe({
      next: (resp) => {
        this.listStock.set(Array.isArray(resp?.data) ? resp.data : [])
      },
      error: (err) => {
        console.error('Error filtering by warehouse', err);
        this.listStock.set([]);
      }
    });
  }

  searchStockForName(name: string) {
    if (name === '') {
      // If a warehouse is selected, we should probably re-fetch by warehouse?
      // For now, let's just reset to what the current filter state implies.
      if (this.selectedWarehouseId()) {
        this.stockService.getStockByWarehouseId(this.selectedWarehouseId()!).subscribe(resp => {
          this.listStock.set(Array.isArray(resp?.data) ? resp.data : [])
        })
      } else {
        this.getAllStocks();
      }
      return;
    }
    this.stockService.getStockByName(name)
      .subscribe(
        (response) => {

          this.listStock.set(Array.isArray(response?.data) ? response.data : [])
          this.hasSuccess.set(true)
        }
      )
  }

}
