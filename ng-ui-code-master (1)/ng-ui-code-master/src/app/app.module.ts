import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from 'src/app/core/core.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedServiceModule } from './shared/shared.module';
import { MessageService } from '@app/components/public_api';
import { UserActivationComponent } from './user-activation/user-activation.component';
import { TimesheetValidationComponent } from './validations/timesheet-validation/timesheet-validation.component';
import { InvoiceValidationComponent } from './validations/invoice-validation/invoice-validation.component';
import { UserActionServices } from './shared/userAction.services';
import { ComingsoonPageComponent } from './comingsoon-page/comingsoon-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { SignatureValidationComponent } from './validations/signature-validation/signature-validation.component';
import { RegisterComponent } from './register/register.component';
import { ValidateForgotPasswordComponent } from './validations/validate-forgot-password/validate-forgot-password.component';
import { WelcomeHeaderComponent } from './welcome/welcome-header/welcome-header.component';
import { PayroleComponent } from './welcome/payrole/payrole.component';
import { WelcomeFooterComponent } from './welcome/welcome-footer/welcome-footer.component';
import { InnerBannerComponent } from './welcome/inner-banner/inner-banner.component';
import { InnerMenuComponent } from './welcome/inner-menu/inner-menu.component';
import { InnerSubBannerComponent } from './welcome/inner-sub-banner/inner-sub-banner.component';
import { PeopleComponent } from './welcome/people/people.component';
import { WorkDeskComponent } from './welcome/work-desk/work-desk.component';
import { SmartHrComponent } from './welcome/smart-hr/smart-hr.component';
import { ComplianceComponent } from './welcome/compliance/compliance.component';
import { WorkForceComponent } from './welcome/work-force/work-force.component';
import { View3Component } from './welocme/view3/view3.component';
import { ProductivityComponent } from './welcome/productivity/productivity.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    UserActivationComponent,
    TimesheetValidationComponent,
    InvoiceValidationComponent,
    ComingsoonPageComponent,
    ForgotPasswordComponent,
    TwoFactorAuthComponent,
    SignatureValidationComponent,
    RegisterComponent,
    ValidateForgotPasswordComponent,
    WelcomeHeaderComponent,
    PayroleComponent,
    WelcomeFooterComponent,
    InnerBannerComponent,
    InnerMenuComponent,
    InnerSubBannerComponent,
    PeopleComponent,
    WorkDeskComponent,
    SmartHrComponent,
    ComplianceComponent,
    WorkForceComponent,
    View3Component,
    ProductivityComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedServiceModule,
  ],
  providers: [HttpClient, MessageService, UserActionServices],
  bootstrap: [AppComponent],
})
export class AppModule {}
