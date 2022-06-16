import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";
import { MyprofileComponent } from "@app/core/myprofile/myprofile.component";
import { NotesComponent } from "@app/core/custommodules/notes/notes.component";
import { TimesheetsComponent } from "@app/core/custommodules/timesheets/timesheets.component";
import { W4Component } from "@app/core/custommodules/w4/w4.component";
import { I9Component } from "@app/core/custommodules/i9/i9.component";
import { ImmigrationsComponent } from "@app/core/custommodules/immigrations/immigrations.component";
import { DocumentsComponent } from "@app/core/custommodules/documents/documents.component";
import { ProfileDocumentsComponent } from "@app/core/myprofile/profile-documents/profile-documents.component";
import { ProfileProjectDocumentsComponent } from "@app/core/myprofile/profile-project-documents/profile-project-documents.component";
import { AdvanceComponent } from "@app/core/custommodules/payhistory/advance/advance.component";
import { ViewAdvanceComponent } from "@app/core/custommodules/payhistory/advance/view-advance/view-advance.component";
import { DeductionViewComponent } from "@app/core/custommodules/payhistory/deductions/deduction-view/deduction-view.component";
import { DeductionsComponent } from "@app/core/custommodules/payhistory/deductions/deductions.component";
import { PayrateViewComponent } from "@app/core/custommodules/payhistory/payrate/payrate-view/payrate-view.component";
import { PayrateComponent } from "@app/core/custommodules/payhistory/payrate/payrate.component";
import { PaystubsComponent } from "@app/core/custommodules/paystubs/paystubs.component";
import { ProfileSupplierDocumentsComponent } from "@app/core/myprofile/profile-supplier-documents/profile-supplier-documents.component";
import { RequestsComponent } from "@app/core/custommodules/requests/requests.component";
import { ViewRequestComponent } from "@app/core/custommodules/requests/view-request/view-request.component";
import { ComingsoonPageComponent } from "@app/comingsoon-page/comingsoon-page.component";
import { ProfileProjectsComponent } from "@app/core/myprofile/profile-projects/profile-projects.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: EmployeeDashboardComponent },
  {
    path: "myprofile",
    component: MyprofileComponent,
  },
  { path: "timesheets", component: TimesheetsComponent },
  { path: "w4", component: W4Component },
  { path: "i9", component: I9Component },

  { path: "notes", component: NotesComponent },
  { path: "requests", component: RequestsComponent },
  { path: "requests/request/view", component: ViewRequestComponent },
  { path: "immigrations", component: ComingsoonPageComponent },
  { path: "documents", component: ProfileDocumentsComponent },
  { path: "projectDocuments", component: ProfileProjectDocumentsComponent },
  { path: "project", component: ProfileProjectsComponent },
  { path: "supplierDocuments", component: ProfileSupplierDocumentsComponent },
  { path: "deductions", component: DeductionsComponent },
  { path: "deductions/deduction/view", component: DeductionViewComponent },
  { path: "payrate", component: PayrateComponent },
  { path: "payrate/view", component: PayrateViewComponent },
  { path: "advances", component: AdvanceComponent },
  { path: "advances/advance/view", component: ViewAdvanceComponent },
  { path: "paystub", component: PaystubsComponent },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
