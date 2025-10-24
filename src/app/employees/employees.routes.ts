import { Routes } from "@angular/router";
import { ManagementEmployeesComponent } from "./pages/managementEmployees/managementEmployees.component";
import { MyMovementsComponent } from "./pages/myMovements/myMovements.component";
import { MyOrdersComponent } from "./pages/myOrders/myOrders.component";
import { EmployeesLayoutComponent } from "./layouts/employeesLayout/employeesLayout.component";


export const employesRoutes: Routes = [
  {
    path: '',
    component: EmployeesLayoutComponent,
    children: [

      {
        path: 'gestion-empleados',
        component: ManagementEmployeesComponent
      },
      {
        path: 'mis-movimientos',
        component: MyMovementsComponent
      },
      {
        path: 'mis-ordenes',
        component: MyOrdersComponent
      }
      ,
      {
        path: '**',
        redirectTo: 'gestion-empleados'
      }
    ]
  }
]

export default employesRoutes;
