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
  public isLoading = signal<boolean>(false);

  @ViewChild(ModalCreateEmployeeComponent) modalCreateEmployee!: ModalCreateEmployeeComponent

  constructor() {
    this.getAllEmployees();

    //Efecto para recargar la lista de empleados cuando se crea uno nuevo
    effect(() => {
      const isUpdatedEmployee = this.employeeEventService.isEmployeeUpdated()
      if (isUpdatedEmployee) {
        this.getAllEmployees();
        // Resetear el estado después de recargar
        this.employeeEventService.employeeUpdated(false);
      }
    })

  }

  openModal() {
    this.modalCreateEmployee.openModal();
  }


  getAllEmployees() {
    this.isLoading.set(true);
    this.employeesService.getAllEmployees()
      .subscribe({
        next: (response) => {
          this.employeesList.set(response);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.isLoading.set(false);
        }
      })
  }

  searchEmployeeForName(term: string) {
    if (term === '') {
      this.getAllEmployees();
      return;
    }
    this.isLoading.set(true);
    this.employeesService.searchEmployeeForName(term)
      .subscribe({
        next: (response) => {
          this.employeesList.set(response.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error searching employees:', error);
          this.isLoading.set(false);
        }
      })
  }


}
