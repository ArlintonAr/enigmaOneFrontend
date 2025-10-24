import { Routes } from "@angular/router";
import { OrdersLayoutComponent } from "./layouts/ordersLayout/ordersLayout.component";
import { OrdersComponent } from "./pages/orders/orders.component";
import { AuthorizationOrdersComponent } from "./pages/authorizationOrders/authorizationOrders.component";
import { StateOrdersComponent } from "./pages/stateOrders/stateOrders.component";
import { ModifyTrackingsComponent } from "./pages/modifyTrackings/modifyTrackings.component";




export const ordersRoutes:Routes = [

  {
    path:'',
    component:OrdersLayoutComponent,
    children:[
      {
        path:'pedidos',
        component: OrdersComponent
      },
      {
        path:'autorizacion-de-pedidos',
        component:AuthorizationOrdersComponent
      },
      {
        path:'estado-de-pedidos',
        component:StateOrdersComponent
      },

      {
        path:'**',
        redirectTo:'pedidos'
      }

    ]
  }

]

export default ordersRoutes;
