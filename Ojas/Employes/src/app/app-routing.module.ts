import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OjasMainComponent } from './ojas-main/ojas-main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrainersComponent } from './trainers/trainers.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: OjasMainComponent },
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'Trainers', component: TrainersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
