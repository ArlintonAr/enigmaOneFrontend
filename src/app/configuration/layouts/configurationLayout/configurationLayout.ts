import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubMenuForModulesComponent } from "../../../shared/components/SubmenuForModules/subMenuForModules.component";
import { SubMenu } from '../../../shared/interfaces/subMenu.interface';


@Component({
  selector: 'app-configuration-layout',
  imports: [RouterOutlet, SubMenuForModulesComponent],
  templateUrl: './configurationLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationLayout {



  subMenu: SubMenu[] = [
    {
      name: 'Roles',
      icon: 'fas fa-user-shield',
      description: '+1',
      route: '/dashboard/configuracion/roles'
    },
    {
      name: 'Departamentos',
      icon: 'fas fa-building',
      description: '+2',
      route: '/dashboard/configuracion/departamentos'
    },
    {
      name: 'Almacenes',
      icon: 'fas fa-warehouse',
      description: '+3',
      route: '/dashboard/configuracion/almacenes'
    }

  ]


}
