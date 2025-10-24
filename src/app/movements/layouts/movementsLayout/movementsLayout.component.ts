import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubMenuForModulesComponent } from "../../../shared/components/SubmenuForModules/subMenuForModules.component";
import { SubMenu } from '../../../shared/interfaces/subMenu.interface';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'movements-layout',
  imports: [SubMenuForModulesComponent,RouterOutlet],
  templateUrl: './movementsLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementsLayoutComponent {



subMenu: SubMenu[] = [
   {
      name: 'Administración de movimientos',
      icon: 'fa-regular fa-circle-right',
      description: '+1',
      route: '/dashboard/movimientos/administracion'
    },
    {
      name: 'Salidas',
      icon: 'fa-regular fa-circle-right',
      description: '+1',
      route: '/dashboard/movimientos/salidas'
    },
    {
      name: 'Entradas',
      icon: 'fa-regular fa-circle-left',
      description: '+3',
      route: '/dashboard/movimientos/entradas'
    },
    {
      name: 'Reportes de entradas y salidas',
      icon: 'fa-regular fa-file-powerpoint',
      description: '+1',
      route: '/dashboard/movimientos/reportes-salidas-entradas'
    }
  ]

 }
