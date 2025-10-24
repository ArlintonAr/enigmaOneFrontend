import { Routes } from "@angular/router";
import { MovementsLayoutComponent } from "./layouts/movementsLayout/movementsLayout.component";
import { MovementExitComponent } from "./pages/movementExit/movementExit.component";
import { MovementEntryComponent } from "./pages/movementEntry/movementEntry.component";
import { MovementReportsComponent } from "./pages/movementReports/movementReports.component";
import { ManagementMovement } from "./pages/managementMovement/managementMovement";


export const movementsRoutes: Routes = [

  {
    path: '',
    component: MovementsLayoutComponent,
    children: [
      {
        path: 'administracion',
        component: ManagementMovement
      },
      {
        path: 'salidas',
        component: MovementExitComponent
      },
      {
        path: 'entradas',
        component: MovementEntryComponent
      },
      {
        path: 'reportes-salidas-entradas',
        component: MovementReportsComponent
      },
      {
        path: '**',
        redirectTo: 'administracion'
      }


    ]
  },

 ]

 export default movementsRoutes;
