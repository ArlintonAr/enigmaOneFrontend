import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./layouts/dashboardLayout/dashboardLayout.component";
import { PricipalPageComponent } from "./pages/pricipalPage/pricipalPage.component";
import { EmployeesLayoutComponent } from "../employees/layouts/employeesLayout/employeesLayout.component";
import { StockLayoutComponent } from "../stock/layouts/stockLayout/stockLayout.component";
import { OrdersLayoutComponent } from "../orders/layouts/ordersLayout/ordersLayout.component";
import { TrackingsLayoutComponent } from "../trackings/layouts/trackingsLayout/trackingsLayout.component";
import { MovementsLayoutComponent } from "../movements/layouts/movementsLayout/movementsLayout.component";



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
        path: 'stock',
        component: StockLayoutComponent
      },
      {
        path: 'movimientos',
        loadChildren: () => import('../movements/movement.routes')
      },
      {
        path: 'ordenes',
        loadChildren: () => import('../orders/orders.routes')
      },
      {
        path: 'seguimientos',
        loadChildren: () => import('../trackings/trackings.routes')
      },
      {
        path: 'reportes',
        loadChildren: () => import('../orders/orders.routes')
      },

      {
        path: '**',
        redirectTo: 'principal'
      }

    ]
  },
];


export default dashboardRoutes;
