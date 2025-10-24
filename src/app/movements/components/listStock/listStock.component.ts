import { ChangeDetectionStrategy, Component, EventEmitter, inject, signal, Output } from '@angular/core';

import { StockService } from '../../../stock/services/stock.service';
import { Stock } from '../../../stock/interfaces/APIResponseStock.interface';
import { SearchComponent } from "../../../shared/components/search/search.component";


@Component({
  selector: 'list-stock-in-movements',
  imports: [SearchComponent],
  templateUrl: './listStock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListStockComponent {

  private stockService = inject(StockService)

  public listStock = signal<Stock []>([])

  //Variables de error y acierto
  public hasError = signal<boolean>(false)
  public hasNameError = signal<string>('')

  public hasSuccess = signal<boolean>(false)
  public hasNameSuccess = signal<string>('')

  constructor(){

      this.getAllStocks()


  }

  @Output() selectedStock = new EventEmitter<Stock>()

  selectStock(stock: Stock){
    this.selectedStock.emit(stock)
  }

  getAllStocks(){
    this.stockService.getAllStock()
    .subscribe(
      (response)=>{

            this.listStock.set(Array.isArray(response?.data)? response.data:[])
            this.hasSuccess.set(true)
        }
    )
  }

  searchStockForName(name:string){
    if(name ===''){
      this.getAllStocks();
      return;
    }
    this.stockService.getStockByName(name)
    .subscribe(
      (response)=>{

            this.listStock.set(Array.isArray(response?.data)? response.data:[])
            this.hasSuccess.set(true)
        }
    )
  }



 }
