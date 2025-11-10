import { ChangeDetectionStrategy, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { DetailEMaterial } from '../../interfaces/movement.interface';
import { DatePipe } from '@angular/common';
import { MovementService } from '../../services/movements.service';

@Component({
  selector: 'details-movements',
  imports: [DatePipe],
  templateUrl: './detailsMovements.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMovements {
  @ViewChild('detailMovementModal') detailMovementModal!: ElementRef<HTMLDialogElement>;
  private movementService = inject(MovementService)

  detailMaterials = input<DetailEMaterial[]>()



  openModal(): void {
    this.detailMovementModal.nativeElement.showModal()
  }
  closeModal(): void {
    this.detailMovementModal.nativeElement.close()
  }


  generateMovementReport() {

    const orderId = this.detailMaterials()![0].movementId
    this.movementService.genereteReportForMovementId(Number(orderId))
    .subscribe((pdf) => {
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
    }
    )
  }

}
