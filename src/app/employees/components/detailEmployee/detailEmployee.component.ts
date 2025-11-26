import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { EmployeeResponse } from '../../interfaces/employeeResponse.interface';
import { NoPhotoPipe } from '../../pipes/noPhoto.pipe';
import { DatePipe } from '@angular/common';
import { RemoveHyphenPipe } from '../../pipes/removeHyphen.pipe';
import { EmployeesService } from '../../services/employees.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { EmployeeEventService } from '../../services/employeeEvent.service';
import { ConfigurationService } from '../../../configuration/services/configuration.service';
import { Position } from '../../../configuration/interfaces/APIResponsePosition';
import { Department } from '../../../configuration/interfaces/APIResponseDepartments';


@Component({
  selector: 'detail-employee',
  imports: [NoPhotoPipe, RemoveHyphenPipe, ReactiveFormsModule, DatePipe, SuccessAlertComponent, ErrorAlertComponent],
  templateUrl: './detailEmployee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailEmployeeComponent {

  @ViewChild('modalEmployee') modalEmployee!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalConfirmDelete') modalConfirmDelete!: ElementRef<HTMLDialogElement>;

  private employeeService = inject(EmployeesService)
  private fb = inject(FormBuilder);
  private employeeEventService = inject(EmployeeEventService)
  private configurationService = inject(ConfigurationService)

  employee = input.required<EmployeeResponse | null>();

  isActiveModalDelete = signal<boolean>(false);


  //Variables de exito y error
  hasError = signal<boolean>(false)
  hasNameError = signal<string>('')

  hasSuccess = signal<boolean>(false)
  hasNameSuccess = signal<string>('')

  //Signals para departamentos y posiciones desde el backend
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

  namedSelectPhoto = signal<string>('')
  selectedPhotoFile = signal<File | null>(null)



  constructor() {
    this.loadPositions();
    this.loadDepartments();
  }

  // Cargar posiciones desde el backend
  loadPositions(): void {
    this.configurationService.getAllPositions().subscribe({
      next: (response) => {
        this.positions.set(response.data || []);
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
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  // Formulario reactivo - TODOS los campos son opcionales
  updateEmployeeForm: FormGroup = this.fb.group({
    dni: [],
    positionId: [],
    departmentId: [],
    password: [],
    firstName: [],
    lastName: [],
    email: [],
    cellphone: [],
    salary: [],
    birthday: [],
    bankAccountCciNumber: [],
    bankAccountNumber: [],
    address: [],
    active: [true],
    role: [], // Campo role agregado
  });

  // Inicializar el formulario con los datos del empleado


  openModal(): void {
    this.modalEmployee.nativeElement.showModal();
  }

  clouseModal(): void {
    this.modalEmployee.nativeElement.close();
    this.clouseModalForDelete();
  }

  openModalForDelete() {
    this.isActiveModalDelete.set(true);

    setTimeout(() => {
      this.modalConfirmDelete.nativeElement.showModal();
    });

  }

  clouseModalForDelete() {
    this.isActiveModalDelete.set(false);
  }

  closeHasSuccess(isClose: boolean) {
    if (isClose) {
      this.hasSuccess.set(false);
      this.hasNameSuccess.set('');
    }
  }

  closeHasError(isClose: boolean) {
    if (isClose) {
      this.hasError.set(false);
      this.hasNameError.set('');
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      this.namedSelectPhoto.set('Seleccionar foto')
      return;
    }
    const file = input.files[0];

    this.selectedPhotoFile.set(file);
    this.namedSelectPhoto.set(file.name)

    // Marca el formulario como dirty
    this.updateEmployeeForm.markAsDirty();
  }


  resetForm() {
    this.updateEmployeeForm.reset();
    this.namedSelectPhoto.set('')
    this.hasError.set(false)
    this.hasNameError.set('')
    this.hasSuccess.set(false)
    this.hasNameSuccess.set('')
  }


  updateEmployee(employeeId: number) {
    if (!this.updateEmployeeForm.valid) {

      this.hasError.set(true)
      this.hasNameError.set('El Formulario no es válido.')
      return
    }

    const newEmployee = this.updateEmployeeForm.value

    this.employeeService.updateEmployee(newEmployee, employeeId, this.selectedPhotoFile())
      .subscribe({
        next: (resp) => {
          if (resp.status == 200) {
            this.hasSuccess.set(true)
            this.hasNameSuccess.set('Empleado actualizado con éxito.')
          }

          this.employeeEventService.employeeUpdated(true);

        },
        error: (err) => {

          if (err.status == 403) {
            this.hasError.set(true)
            this.hasNameError.set('No tiene permisos para actualizar empleados.')
          }

          if (err.status == 409) {
            this.hasError.set(true)
            this.hasNameError.set('El DNI o correo ya existe en otro empleado.')
          }
          if (err.status == 500) {
            this.hasError.set(true)
            this.hasNameError.set('Error del servidor, intente más tarde.')
          }
        }

      })

  }
  deleteEmployee() {
    if (!this.employee) return;
    this.employeeService.deleteEmployeeForId(this.employee()?.id)
      .subscribe({
        next: () => {
          this.clouseModal();
          this.clouseModalForDelete();
        },
        error: (err) => {
          this.hasError.set(true)
          this.hasNameError.set('Error al eliminar el empleado.')
        }
      })
  }



}
