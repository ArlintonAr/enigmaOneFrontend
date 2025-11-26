import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { Stock } from '../../interfaces/APIResponseStock.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NoPhotoPipe } from '../../../employees/pipes/noPhoto.pipe';
import { single } from 'rxjs';
import { StockService } from '../../services/stock.service';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { StockEventService } from '../../services/stockEvent.service';

@Component({
  selector: 'detail-stock',
  imports: [DatePipe, NoPhotoPipe, ReactiveFormsModule, ErrorAlertComponent, SuccessAlertComponent],
  templateUrl: './detailStock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailStockComponent {
  // ViewChild para el modal
  @ViewChild('modalDetailStock') modalDetailStock!: ElementRef<HTMLDialogElement>;

  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private stockEventService = inject(StockEventService);

  // Input para recibir el producto
  product = signal<Stock | null>(null);

  //Variables de error y exito

  hasError = signal<boolean>(false);
  errorMessage = signal<string>('')

  hasSuccess = signal<boolean>(false);
  successMessage = signal<string>('');

  // Formulario reactivo
  stockForm: FormGroup = this.fb.group({
    quantity: [0,],
    unitOfMeasure: ['',],
    description: ['',],
    characteristics: [''],
    entryDate: ['',],
    accordingType: ['SI',],
    messageAccordingType: ['']
  });

  // Signals para manejo de foto
  selectedFile = signal<File | null>(null);
  photoPreview = signal<string | null>(null);

  // Signals para manejo de PDF de guías
  selectedPdfFile = signal<File | null>(null);
  pdfFileName = signal<string>('');

  constructor() {
    this.stockForm = this.fb.group({
      quantity: [0],
      unitOfMeasure: [''],
      description: [''],
      characteristics: [''],
      entryDate: [''],
      accordingType: ['SI'],
      messageAccordingType: ['']
    });
  }

  ngOnInit() {
    // Inicializar el formulario con los datos del producto
    this.initializeForm();
  }

  initializeForm() {
    const prod = this.product();
    if (prod) {
      this.stockForm.patchValue({
        quantity: prod.quantity,
        unitOfMeasure: prod.unitOfMeasure,
        description: prod.description,
        characteristics: prod.characteristics,
        entryDate: this.formatDate(prod.entryDate),
        accordingType: prod.accordingType,
        messageAccordingType: prod.messageAccordingType
      });
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openModal() {
    this.initializeForm();
    this.modalDetailStock.nativeElement.showModal();
  }

  closeModal() {
    this.modalDetailStock.nativeElement.close();
    this.clearPhoto();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);


      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview.set(e.target.result);
      };
      reader.readAsDataURL(file);

    }
    this.stockForm.markAsDirty();
  }

  clearPhoto() {
    this.selectedFile.set(null);
    this.photoPreview.set(null);
  }

  // Manejo de PDF
  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar que sea un PDF
      if (file.type === 'application/pdf') {
        this.selectedPdfFile.set(file);
        this.pdfFileName.set(file.name);
        this.stockForm.markAsDirty();
      } else {
        this.hasError.set(true);
        this.errorMessage.set('Solo se permiten archivos PDF');
      }
    }
  }

  clearPdf() {
    this.selectedPdfFile.set(null);
    this.pdfFileName.set('');
  }

  downloadPdf() {
    const pdfUrl = this.product()?.orderGuides;
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  }

  resetForm() {
    this.initializeForm();
    this.clearPhoto();
    this.clearPdf();
  }

  saveChanges() {
    if (this.stockForm.valid) {
      const formData = this.stockForm.value;

      // Aquí implementas la lógica para guardar

      this.stockService.updateStock(formData, this.product()!.id, this.selectedFile(), this.selectedPdfFile())
        .subscribe({
          next: (response) => {

            this.hasSuccess.set(true);
            this.successMessage.set(`Stock con ID: ${response.data.id} actualizado con éxito.`);
            this.stockForm.markAsPristine();
            // Actualizar la señal del producto con los nuevos datos
            this.product.set(response.data);
            this.stockEventService.modifyValueToUpdatedProduct(true);

            // Limpiar archivos seleccionados
            this.clearPhoto();
            this.clearPdf();

            // Aquí puedes agregar lógica adicional, como cerrar el modal o mostrar un mensaje
            this.closeModal();
          },
          error: (error) => {
            if (error.status == 500) {
              this.hasError.set(true)
              this.errorMessage.set('Ha ocurrido un problema en el servidor, comuníquese con el Administrador.')
            }

          }
        })

      // Emitir evento o llamar servicio
      // this.onSave.emit({ ...formData, photo: this.selectedFile() });

      // Cerrar modal después de guardar
      // this.closeModal();
    }
  }


}
