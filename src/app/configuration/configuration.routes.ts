import { Routes } from "@angular/router"
import { ConfigurationLayout } from "./layouts/configurationLayout/configurationLayout"
import { Positions } from "./pages/positions/positions"
import { Departments } from "./pages/departments/departments"
import { Warehouses } from "./pages/warehouses/warehouses"





export const configurationRoutes: Routes = [
    {
        path: '',
        component: ConfigurationLayout,
        children: [
            {
                path: 'roles',
                component: Positions
            },
            {
                path: 'departamentos',
                component: Departments
            },
            {
                path: 'almacenes',
                component: Warehouses
            },
            {
                path: '**',
                redirectTo: 'roles'
            }
        ]
    }
]


export default configurationRoutes
