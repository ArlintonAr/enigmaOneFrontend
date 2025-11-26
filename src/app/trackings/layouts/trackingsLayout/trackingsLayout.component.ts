import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubMenu } from '../../../shared/interfaces/subMenu.interface';
import { RouterOutlet } from '@angular/router';
import { SubMenuForModulesComponent } from '../../../shared/components/SubmenuForModules/subMenuForModules.component';

@Component({
  selector: 'app-trackings-layout',
  imports: [RouterOutlet, SubMenuForModulesComponent],
  templateUrl: './trackingsLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingsLayoutComponent {


  subMenu: SubMenu[] = [
    {
      name: 'Seguimientos pedidos',
      icon: 'fa-solid fa-users',
      description: '+1',
      route: '/dashboard/seguimientos/seguimientos-pedidos'
    },
    {
      name: 'Seguimientos en Ruta',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      description: '+3',
      route: '/dashboard/seguimientos/seguimientos-en-ruta'
    },
    {
      name: 'Seguimientos en almacen',
      icon: 'fa-solid fa-rectangle-list',
      description: '+1',
      route: '/dashboard/seguimientos/seguimientos-en-almacen'
    }
  ]
}
