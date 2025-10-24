import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layouts/authLayout/authLayout.component";
import { LoginPageComponent } from "./pages/loginPage/loginPage.component";
import { RegisterPageComponent } from "./pages/registerPage/registerPage.component";



export const authRouts: Routes = [

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'acceder',
        component: LoginPageComponent
      },
      {
        path: 'registrar',
        component: RegisterPageComponent
      },
      {
        path: '**',
        redirectTo: 'acceder'
      }
    ]
  },
  {

    path: '**',
    redirectTo: ''

  }
]

export default authRouts;
