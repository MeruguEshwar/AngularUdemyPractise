import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';





const routes: Routes = [   
    {
        path: 'admin', loadChildren: () => import('../admin/admin.module').then(module => module.AdminModule)
    },
    {
        path: 'user', loadChildren: () => import('../users/users.module').then(module => module.UserModule)
    },
]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }