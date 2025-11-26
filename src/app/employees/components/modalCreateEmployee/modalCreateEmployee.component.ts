
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { FormUtils } from '../../../utils/formUtils';
import { EmployeesService } from '../../services/employees.service';
import { CreateNewEmploye } from '../../interfaces/employeeNewCreate.interface';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';
import { ConfigurationService } from '../../../configuration/services/configuration.service';
import { Position } from '../../../configuration/interfaces/APIResponsePosition';
import { Department } from '../../../configuration/interfaces/APIResponseDepartments';




@Component({
  selector: 'modal-create-employee',
  imports: [ReactiveFormsModule, ErrorAlertComponent, SuccessAlertComponent],
  templateUrl: './modalCreateEmployee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCreateEmployeeComponent {
  private employeeService = inject(EmployeesService)
  private fb = inject(FormBuilder)
  private configurationService = inject(ConfigurationService)

  formUtils = FormUtils
  positions = signal<Position[]>([]);
  departments = signal<Department[]>([]);

  // Roles disponibles
  roles = [
    { value: 'SUPER_ADMIN', label: 'Super Administrador' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
    { value: 'LIDER_DE_EQUIPO', label: 'Líder de Equipo' },
    { value: 'EMPLEADO', label: 'Empleado' },
    { value: 'CONTRATISTA', label: 'Contratista' },
    { value: 'INVITADO', label: 'Invitado' }
  ];

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

    positionId: [undefined as number | undefined, Validators.required],
    departmentId: [undefined as number | undefined, Validators.required],
    role: ['EMPLEADO', Validators.required] // Campo role agregado con valor por defecto 'EMPLEADO'
  })

  constructor() {
    this.loadPositions();
    this.loadDepartments();
  }

  // Cargar posiciones desde el backend
  loadPositions(): void {
    this.configurationService.getAllPositions().subscribe({
      next: (response) => {
        this.positions.set(response.data || []);
        // Establecer el primer valor si existe
        if (response.data && response.data.length > 0) {
          this.createEmployeeForm.patchValue({ positionId: response.data[0].id });
        }
      },
      error: (error) => {
        console.error('Error loading positions:', error);
      }
    });
  }

  // Cargar departamentos desde el backend
  loadDepartments(): void {
    this.configurationService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments.set(response.data || []);
        // Establecer el primer valor si existe
        if (response.data && response.data.length > 0) {
          this.createEmployeeForm.patchValue({ departmentId: response.data[0].id });
        }
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  @ViewChild('createEmployee') createEmployee!: ElementRef<HTMLDialogElement>;

  openModal(): void {
    this.createEmployee.nativeElement.showModal();
  }

  clouseModal(): void {
    this.createEmployee.nativeElement.close();
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
      .subscribe({
        next: (response) => {

          if (response.status === 201) {
            this.success.set(true)
            this.successMessage.set(response.message)
            this.resetValuesOfForm()
          }
        },
        error: (err) => {
          if (err.status == 409 || err.status == 500) {
            this.hasError.set(true)
            this.errorName.set(err.error.message)
            return
          }
          if (err.status == 403) {
            this.hasError.set(true)
            this.errorName.set('No tiene permisos para crear empleados.')
            return
          }
        }
      })


  }


  resetValuesOfForm() {
    this.createEmployeeForm.reset()

    this.selectedPhoto = null
    this.namedSelectPhoto.set('')


    this.hasError.set(false)
    this.errorName.set('')
  }


}
/*

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

        */
