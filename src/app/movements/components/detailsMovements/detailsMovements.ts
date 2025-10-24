import { ChangeDetectionStrategy, Component, ElementRef, input, ViewChild } from '@angular/core';
import { DetailEMaterial } from '../../interfaces/movement.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'details-movements',
  imports: [DatePipe],
  templateUrl: './detailsMovements.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMovements {
  @ViewChild('detailMovementModal') detailMovementModal!: ElementRef<HTMLDialogElement>;

  detailMaterials = input<DetailEMaterial[]>()



  openModal(): void {
    this.detailMovementModal.nativeElement.showModal()
  }
  closeModal(): void {
    this.detailMovementModal.nativeElement.close()
  }


}
