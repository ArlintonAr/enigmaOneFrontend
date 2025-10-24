import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubMenuForModulesComponent } from "../../../shared/components/SubmenuForModules/subMenuForModules.component";
import { SubMenu } from '../../../shared/interfaces/subMenu.interface';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-orders-layout',
  imports: [SubMenuForModulesComponent, RouterOutlet ],
  templateUrl: './ordersLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersLayoutComponent {


  subMenu: SubMenu[] = [
      {
        name: 'Ordenes',
        icon: 'fa-regular fa-circle-right',
        description: '+1',
        route: '/dashboard/ordenes/pedidos'
      },
      {
        name: 'Autorizacion de pedidos',
        icon: 'fa-regular fa-circle-left',
        description: '+3',
        route: '/dashboard/ordenes/autorizacion-de-pedidos'
      },
      {
        name: 'Estado de pedidos',
        icon: 'fa-regular fa-circle-left',
        description: '+3',
        route: '/dashboard/ordenes/estado-de-pedidos'
      }
    ]



}
