import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { StockEventService } from '../../services/stockEvent.service';
import { Stock } from '../../interfaces/APIResponseStock.interface';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';

@Component({
  selector: 'confirm-delete-stock',
  imports: [ErrorAlertComponent,SuccessAlertComponent],
  templateUrl: './confirmDeleteStock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteStockComponent {
  @ViewChild('modalDeleteConfirm') modalDeleteConfirm!: ElementRef<HTMLDialogElement>

  idStock = signal<number | null>(null)


  private stockService = inject(StockService)
  private stockEventService = inject(StockEventService)

   //Variables de error y acierto
  hasError = signal<boolean>(false)
  errorMessage = signal<string>('')

  hasSuccess = signal<boolean>(false)
  successMessage = signal<string>('')

  productForDelete = signal<Stock | null>(null)



  openModal(){
    this.modalDeleteConfirm.nativeElement.showModal()
  }

  closeModalConfirmDelete() {
    this.modalDeleteConfirm.nativeElement.close()
  }



  deleteStock() {
    this.stockService.deleteStock(this.idStock()!)
      .subscribe({
        next: (response) => {

          this.hasSuccess.set(true)
          this.successMessage.set(`Stock con id: ${this.idStock()} eliminado.`)

          this.stockEventService.modifyValueToUpdatedProduct(true)

          setTimeout(() => {
            this.hasSuccess.set(false)
            this.successMessage.set('')
          }, 7000);

          this.closeModalConfirmDelete()

        },
        error: (error) => {
          this.hasError.set(true)
          this.errorMessage.set('Error al eliminar el stock')
          setTimeout(() => {
            this.hasError.set(false)
            this.errorMessage.set('')
          }, 3000);
        }
      })

  }

}
