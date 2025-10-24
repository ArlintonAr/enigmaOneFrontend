import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';

import { SearchComponent } from "../../../shared/components/search/search.component";
import { ListEmployeesComponent } from "../../components/listEmployees/listEmployees.component";
import { EmployeesService } from '../../services/employees.service';
import { EmployeeResponse } from '../../interfaces/employeeResponse.interface';
import { ModalCreateEmployeeComponent } from '../../components/modalCreateEmployee/modalCreateEmployee.component';
import { EmployeeEventService } from '../../services/employeeEvent.service';

@Component({
  selector: 'app-management-employees',
  imports: [SearchComponent, ListEmployeesComponent, ModalCreateEmployeeComponent],
  templateUrl: './managementEmployees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementEmployeesComponent {

  private employeesService = inject(EmployeesService);
  private employeeEventService = inject(EmployeeEventService);
  public employeesList = signal<EmployeeResponse[]>([]);

  @ViewChild(ModalCreateEmployeeComponent) modalCreateEmployee!:ModalCreateEmployeeComponent

  constructor() {
    this.getAllEmployees();

    //Efecto para recargar la lista de empleados cuando se crea uno nuevo
    effect(() => {
      const isUpdatedEmployee =  this.employeeEventService.isEmployeeUpdated()
      if(isUpdatedEmployee){
        this.getAllEmployees();

      }
    })

  }

  openModal(){
    this.modalCreateEmployee.openModal();
  }


  getAllEmployees() {
    this.employeesService.getAllEmployees()
      .subscribe(
        (response) => this.employeesList.set(response)
      )
  }

  searchEmployeeForName(term:string){
    if(term ===''){
      this.getAllEmployees();
      return;
    }
    this.employeesService.searchEmployeeForName(term)
    .subscribe(
      (response) => {
        this.employeesList.set(response.data)
        console.log(this.employeesList())
      }
    )
  }


}
