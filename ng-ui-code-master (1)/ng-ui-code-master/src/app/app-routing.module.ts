import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";

import { WelcomeComponent } from "./welcome/welcome.component";
import { PagenotfoundComponent } from "./core/pagenotfound/pagenotfound.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { UserActivationComponent } from "./user-activation/user-activation.component";
import { TimesheetValidationComponent } from "./validations/timesheet-validation/timesheet-validation.component";
import { InvoiceValidationComponent } from "./validations/invoice-validation/invoice-validation.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { TwoFactorAuthComponent } from "./two-factor-auth/two-factor-auth.component";
import { SignatureValidationComponent } from "./validations/signature-validation/signature-validation.component";
import { RegisterComponent } from "./register/register.component";
import { ValidateForgotPasswordComponent } from "./validations/validate-forgot-password/validate-forgot-password.component";
import { PayroleComponent } from "./welcome/payrole/payrole.component";
import { PeopleComponent } from "./welcome/people/people.component";
import { WorkDeskComponent } from "./welcome/work-desk/work-desk.component";
import { SmartHrComponent } from "./welcome/smart-hr/smart-hr.component";
import { ComplianceComponent } from "./welcome/compliance/compliance.component";
import { WorkForceComponent } from "./welcome/work-force/work-force.component";
import { ProductivityComponent } from "./welcome/productivity/productivity.component";
import { TimesheetsComponent } from "./core/custommodules/timesheets/timesheets.component";

const routes: Routes = [
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "authenticate", component: TwoFactorAuthComponent },
  { path: "forgot_password", component: ForgotPasswordComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "people", component: PeopleComponent },
  { path: "work_desk", component: WorkDeskComponent },
  { path: "smart_hr", component: SmartHrComponent },
  { path: "compliance", component: ComplianceComponent },
  { path: "work_force", component: WorkForceComponent },
  { path: "productivity", component: ProductivityComponent },
  { path: "timesheet_Approvers", component: TimesheetsComponent },

  {
    path: "employee/registraton/activation/:id",
    component: UserActivationComponent,
  },
  {
    path: "employee/timesheet/access/:token",
    component: TimesheetValidationComponent,
  },
  {
    path: "invoice/access/:token",
    component: InvoiceValidationComponent,
  },
  {
    path: "employee/signature/verification/:token",
    component: SignatureValidationComponent,
  },
  {
    path: "employee/forgot/password/activation/:token",
    component: ValidateForgotPasswordComponent,
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((module) => module.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: "supremeadmin",
    loadChildren: () =>
      import("./supreme-admin/supreme-admin.module").then(
        (module) => module.SupremeAdminModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user",
    loadChildren: () =>
      import("./employee/employee.module").then(
        (module) => module.EmployeeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "employee",
    loadChildren: () =>
      import("./employee/employee.module").then(
        (module) => module.EmployeeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "hr",
    loadChildren: () =>
      import("./hr/hr.module").then((module) => module.HrModule),
    canActivate: [AuthGuard],
  },
  {
    path: "accounts",
    loadChildren: () =>
      import("./accounts/accounts.module").then(
        (module) => module.AccountsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
