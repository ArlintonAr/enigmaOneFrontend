import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { DetailsOrderApproval } from "../detailsOrderApproval/detailsOrderApproval";
import { ApprovalActionDTO, OrderApproval } from '../../interfaces/apiResponseOrdersApprovals.interface';
import { OrderService } from '../../services/orders.service';
import { RemoveHyphenPipe } from '../../../employees/pipes/removeHyphen.pipe';
import { UpperCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { User } from '../../../auth/interfaces/user.interface';
import { EmployeesService } from '../../../employees/services/employees.service';
import { ErrorAlertComponent } from "../../../shared/components/errorAlert/errorAlert.component";
import { SuccessAlertComponent } from "../../../shared/components/exitAlert/successAlert.component";
import { OrderEventService } from '../../services/orderEvent.service';

@Component({
  selector: 'approved-order',
  imports: [DetailsOrderApproval, RemoveHyphenPipe, UpperCasePipe, ɵInternalFormsSharedModule, ReactiveFormsModule, ErrorAlertComponent, SuccessAlertComponent],
  templateUrl: './approvedOrder.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedOrder {
  @ViewChild('modalApproved') modalApproved!: ElementRef<HTMLDialogElement>;

  orderService = inject(OrderService);
  orderEventService = inject(OrderEventService)
  employeeService = inject(EmployeesService)
  fb = inject(FormBuilder)


  orderId = input.required<number>();
  //variable para guardar la lista de ordersApproval
  ordersApproval = signal<OrderApproval[]>([]);

  //Llamar al usuario autenticado para obtener su rol
  userAuthenticated = computed(() => {
    const user = localStorage.getItem('user')
    return !user ? null : JSON.parse(user)
  })
  user: User = this.userAuthenticated()
  positionUser = signal<string>('')

  //Variables de error y acierto
  hasError = signal<boolean>(false)
  nameError = signal<string>('')

  hasSuccess = signal<boolean>(false)
  nameSuccess = signal<string>('')

  constructor() {


  }

  //Formulario para actualizar
  formUpdateApproved: FormGroup = this.fb.group({
    status: ['APROBADO', Validators.required],
    comments: ['', Validators.required]
  })

  openModal(orderId: number) {
    this.getOrdersApprovalForOrderId(orderId)
    this.getEmployeeForId()
    this.modalApproved.nativeElement.showModal()
  }
  closeModal() {
    this.modalApproved.nativeElement.close()
  }


  getOrdersApprovalForOrderId(id: number) {
    this.orderService.getOrdersApprovalsForOrderId(id)
      .subscribe({
        next: (response) => {
          this.ordersApproval.set(response.data);

        },
        error: (error) => {

        }
      })
  }

  updatedStatusApproval() {
    if (!this.formUpdateApproved.valid) {
      this.hasError.set(true)
      this.nameError.set("Formulario inválido, llene el campo de mensaje")
      return
    }

    const { status, comments } = this.formUpdateApproved.value
    const approvalAction: ApprovalActionDTO = { comments }

    if (status === 'RECHAZADO') {
      //llamar servicio para rechazar
      this.orderService.rejectOrder(this.orderId(), this.positionUser(), approvalAction)
        .subscribe({
          next: (data) => {
            console.log("Rechazadooo: ", data)
            this.hasSuccess.set(true)
            this.nameSuccess.set(`Orden Rechazada por: ${this.positionUser()}`)

            //Actualizar variable para que detecte cambios cuando se ha actualizado
            this.orderEventService.updatedStatusOrder(true);

            //resetear valores
            this.formUpdateApproved.reset()
            this.closeModal()
          },
          error: (err) => {
            this.hasError.set(true)
            this.nameError.set(`${err.error.message} `)


            this.formUpdateApproved.reset()
            this.closeModal()
          }
        })
    } else {
      if (status === 'APROBADO') {
        //Llamar servicio para aprobar
        this.orderService.approveOrder(this.orderId(), this.positionUser(), approvalAction)
          .subscribe({
            next: (data) => {

              this.hasSuccess.set(true)
              this.nameSuccess.set(`Orden Aprobada por: ${this.positionUser()}`)

              //Actualizar variable para que detecte cambios cuando se ha actualizado
              this.orderEventService.updatedStatusOrder(true);

              this.formUpdateApproved.reset()
              this.closeModal()
            },
            error: (err) => {
              this.hasError.set(true)
              this.nameError.set(`${err.error.message} `)

              this.formUpdateApproved.reset()
              this.closeModal()
            }
          })
      }

    }

  }


  getEmployeeForId() {
    this.employeeService.searchEmployeeForId(Number(this.user.id))
      .subscribe({
        next: (data) => {
          this.positionUser.set(data.role)

        },
        error: (error) => {
          console.log(error)
        }
      })
  }






}

