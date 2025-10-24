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

const positionArray = [
  { name: 'gerente general', code: '01gg', id: 1 },
  { name: 'jefe de proyecto', code: '02gp', id: 2 },
  { name: 'residente de obra', code: '03ro', id: 3 },
  { name: 'administrador', code: '04aa', id: 4 },
  { name: 'tesoreria', code: '05tt', id: 5 },
  { name: 'almacenero', code: '05al', id: 6 },

]
const departmentArray = [
  { name: 'logistica', code: '01lo', id: 1 },
  { name: 'administracion', code: '02ad', id: 2 },
  { name: 'recursos humanos', code: '03rh', id: 3 },
  { name: 'control de calidad', code: '04cc', id: 4 },
  { name: 'mantenimiento de planta', code: '05mp', id: 5 },
  { name: 'seguridad y medio ambiente', code: '06sm', id: 6 },
  { name: 'produccion', code: '07pr', id: 7 },
  { name: 'oficina tecnica', code: '08ot', id: 8 },
]
@Component({
  selector: 'detail-employee',
  imports: [NoPhotoPipe, RemoveHyphenPipe, ReactiveFormsModule,DatePipe,SuccessAlertComponent,ErrorAlertComponent],
  templateUrl: './detailEmployee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailEmployeeComponent {

  @ViewChild('modalEmployee') modalEmployee!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalConfirmDelete') modalConfirmDelete!: ElementRef<HTMLDialogElement>;

  private employeeService = inject(EmployeesService)
  private fb = inject(FormBuilder);
  private employeeEventService = inject(EmployeeEventService)

  employee = input.required<EmployeeResponse | null>();

  isActiveModalDelete = signal<boolean>(false);


  //Variables de exito y error
  hasError= signal<boolean>(false)
  hasNameError = signal<string>('')

  hasSuccess = signal<boolean>(false)
  hasNameSuccess= signal<string>('')

  //arreglos para departamento y position
  public positions = positionArray
  public departments = departmentArray

  namedSelectPhoto = signal<string>('')
  selectedPhotoFile = signal<File | null>(null)



  constructor(){

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


  updateEmployee(employeeId:number ) {
    if(!this.updateEmployeeForm.valid){

      this.hasError.set(true)
      this.hasNameError.set('El Formulario no es válido.')
      return
    }

    const newEmployee = this.updateEmployeeForm.value

    this.employeeService.updateEmployee(newEmployee,employeeId, this.selectedPhotoFile())
    .subscribe({
      next: (resp) => {
        if (resp.status ==200) {
          this.hasSuccess.set(true)
          this.hasNameSuccess.set('Empleado actualizado con éxito.')
        }

        this.employeeEventService.employeeUpdated(true);

      },
      error: (err) => {

        if (err.status==409) {
          this.hasError.set(true)
          this.hasNameError.set('El DNI o correo ya existe en otro empleado.')
        }
        if (err.status==500) {
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
        error: (err) => console.log(err)
      })
  }



}
