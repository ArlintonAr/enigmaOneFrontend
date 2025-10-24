import { Routes } from '@angular/router';

export const routes: Routes = [


    {
      path:'inicio',
      loadComponent:()=>import('./nuevoSanJose-front/layouts/initial-layout/initial-layout.component'),

    },
    {
      path:'autenticacion',
      loadChildren:()=>import('./auth/auth.routes')
    },
    {
      path:'dashboard',
      loadChildren:()=>import('./dashboard/dashboard.routes')
    },
    {
      path:'**',
      redirectTo:'inicio'
    },


];


