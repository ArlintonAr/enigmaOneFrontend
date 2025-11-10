import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Stock } from '../../../stock/interfaces/APIResponseStock.interface';
import { MovementCreateDTO } from '../../interfaces/movement.interface';
import { ListStockComponent } from '../listStock/listStock.component';
import { ListEmployeesComponent } from '../../../employees/components/listEmployees/listEmployees.component';
import { EmployeesService } from '../../../employees/services/employees.service';
import { ManagementEmployeesComponent } from '../../../employees/pages/managementEmployees/managementEmployees.component';
import { MovementService } from '../../services/movements.service';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'create-movement',
  imports: [
    ReactiveFormsModule,
    ListStockComponent,
    ListEmployeesComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
    SearchComponent,
  ],
  templateUrl: './createMovement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMovementComponent implements OnInit {
  @ViewChild('listStockModal') listStockModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('listEmployeeModal')
  listEmployeeModal!: ElementRef<HTMLDialogElement>;

  //Servvicios
  private employeesService = inject(EmployeesService);
  private movementService = inject(MovementService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  movementForm!: FormGroup;

  public stockInfoMap: Record<
    number,
    { description: string; available: number }
  > = {};

  //Variables de error y acierto
  public hasError = signal<boolean>(false);
  public hasNameError = signal<string>('');

  public hasSuccess = signal<boolean>(false);
  public hasNameSuccess = signal<string>('');

  private initForm(): void {
    this.movementForm = this.fb.group(
      {
        type: [null, Validators.required],
        returnable: [null, Validators.required],
        materialRequesterId: [null, Validators.required],
        returnDate: [null],
        details: this.fb.array([]),
      },
      { validators: this.returnDateRequiredWhenRetornable.bind(this) }
    );
  }

  ngOnInit(): void {
    this.initForm();
    // Load employees initially
    this.getEmployees();
  }

  // Local employees cache used by the template
  public employees = signal<any[]>([]);

  // Load all employees and populate the local signal
  getEmployees(): void {
    this.employeesService.getAllEmployees().subscribe({
      next: (resp) => {
        this.employees.set(resp as any[]);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading employees', err);
      },
    });
  }

  // Search employees by name (calls backend endpoint)
  searchEmployeeName(term: string): void {
    if (!term || term.trim().length === 0) {
      this.getEmployees();
      return;
    }
    this.employeesService.searchEmployeeForName(term).subscribe({
      next: (resp: any) => {
        const list = Array.isArray(resp?.data) ? resp.data : resp || [];
        this.employees.set(list);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error searching employees', err),
    });
  }

  addFromModal(stock: Stock): void {
    const existingIndex = this.detailsArray.controls.findIndex(
      (ctrl) => ctrl.get('stockId')?.value === stock.id
    );
    if (existingIndex > -1) {
      const current =
        this.detailsArray.at(existingIndex).get('quantity')?.value || 0;
      if (current + 1 > stock.quantity) {
        alert(
          `No hay suficiente stock disponible. Disponible: ${
            stock.quantity
          }, solicitado: ${current + 1}`
        );
        return;
      }
      this.detailsArray
        .at(existingIndex)
        .get('quantity')
        ?.setValue(current + 1);
    } else {
      if (1 > stock.quantity) {
        alert(`No hay stock disponible para este producto.`);
        return;
      }
      this.addStockToDetails(stock);
    }

    this.stockInfoMap[stock.id] = {
      description: stock.description,
      available: stock.quantity,
    };
    this.listStockModal.nativeElement.close();
  }

  getStockInfo(stockId: number | null | undefined) {
    if (!stockId) return undefined;
    return this.stockInfoMap[stockId];
  }

  openModalStock() {
    this.listStockModal.nativeElement.showModal();
  }
  closeModalStock() {
    this.listStockModal.nativeElement.close();
  }

  get detailsArray(): FormArray {
    return this.movementForm.get('details') as FormArray;
  }

  addStockToDetails(stock: Stock): void {
    const detailGroup = this.fb.group({
      stockId: [stock.id, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      destinationMaterial: ['', Validators.required],
    });

    this.detailsArray.push(detailGroup);
  }

  removeDetail(index: number): void {
    this.detailsArray.removeAt(index);
  }

  getTotalQuantity(): number {
    return this.detailsArray.controls.reduce((total, control) => {
      const quantity = control.get('quantity')?.value || 0;
      return total + quantity;
    }, 0);
  }

  createMovement(): void {
    this.movementForm.get('returnDate')?.updateValueAndValidity();
    this.movementForm.updateValueAndValidity();

    if (!this.movementForm.valid) {
      this.movementForm.markAllAsTouched();
      this.hasError.set(true);
      const errors = this.collectFormErrors();
      this.hasNameError.set(`Formulario inválido: ${JSON.stringify(errors)}`);
      return;
    }

    const formValue = this.movementForm.value;

    const movementData: MovementCreateDTO = {
      type: formValue.type,
      returnable: formValue.returnable,
      materialRequesterId: formValue.materialRequesterId,
      returnDate: formValue.returnDate,
    };

    // Asignar detalles según el tipo de movimiento
    if (formValue.returnable === 'SALIDA') {
      movementData.detailExitMaterials = formValue.details;
    } else if (formValue.returnable === 'ENTRADA') {
      movementData.detailEntryMaterials = formValue.details;
    }

    this.movementService.createMovement(movementData).subscribe({
      next: (response) => {
        this.hasSuccess.set(true);
        this.hasNameSuccess.set(
          `Movimiento con código ${response.data?.transactionCode} creado con éxito`
        );
        this.generateMovementReport(response.data!.id);
        this.movementForm.reset();
        this.detailsArray.clear();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.hasError.set(true);
        this.hasNameError.set('Error al crear el movimiento');
        this.cdr.markForCheck();
      },
    });
  }

  private returnDateRequiredWhenRetornable(group: FormGroup) {
    const type = group.get('type')?.value;
    const returnDate = group.get('returnDate')?.value;
    if (type === 'RETORNABLE' && !returnDate) {
      return { returnDateRequired: true };
    }
    return null;
  }

  setReturnableValue(value: string) {
    const ctrl = this.movementForm.get('returnable');
    if (!ctrl) return;
    ctrl.setValue(value);
    ctrl.markAsDirty();
    ctrl.updateValueAndValidity();
  }

  setTypeValue(value: string) {
    const ctrl = this.movementForm.get('type');
    const returnDateCtrl = this.movementForm.get('returnDate');
    if (!ctrl) return;
    ctrl.setValue(value);
    ctrl.markAsDirty();

    if (value === 'RETORNABLE') {
      returnDateCtrl?.setValidators([Validators.required]);
    } else {
      returnDateCtrl?.clearValidators();
    }
    returnDateCtrl?.updateValueAndValidity();
    ctrl.updateValueAndValidity();
  }

  openEmployeeModal(): void {
    //Llamar al listado de empleados
    this.listEmployeeModal.nativeElement.showModal();
  }

  // Método para recibir el empleado seleccionado del modal
  onEmployeeSelected(employeeId: number): void {
    this.movementForm.patchValue({
      materialRequesterId: employeeId,
    });

    const c = this.movementForm.get('materialRequesterId');
    c?.markAsDirty();
    c?.updateValueAndValidity();

    this.listEmployeeModal?.nativeElement?.close();
  }

  handleEmployeeRowClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const row = target.closest('tr');
    if (!row) return;

    const idEl = row.querySelector('.text-3xl');
    if (!idEl) return;
    const text = idEl.textContent || '';
    const m = text.match(/#(\d+)/);
    if (m) {
      const id = Number(m[1]);
      if (!isNaN(id)) {
        this.onEmployeeSelected(id);
      }
    }
  }

  private collectFormErrors() {
    const result: any = {};
    Object.keys(this.movementForm.controls).forEach((key) => {
      const control: any = this.movementForm.get(key);
      if (control instanceof FormArray) {
        result[key] = control.controls.map((c: any, idx: number) => ({
          index: idx,
          errors: c.errors,
        }));
      } else {
        result[key] = control.errors || null;
      }
    });
    return result;
  }

  resetForm(): void {
    this.movementForm.reset();
    this.detailsArray.clear();
  }

  //Listar empleados

  //Crear reporte al guardar
  generateMovementReport(movementId: number) {
    this.movementService
      .genereteReportForMovementId(Number(movementId))
      .subscribe((pdf) => {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }
}
