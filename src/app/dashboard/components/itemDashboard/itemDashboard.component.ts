import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';



interface Item {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'item-dashboard',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './itemDashboard.component.html',

})
export class ItemDashboardComponent {

  authService = inject(AuthService);
  router = inject(Router)

  items: Item[] = [
    {
      title: 'Principal',
      description: 'Resumen de datos',
      icon: `fa-solid fa-house`,
      route: '/dashboard/principal'
    },
    {
      title: 'Empleados',
      description: 'Gestion de empleados',
      icon: `fa-solid fa-users`,
      route: '/dashboard/empleados'
    },
    {
      title: 'Almacen',
      description: 'Gestion de productos',
      icon: `fa-solid fa-cubes`,
      route: '/dashboard/almacen'
    },

    {
      title: 'Ordenes',
      description: 'Ordena pedidos',
      icon: `fa-solid fa-rectangle-list`,
      route: '/dashboard/ordenes'
    },
    {
      title: 'Seguimientos',
      description: 'Seguimiento de pedidos',
      icon: `fa-solid fa-plane-departure`,
      route: '/dashboard/seguimientos'
    },
    {
      title: 'Configuración',
      description: 'Configuración de la aplicación',
      icon: `fa-solid fa-gear`,
      route: '/dashboard/configuracion'
    },
    /*   
      {
        title: 'Reportes',
        description: 'Seguimiento de pedidos',
        icon: `fa-solid fa-print`,
        route: '/dashboard/reportes'
      }
   */

  ];



  logout() {
    this.authService.logout();
    //window.location.reload();
    this.router.navigateByUrl('/inicio');
  }


}
