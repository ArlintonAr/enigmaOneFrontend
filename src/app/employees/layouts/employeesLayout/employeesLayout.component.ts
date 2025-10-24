import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SubMenuForModulesComponent } from '../../../shared/components/SubmenuForModules/subMenuForModules.component';
import { SubMenu } from '../../../shared/interfaces/subMenu.interface';



@Component({
  selector: 'app-employees-layout',
  imports: [RouterOutlet, SubMenuForModulesComponent],
  templateUrl: './employeesLayout.component.html',
})
export class EmployeesLayoutComponent {


  subMenu: SubMenu[] = [
    {
      name: 'Lista de empleados',
      icon: 'fa-solid fa-users',
      description: '+1',
      route: '/dashboard/empleados/gestion-empleados'
    },
    {
      name: 'Mis Movimientos',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      description: '+3',
      route: '/dashboard/empleados/mis-movimientos'
    },
    {
      name: 'Mis ordenes',
      icon: 'fa-solid fa-rectangle-list',
      description: '+1',
      route: '/dashboard/empleados/mis-ordenes'
    }
  ]

}
