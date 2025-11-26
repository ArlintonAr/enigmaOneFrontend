import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./layouts/dashboardLayout/dashboardLayout.component";
import { PricipalPageComponent } from "./pages/pricipalPage/pricipalPage.component";



export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'principal',
        component: PricipalPageComponent
      },
      {
        path: 'empleados',
        loadChildren: () => import('../employees/employees.routes')
      },
      {
        path: 'almacen',
        loadChildren: () => import('../stock/stock.routes')
      },
      {
        path: 'ordenes',
        loadChildren: () => import('../orders/orders.routes')
      },
      {
        path: 'seguimientos',
        loadChildren: () => import('../trackings/trackings.routes')
      },
      /* {
        path: 'reportes',
        loadChildren: () => import('../orders/orders.routes')
      }, */
      {
        path: 'configuracion',
        loadChildren: () => import('../configuration/configuration.routes')
      },

      {
        path: '**',
        redirectTo: 'principal'
      }

    ]
  },
];


export default dashboardRoutes;
