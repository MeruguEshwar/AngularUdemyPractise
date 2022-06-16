import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OjasMainComponent } from './ojas-main/ojas-main.component';
import {ButtonModule} from 'primeng/button';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';

import { EmployeeModal } from './employee.modal';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrainersComponent } from './trainers/trainers.component';
import { EmployeesComponent } from './employees/employees.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OjasMainComponent,
    DashboardComponent,
    TrainersComponent,
    EmployeesComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    MessagesModule,
    BrowserAnimationsModule,
    RippleModule,
    InputTextModule,
    MessageModule,
    ToastModule,
    FormsModule,
    HttpClientModule,
    EmployeeModal
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
