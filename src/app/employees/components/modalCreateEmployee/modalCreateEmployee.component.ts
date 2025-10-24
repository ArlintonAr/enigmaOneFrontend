
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { FormUtils } from '../../../utils/formUtils';
import { EmployeesService } from '../../services/employees.service';
import { CreateNewEmploye } from '../../interfaces/employeeNewCreate.interface';

import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';

const positionsArray = [

  { name: 'Gerente General', id: 1 },
  { name: 'Jefe de Proyecto', id: 2 },
  { name: 'Residente de Obra', id: 3 },
  { name: 'Administrativo', id: 4 },
  { name: 'Tesorero', id: 5 },
  { name: 'Almacenero', id: 7 },

]

const departmentsArray = [

  { name: 'Logistica', id: 1 },
  { name: 'Administracion', id: 2 },
  { name: 'Recursos Humanos', id: 3 },
  { name: 'Control de Calidad', id: 4 },
  { name: 'Mantenimiento de Planta', id: 5 },
  { name: 'Seguridad y Medio Ambiente', id: 6 },
  { name: 'Produccion', id: 7 },
  { name: 'Oficina Tecnica', id: 8 },
]


@Component({
  selector: 'modal-create-employee',
  imports: [ReactiveFormsModule, ErrorAlertComponent, SuccessAlertComponent],
  templateUrl: './modalCreateEmployee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCreateEmployeeComponent {
  private employeeService = inject(EmployeesService)
  private fb = inject(FormBuilder)
  formUtils = FormUtils
  positions = positionsArray;
  departments = departmentsArray;

  //Errores
  hasError = signal<boolean>(false)
  errorName = signal<string>('')

  //exito
  success = signal<boolean>(false)
  successMessage = signal<string>('')



  selectedPhoto: File | null = null;
  namedSelectPhoto = signal<string>('')

  public createEmployeeForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['0', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

    address: ['',],
    cellphone: ['',],
    bankAccountNumber: ['',],
    bankAccountCciNumber: ['', []],
    salary: ['', Validators.required,],
    birthday: [''],


    positionId: [this.positions[0].id, Validators.required],
    departmentId: [this.departments[0].id, Validators.required]
  })

  @ViewChild('createEmployee') createEmployee!: ElementRef<HTMLDialogElement>;

  openModal(): void {
    this.createEmployee.nativeElement.showModal();
  }

  clouseModal(): void {
    this.resetValuesOfForm()
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      this.namedSelectPhoto.set(this.selectedPhoto.name)
    }
  }

  createNewEmployee() {
    if (!this.createEmployeeForm.valid) {
      this.hasError.set(true);
      this.errorName.set('Formulario no válido, por favor revise los campos.');
      return

    }
    const formValue = this.createEmployeeForm.value // asigno
    //Eliminar el tipado para cada valor de los atributos
    const employeeLike: Partial<CreateNewEmploye> = {
      ...(formValue as any),
    }

    this.employeeService.createNewEmployee(employeeLike, this.selectedPhoto!)
      .subscribe(
        (response) => {
          //Validaciones para saber si hubo un error
          if (response.status == 409 || response.status == 500) {
            this.hasError.set(true)
            this.errorName.set(response.error.message)
            return
          }
          //Si todo sale bien, se cierra el modal y se resetean los valores
          if (response.status === 201) {
            this.success.set(true)
            this.successMessage.set(response.message)
            this.resetValuesOfForm()
          }
        }
      )


  }


  resetValuesOfForm() {
    this.createEmployeeForm.reset()

    this.selectedPhoto = null
    this.namedSelectPhoto.set('')
    this.createEmployee.nativeElement.close()

    this.hasError.set(false)
    this.errorName.set('')
  }


}
