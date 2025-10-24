import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ItemDashboardComponent } from "../../components/itemDashboard/itemDashboard.component";
import { RouterOutlet } from '@angular/router';
import { EmployeesService } from '../../../employees/services/employees.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NoPhotoPipe } from '../../../employees/pipes/noPhoto.pipe';
import { User } from '../../../auth/interfaces/user.interface';
import { UpperCasePipe } from '@angular/common';
import { DetailEmployeeComponent } from '../../../employees/components/detailEmployee/detailEmployee.component';
import { EmployeeResponse } from '../../../employees/interfaces/employeeResponse.interface';


@Component({
  selector: 'dashboard-layout',
  imports: [ItemDashboardComponent, RouterOutlet, NoPhotoPipe, UpperCasePipe, DetailEmployeeComponent],
  templateUrl: './dashboardLayout.component.html',

})
export class DashboardLayoutComponent {
  @ViewChild(DetailEmployeeComponent) detailComp!: DetailEmployeeComponent;

  private employeesService = inject(EmployeesService)

  public employee= signal<EmployeeResponse | null>(null)


  userAuthenticated = computed(() => {
    const user = localStorage.getItem('user')
    return !user? null: JSON.parse(user)
  })



  user:User = this.userAuthenticated()

  // Controls mobile sidebar visibility (hamburger menu)
  sidebarOpen = signal(false);

  constructor(){
    this.getEmployeeForId()
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }


  getEmployeeForId(){
    const userId = this.user!.id;
    if (!userId) {

      return;
    }

    this.employeesService.searchEmployeeForId(Number(userId))
    .subscribe({
      next: (resp) => {
        if (resp) {
          this.employee.set(resp);

        }

      },
      error: (err) => {
        console.error('Error al obtener el empleado:', err);
      }
    });
  }

  openDetailCoponent(){
    this.getEmployeeForId();
    this.detailComp.openModal();
  }


}
