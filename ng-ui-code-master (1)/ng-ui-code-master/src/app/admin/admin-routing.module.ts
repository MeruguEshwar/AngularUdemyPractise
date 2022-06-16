import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "src/app/admin/admin-dashboard/admin-dashboard.component";
import { MyprofileComponent } from "@app/core/myprofile/myprofile.component";
import { NotesComponent } from "@app/core/custommodules/notes/notes.component";
import { EmployeeinfoComponent } from "@app/core/custommodules/employeeinfo/employeeinfo.component";
import { DepartmentsComponent } from "@app/core/custommodules/departments/departments.component";
import { DesignationsComponent } from "@app/core/custommodules/designations/designations.component";
import { CompanyComponent } from "@app/core/custommodules/company/company.component";
import { ProjectComponent } from "@app/core/custommodules/project/project.component";
import { DocumentsComponent } from "@app/core/custommodules/documents/documents.component";
import { CategoryComponent } from "@app/core/custommodules/departments-category/category.component";
import { PaystubsComponent } from "@app/core/custommodules/paystubs/paystubs.component";
import { TimesheetsComponent } from "@app/core/custommodules/timesheets/timesheets.component";
import { ApproversComponent } from "@app/core/custommodules/approvers/approvers.component";
import { InvoicesComponent } from "@app/core/custommodules/invoices/invoices.component";
import { EditInvoiceComponent } from "@app/core/custommodules/invoices/edit-invoice/edit-invoice.component";
import { ViewInvoiceComponent } from "@app/core/custommodules/invoices/view-invoice/view-invoice.component";
import { MyOrganizationDetailsComponent } from "@app/core/my-organization-details/my-organization-details.component";
import { PaymentsComponent } from "@app/core/custommodules/payments/payments.component";
import { MyDocumentsComponent } from "@app/core/custommodules/my-documents/my-documents.component";
import { DeductionsComponent } from "@app/core/custommodules/payhistory/deductions/deductions.component";
import { PayrateComponent } from "@app/core/custommodules/payhistory/payrate/payrate.component";
import { ImmigrationsComponent } from "@app/core/custommodules/immigrations/immigrations.component";
import { AdvanceComponent } from "@app/core/custommodules/payhistory/advance/advance.component";
import { ExpencesComponent } from "@app/core/custommodules/payhistory/expences/expences.component";
import { CompanyviewComponent } from "@app/core/custommodules/company/companyview/companyview.component";
import { ViewpaymentsComponent } from "@app/core/custommodules/payments/viewpayments/viewpayments.component";
import { UnsavedChangesGuard } from "@app/core/guards/unsaved-changes.guard";
import { ViewTimesheetComponent } from "@app/core/custommodules/timesheets/view-timesheet/view-timesheet.component";
import { EditCompanyComponent } from "@app/core/custommodules/company/edit-company/edit-company.component";
import { ViewProjectComponent } from "@app/core/custommodules/project/view-project/view-project.component";
import { EditProjectComponent } from "@app/core/custommodules/project/edit-project/edit-project.component";
import { ViewAdvanceComponent } from "@app/core/custommodules/payhistory/advance/view-advance/view-advance.component";
import { ExpenceViewComponent } from "@app/core/custommodules/payhistory/expences/expence-view/expence-view.component";
import { PayrateViewComponent } from "@app/core/custommodules/payhistory/payrate/payrate-view/payrate-view.component";
import { DeductionViewComponent } from "@app/core/custommodules/payhistory/deductions/deduction-view/deduction-view.component";
import { ComingsoonPageComponent } from "@app/comingsoon-page/comingsoon-page.component";
import { ProfileW4Component } from "@app/core/myprofile/profile-w4/profile-w4.component";
import { ProfileViewW4Component } from "@app/core/myprofile/profile-w4/profile-view-w4/profile-view-w4.component";
import { ProfileI9Component } from "@app/core/myprofile/profile-i9/profile-i9.component";
import { ProfileViewI9Component } from "@app/core/myprofile/profile-i9/profile-view-i9/profile-view-i9.component";
import { ChecklistComponent } from "@app/core/custommodules/checklist/checklist.component";
import { RequestsComponent } from "@app/core/custommodules/requests/requests.component";
import { DebitComponent } from "@app/core/custommodules/payments/debit/debit.component";
import { ViewdebitComponent } from "@app/core/custommodules/payments/viewdebit/viewdebit.component";
import { ViewRequestComponent } from "@app/core/custommodules/requests/view-request/view-request.component";
import { ApInvoicesComponent } from "@app/core/custommodules/invoices/ap-invoices/ap-invoices.component";
import { ApEditInvoiceComponent } from "@app/core/custommodules/invoices/ap-edit-invoice/ap-edit-invoice.component";
import { SettingsComponent } from "@app/core/settings/settings.component";
import { ApViewInvoiceComponent } from "@app/core/custommodules/invoices/ap-view-invoice/ap-view-invoice.component";
import { BulkuploadDepartmentsComponent } from "@app/core/bulkupload/bulkupload-departments/bulkupload-departments.component";
import { BulkuploadDesignationsComponent } from "@app/core/bulkupload/bulkupload-designations/bulkupload-designations.component";
import { BulkuploadCustomersComponent } from "@app/core/bulkupload/bulkupload-customers/bulkupload-customers.component";
import { ViewFeatureRequestComponent } from "@app/core/custommodules/featureRequests/view-feature-request/view-feature-request.component";
import { FeatureRequestsComponent } from "@app/core/custommodules/featureRequests/feature-requests/feature-requests.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AdminDashboardComponent },
  { path: "organizationDetails", component: MyOrganizationDetailsComponent },
  { path: "configurations", component: SettingsComponent },
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
  { path: "w4", component: ProfileW4Component },
  { path: "i9", component: ProfileI9Component },
  { path: "paystubs", component: PaystubsComponent },
  { path: "timesheets", component: TimesheetsComponent },
  { path: "timesheets/timesheet/view", component: ViewTimesheetComponent },
  { path: "notes", component: NotesComponent },
  { path: "requests", component: RequestsComponent },
  { path: "requests/request/view", component: ViewRequestComponent },
  { path: "feature_requests", component: FeatureRequestsComponent },
  {
    path: "feature_requests/request/view",
    component: ViewFeatureRequestComponent,
  },
  { path: "invoices", component: InvoicesComponent },
  {
    path: "invoices/invoice",
    component: EditInvoiceComponent,
    canDeactivate: [UnsavedChangesGuard],
  },
  { path: "invoices/invoice/view", component: ViewInvoiceComponent },
  { path: "ap_invoices", component: ApInvoicesComponent },
  {
    path: "ap_invoices/ap_invoice",
    component: ApEditInvoiceComponent,
    canDeactivate: [UnsavedChangesGuard],
  },
  { path: "ap_invoices/ap_invoice/view", component: ApViewInvoiceComponent },
  { path: "ap_invoices", component: ComingsoonPageComponent },
  {
    path: "ap_invoices/ap_invoice",
    component: ComingsoonPageComponent,
    canDeactivate: [UnsavedChangesGuard],
  },
  { path: "ap_invoices/ap_invoice/view", component: ComingsoonPageComponent },
  { path: "payments", component: PaymentsComponent },
  { path: "payments/payment/view", component: ViewpaymentsComponent },
  { path: "debit", component: DebitComponent },
  { path: "debit/view", component: ViewdebitComponent },
  { path: "my_documents", component: MyDocumentsComponent },
  { path: "deductions", component: DeductionsComponent },
  { path: "deductions/deduction/view", component: DeductionViewComponent },
  { path: "payrate", component: PayrateComponent },
  { path: "payrate/view", component: PayrateViewComponent },
  { path: "advances", component: AdvanceComponent },
  { path: "advances/advance/view", component: ViewAdvanceComponent },
  { path: "expenses", component: ExpencesComponent },
  { path: "expenses/expence/view", component: ExpenceViewComponent },
  { path: "immigrations", component: ComingsoonPageComponent },
  { path: "timeline", component: ComingsoonPageComponent },
  { path: "ap_invoices", component: ComingsoonPageComponent },
  { path: "payment_reports", component: ComingsoonPageComponent },
  { path: "invoice_Reports", component: ComingsoonPageComponent },
  { path: "employee_reports", component: ComingsoonPageComponent },
  { path: "employee_timeline", component: ComingsoonPageComponent },
  { path: "prospect_supplier", component: ComingsoonPageComponent },
  { path: "prospect_employee", component: ComingsoonPageComponent },
  { path: "Prospect_position", component: ComingsoonPageComponent },
  { path: "checklist", component: ChecklistComponent },
  { path: "bulkupload/departments", component: BulkuploadDepartmentsComponent },
  {
    path: "bulkupload/designations",
    component: BulkuploadDesignationsComponent,
  },
  { path: "bulkupload/customers", component: BulkuploadCustomersComponent },
  { path: "w4/:id/W4Details", component: ProfileViewW4Component },
  { path: "i9/:id/I9Details", component: ProfileViewI9Component },

  {
    path: "employees/:id/profile",
    component: MyprofileComponent,
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
