import { Routes } from '@angular/router';
import { MovementsLayoutComponent } from '../movements/layouts/movementsLayout/movementsLayout.component';
import { StockLayoutComponent } from './layouts/stockLayout/stockLayout.component';
import { StockManagement } from './pages/stockManagement/stockManagement';
import { ManagementMovement } from '../movements/pages/managementMovement/managementMovement';
import { MovementExitComponent } from '../movements/pages/movementExit/movementExit.component';
import { MovementEntryComponent } from '../movements/pages/movementEntry/movementEntry.component';
import { MovementReportsComponent } from '../movements/pages/movementReports/movementReports.component';

export const stockRoutes: Routes = [
  {
    path: '',
    component: StockLayoutComponent,
    children: [
      {
        path: 'stock',
        component: StockManagement,
      },
      {
        path: 'movimientos',
        component: MovementsLayoutComponent,
        children: [
          {
            path: 'administracion',
            component: ManagementMovement,
          },
          {
            path: 'salidas',
            component: MovementExitComponent,
          },
          {
            path: 'entradas',
            component: MovementEntryComponent,
          },
          {
            path: '**',
            redirectTo: 'administracion',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'stock',
      },
    ],
  },
];

export default stockRoutes;
