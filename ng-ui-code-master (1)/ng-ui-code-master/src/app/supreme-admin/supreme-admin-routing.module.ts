import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrganizationComponent } from "./organization/organization.component";
import { FreeemaildomainComponent } from "./freeemaildomain/freeemaildomain.component";
import { AdminDashboardComponent } from "@app/admin/admin-dashboard/admin-dashboard.component";
import { ComingsoonPageComponent } from "@app/comingsoon-page/comingsoon-page.component";
import { ApproversComponent } from "@app/core/custommodules/approvers/approvers.component";
import { CompanyComponent } from "@app/core/custommodules/company/company.component";
import { CompanyviewComponent } from "@app/core/custommodules/company/companyview/companyview.component";
import { EditCompanyComponent } from "@app/core/custommodules/company/edit-company/edit-company.component";
import { CategoryComponent } from "@app/core/custommodules/departments-category/category.component";
import { DepartmentsComponent } from "@app/core/custommodules/departments/departments.component";
import { DesignationsComponent } from "@app/core/custommodules/designations/designations.component";
import { DocumentsComponent } from "@app/core/custommodules/documents/documents.component";
import { EmployeeinfoComponent } from "@app/core/custommodules/employeeinfo/employeeinfo.component";
import { I9Component } from "@app/core/custommodules/i9/i9.component";
import { ImmigrationsComponent } from "@app/core/custommodules/immigrations/immigrations.component";
import { EditInvoiceComponent } from "@app/core/custommodules/invoices/edit-invoice/edit-invoice.component";
import { InvoicesComponent } from "@app/core/custommodules/invoices/invoices.component";
import { ViewInvoiceComponent } from "@app/core/custommodules/invoices/view-invoice/view-invoice.component";
import { MyDocumentsComponent } from "@app/core/custommodules/my-documents/my-documents.component";
import { NotesComponent } from "@app/core/custommodules/notes/notes.component";
import { AdvanceComponent } from "@app/core/custommodules/payhistory/advance/advance.component";
import { ViewAdvanceComponent } from "@app/core/custommodules/payhistory/advance/view-advance/view-advance.component";
import { DeductionViewComponent } from "@app/core/custommodules/payhistory/deductions/deduction-view/deduction-view.component";
import { DeductionsComponent } from "@app/core/custommodules/payhistory/deductions/deductions.component";
import { ExpenceViewComponent } from "@app/core/custommodules/payhistory/expences/expence-view/expence-view.component";
import { ExpencesComponent } from "@app/core/custommodules/payhistory/expences/expences.component";
import { PayrateViewComponent } from "@app/core/custommodules/payhistory/payrate/payrate-view/payrate-view.component";
import { PayrateComponent } from "@app/core/custommodules/payhistory/payrate/payrate.component";
import { PaymentsComponent } from "@app/core/custommodules/payments/payments.component";
import { ViewpaymentsComponent } from "@app/core/custommodules/payments/viewpayments/viewpayments.component";
import { PaystubsComponent } from "@app/core/custommodules/paystubs/paystubs.component";
import { EditProjectComponent } from "@app/core/custommodules/project/edit-project/edit-project.component";
import { ProjectComponent } from "@app/core/custommodules/project/project.component";
import { ViewProjectComponent } from "@app/core/custommodules/project/view-project/view-project.component";
import { TimesheetsComponent } from "@app/core/custommodules/timesheets/timesheets.component";
import { ViewTimesheetComponent } from "@app/core/custommodules/timesheets/view-timesheet/view-timesheet.component";
import { W4Component } from "@app/core/custommodules/w4/w4.component";
import { UnsavedChangesGuard } from "@app/core/guards/unsaved-changes.guard";
import { MyOrganizationDetailsComponent } from "@app/core/my-organization-details/my-organization-details.component";
import { MyprofileComponent } from "@app/core/myprofile/myprofile.component";
import { FeatureRequestsComponent } from "@app/core/custommodules/featureRequests/feature-requests/feature-requests.component";
import { ViewFeatureRequestComponent } from "@app/core/custommodules/featureRequests/view-feature-request/view-feature-request.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AdminDashboardComponent },
  { path: "organizationDetails", component: MyOrganizationDetailsComponent },
  { path: "employees", component: EmployeeinfoComponent },
  { path: "departments", component: DepartmentsComponent },
  { path: "designations", component: DesignationsComponent },
  {
    path: "myprofile",
    component: MyprofileComponent,
  },
  {
    path: "company",
    component: CompanyComponent,
  },
  {
    path: "company/view",
    component: CompanyviewComponent,
  },
  {
    path: "company/edit",
    component: EditCompanyComponent,
  },
  {
    path: "projects",
    component: ProjectComponent,
  },
  {
    path: "projects/project/view",
    component: ViewProjectComponent,
  },
  {
    path: "projects/project/edit",
    component: EditProjectComponent,
  },
  {
    path: "documents",
    component: DocumentsComponent,
  },
  { path: "approvers", component: ApproversComponent },
  {
    path: "category",
    component: CategoryComponent,
  },
  { path: "w4", component: W4Component },
  { path: "i9", component: I9Component },
  { path: "paystubs", component: PaystubsComponent },
  { path: "timesheets", component: TimesheetsComponent },
  { path: "timesheets/timesheet/view", component: ViewTimesheetComponent },
  { path: "notes", component: NotesComponent },
  { path: "invoices", component: InvoicesComponent },
  {
    path: "invoices/invoice",
    component: EditInvoiceComponent,
    canDeactivate: [UnsavedChangesGuard],
  },
  { path: "invoices/invoice/view", component: ViewInvoiceComponent },
  { path: "payments", component: PaymentsComponent },
  { path: "payments/payment/view", component: ViewpaymentsComponent },
  { path: "my_documents", component: MyDocumentsComponent },
  { path: "deductions", component: DeductionsComponent },
  { path: "deductions/deduction/view", component: DeductionViewComponent },
  { path: "payrate", component: PayrateComponent },
  { path: "payrate/view", component: PayrateViewComponent },
  { path: "advances", component: AdvanceComponent },
  { path: "advances/advance/view", component: ViewAdvanceComponent },
  { path: "expenses", component: ExpencesComponent },
  { path: "expenses/expence/view", component: ExpenceViewComponent },
  { path: "immigrations", component: ImmigrationsComponent },
  { path: "timeline", component: ComingsoonPageComponent },
  { path: "debit", component: ComingsoonPageComponent },
  { path: "ap_invoices", component: ComingsoonPageComponent },
  { path: "payment_reports", component: ComingsoonPageComponent },
  { path: "invoice_Reports", component: ComingsoonPageComponent },
  { path: "employee_reports", component: ComingsoonPageComponent },
  { path: "employee_timeline", component: ComingsoonPageComponent },
  { path: "prospect_supplier", component: ComingsoonPageComponent },
  { path: "prospect_employee", component: ComingsoonPageComponent },
  { path: "Prospect_position", component: ComingsoonPageComponent },
  { path: "organization", component: OrganizationComponent },
  { path: "freeemaildomain", component: FreeemaildomainComponent },
  { path: "feature_requests", component: FeatureRequestsComponent },
  {
    path: "feature_requests/request/view",
    component: ViewFeatureRequestComponent,
  },
  {
    path: "employees/:id/profile",
    component: MyprofileComponent,
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupremeAdminRoutingModule {}
