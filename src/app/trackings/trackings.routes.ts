import { Routes } from "@angular/router";
import { TrackingsLayoutComponent } from "./layouts/trackingsLayout/trackingsLayout.component";
import { TrackingsInRoute } from "./pages/trackingsInRoute/trackingsInRoute";
import { TrackingsInStock } from "./pages/trackingsInStock/trackingsInStock";
import { TrackingInRequiredState } from "./pages/trackingInRequiredState/trackingInRequiredState";



export const trackingsRoutes: Routes = [

{
    path:'',
    component:TrackingsLayoutComponent,
    children:[
      {
        path:'seguimientos-pedidos',
        component: TrackingInRequiredState
      },
      {
        path:'seguimientos-en-ruta',
        component:TrackingsInRoute
      },
      {
        path:'seguimientos-en-almacen',
        component:TrackingsInStock
      },

      {
        path:'**',
        redirectTo:'seguimientos-pedidos'
      }

    ]
  }
]

export default trackingsRoutes;
