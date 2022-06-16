import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { LeftbarComponent } from "./leftbar/leftbar.component";
import { RouterModule } from "@angular/router";
import { MyprofileComponent } from "./myprofile/myprofile.component";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { ApiPrefixInterceptor } from "./interceptors/api.prefix.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { SharedServiceModule } from "@app/shared/shared.module";
import { FormsModule } from "@angular/forms";
import { RadioButtonModule } from "@app/components/public_api";
import { ProfileW4Component } from "./myprofile/profile-w4/profile-w4.component";
import { ProfileI9Component } from "./myprofile/profile-i9/profile-i9.component";
import { ProfileProjectDocumentsComponent } from "./myprofile/profile-project-documents/profile-project-documents.component";
import { ProfileDocumentsComponent } from "./myprofile/profile-documents/profile-documents.component";
import { ProfileProjectsComponent } from "./myprofile/profile-projects/profile-projects.component";
import { ProfilePaystubsComponent } from "./myprofile/profile-paystubs/profile-paystubs.component";
import { ProfileTimesheetsComponent } from "./myprofile/profile-timesheets/profile-timesheets.component";
import { ProfileInvoicesComponent } from "./myprofile/profile-invoices/profile-invoices.component";
import { ProfileNotesComponent } from "./myprofile/profile-notes/profile-notes.component";
import { ProfileEVerifyComponent } from "./myprofile/profile-e-verify/profile-e-verify.component";
import { ProfileBankStatutoryComponent } from "./myprofile/profile-bank-statutory/profile-bank-statutory.component";
import { ProfileProfileComponent } from "./myprofile/profile-profile/profile-profile.component";
import { ProfileProfileDetailsComponent } from "./myprofile/profile-profile-details/profile-profile-details.component";
import { NotesComponent } from "./custommodules/notes/notes.component";
import { CompanyComponent } from "./custommodules/company/company.component";
import { AddCompanyComponent } from "./custommodules/company/add-company/add-company.component";
import { ProjectComponent } from "./custommodules/project/project.component";
import { AddProjectComponent } from "./custommodules/project/add-project/add-project.component";
import { CategoryComponent } from "./custommodules/departments-category/category.component";
import { AddCategoryComponent } from "./custommodules/departments-category/add-category/add-category.component";
import { EmployeeinfoComponent } from "./custommodules/employeeinfo/employeeinfo.component";
import { DepartmentsComponent } from "./custommodules/departments/departments.component";
import { DesignationsComponent } from "./custommodules/designations/designations.component";
import { AddEditDesignationComponent } from "./custommodules/designations/add-edit-designation/add-edit-designation.component";
import { AddDepartmentComponent } from "./custommodules/departments/add-department/add-department.component";
import { EditDepartmentComponent } from "./custommodules/departments/edit-department/edit-department.component";
import { AddEmployeeComponent } from "./custommodules/employeeinfo/add-employee/add-employee.component";
import { EditEmployeeComponent } from "./custommodules/employeeinfo/edit-employee/edit-employee.component";
import { ViewProjectComponent } from "./custommodules/project/view-project/view-project.component";
import { EditProjectComponent } from "./custommodules/project/edit-project/edit-project.component";
import { W4Component } from "./custommodules/w4/w4.component";
import { UploadW4DocumentComponent } from "./custommodules/w4/upload-w4-document/upload-w4-document.component";
import { I9Component } from "./custommodules/i9/i9.component";
import { UploadI9DocumentComponent } from "./custommodules/i9/upload-i9-document/upload-i9-document.component";
import { PaystubsComponent } from "./custommodules/paystubs/paystubs.component";
import { AddPaystubComponent } from "./custommodules/paystubs/add-paystub/add-paystub.component";
import { DocumentsComponent } from "./custommodules/documents/documents.component";
import { TimesheetsComponent } from "./custommodules/timesheets/timesheets.component";
import { TimecardComponent } from "./custommodules/timesheets/timecard/timecard.component";
import { ProfileAddPaystubsComponent } from "./myprofile/profile-paystubs/profile-add-paystubs/profile-add-paystubs.component";
import { ProfileTimecardComponent } from "./myprofile/profile-timesheets/profile-timecard/profile-timecard.component";
import { ImageviwerComponent } from "./imageviwer/imageviwer.component";
import { ApproversComponent } from "./custommodules/approvers/approvers.component";
import { AssignApproverComponent } from "./custommodules/project/assign-approver/assign-approver.component";
import { InvoicesComponent } from "./custommodules/invoices/invoices.component";
import { EditInvoiceComponent } from "./custommodules/invoices/edit-invoice/edit-invoice.component";
import { ViewInvoiceComponent } from "./custommodules/invoices/view-invoice/view-invoice.component";
import { MyOrganizationDetailsComponent } from "./my-organization-details/my-organization-details.component";
import { AssignCompanyApproverComponent } from "./custommodules/company/assign-company-approver/assign-company-approver.component";
import { PaymentsComponent } from "./custommodules/payments/payments.component";
import { MyDocumentsComponent } from "./custommodules/my-documents/my-documents.component";
import { DeductionsComponent } from "./custommodules/payhistory/deductions/deductions.component";
import { PayrateComponent } from "./custommodules/payhistory/payrate/payrate.component";
import { ImmigrationsComponent } from "./custommodules/immigrations/immigrations.component";
import { DocumentLinkComponent } from "./custommodules/immigrations/document-link/document-link.component";
import { AdvanceComponent } from "./custommodules/payhistory/advance/advance.component";
import { ExpencesComponent } from "./custommodules/payhistory/expences/expences.component";
import { CompanyviewComponent } from "./custommodules/company/companyview/companyview.component";
import { ViewpaymentsComponent } from "./custommodules/payments/viewpayments/viewpayments.component";
import { ViewTimesheetComponent } from "./custommodules/timesheets/view-timesheet/view-timesheet.component";
import { EditCompanyComponent } from "./custommodules/company/edit-company/edit-company.component";
import { AssignResourceComponent } from "./custommodules/project/assign-resource/assign-resource.component";
import { CompanyPaymentsComponent } from "./custommodules/company/company-payments/company-payments.component";
import { ViewPaystubComponent } from "./custommodules/paystubs/view-paystub/view-paystub.component";
import { ViewAdvanceComponent } from "./custommodules/payhistory/advance/view-advance/view-advance.component";
import { DeductionViewComponent } from "./custommodules/payhistory/deductions/deduction-view/deduction-view.component";
import { ExpenceViewComponent } from "./custommodules/payhistory/expences/expence-view/expence-view.component";
import { PayrateViewComponent } from "./custommodules/payhistory/payrate/payrate-view/payrate-view.component";
import { ProfileEditComponent } from "./myprofile/profile-edit/profile-edit.component";
import { ProfileImmigrationsComponent } from "./myprofile/profile-immigrations/profile-immigrations.component";
import { ProfileViewW4Component } from "./myprofile/profile-w4/profile-view-w4/profile-view-w4.component";
import { ProfileViewI9Component } from "./myprofile/profile-i9/profile-view-i9/profile-view-i9.component";
import { EditChecklistComponent } from "./custommodules/checklist/edit-checklist/edit-checklist.component";
import { AddChecklistComponent } from "./custommodules/checklist/add-checklist/add-checklist.component";
import { ChecklistComponent } from "./custommodules/checklist/checklist.component";
import { OrganizationDocumentsComponent } from "./my-organization-details/organization-documents/organization-documents.component";
import { ProfileSupplierDocumentsComponent } from "./myprofile/profile-supplier-documents/profile-supplier-documents.component";
import { TaggedOrSharedDocumentsComponent } from "./custommodules/project/tagged-or-shared-documents/tagged-or-shared-documents.component";
import { TaggedOrSharedSupplierDocumentsComponent } from "./custommodules/company/tagged-or-shared-supplier-documents/tagged-or-shared-supplier-documents.component";
import { RequestsComponent } from "./custommodules/requests/requests.component";
import { EditRequestComponent } from "./custommodules/requests/edit-request/edit-request.component";
import { DebitComponent } from "./custommodules/payments/debit/debit.component";
import { ViewdebitComponent } from "./custommodules/payments/viewdebit/viewdebit.component";
import { ViewRequestComponent } from "./custommodules/requests/view-request/view-request.component";
import { ApInvoicesComponent } from "./custommodules/invoices/ap-invoices/ap-invoices.component";
import { ApEditInvoiceComponent } from "./custommodules/invoices/ap-edit-invoice/ap-edit-invoice.component";
import { SettingsComponent } from "./settings/settings.component";
import { ApViewInvoiceComponent } from "./custommodules/invoices/ap-view-invoice/ap-view-invoice.component";
import { VerifyI9Component } from "./custommodules/i9/verify-i9/verify-i9.component";
import { W4ViewComponent } from "./custommodules/w4/w4-view/w4-view.component";
import { I9W4SignatureModelComponent } from "./custommodules/i9-w4-signature-model/i9-w4-signature-model.component";
import { DigitalSignatureComponent } from "./myprofile/digital-signature/digital-signature.component";
import { ViewI9Component } from "./custommodules/i9/view-i9/view-i9.component";
import { AddEmployeeTabsComponent } from "./custommodules/employeeinfo/add-employee-tabs/add-employee-tabs.component";
import { BulkuploadDesignationsComponent } from "./bulkupload/bulkupload-designations/bulkupload-designations.component";
import { BulkuploadDepartmentsComponent } from "./bulkupload/bulkupload-departments/bulkupload-departments.component";
import { BulkuploadCustomersComponent } from "./bulkupload/bulkupload-customers/bulkupload-customers.component";
import { ViewFeatureRequestComponent } from "./custommodules/featureRequests/view-feature-request/view-feature-request.component";
import { FeatureRequestsComponent } from "./custommodules/featureRequests/feature-requests/feature-requests.component";
import { EditFeatureRequestComponent } from "./custommodules/featureRequests/edit-feature-request/edit-feature-request.component";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LeftbarComponent,
    MyprofileComponent,
    PagenotfoundComponent,
    ProfileW4Component,
    ProfileI9Component,
    ProfileProjectDocumentsComponent,
    ProfileDocumentsComponent,
    ProfileProjectsComponent,
    ProfilePaystubsComponent,
    ProfileTimesheetsComponent,
    ProfileInvoicesComponent,
    ProfileNotesComponent,
    ProfileEVerifyComponent,
    ProfileBankStatutoryComponent,
    ProfileProfileComponent,
    ProfileProfileDetailsComponent,
    CompanyComponent,
    AddCompanyComponent,
    ProjectComponent,
    AddProjectComponent,
    CategoryComponent,
    AddCategoryComponent,
    EmployeeinfoComponent,
    DepartmentsComponent,
    DesignationsComponent,
    AddEditDesignationComponent,
    AddDepartmentComponent,
    EditDepartmentComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    ViewProjectComponent,
    EditProjectComponent,
    W4Component,
    UploadW4DocumentComponent,
    I9Component,
    UploadI9DocumentComponent,
    PaystubsComponent,
    AddPaystubComponent,
    DocumentsComponent,
    TimesheetsComponent,
    TimecardComponent,
    NotesComponent,
    ProfileAddPaystubsComponent,
    ProfileTimecardComponent,
    ImageviwerComponent,
    ApproversComponent,
    AssignApproverComponent,
    InvoicesComponent,
    EditInvoiceComponent,
    ViewInvoiceComponent,
    MyOrganizationDetailsComponent,
    AssignCompanyApproverComponent,
    PaymentsComponent,
    MyDocumentsComponent,
    DeductionsComponent,
    PayrateComponent,
    ImmigrationsComponent,
    DocumentLinkComponent,
    AdvanceComponent,
    ExpencesComponent,
    CompanyviewComponent,
    ViewpaymentsComponent,
    ViewTimesheetComponent,
    EditCompanyComponent,
    AssignResourceComponent,
    CompanyPaymentsComponent,
    ViewPaystubComponent,
    ViewAdvanceComponent,
    DeductionViewComponent,
    ExpenceViewComponent,
    PayrateViewComponent,
    ProfileEditComponent,
    ProfileImmigrationsComponent,
    ProfileViewW4Component,
    ProfileViewI9Component,
    ChecklistComponent,
    AddChecklistComponent,
    EditChecklistComponent,
    OrganizationDocumentsComponent,
    ProfileSupplierDocumentsComponent,
    TaggedOrSharedDocumentsComponent,
    TaggedOrSharedSupplierDocumentsComponent,
    RequestsComponent,
    EditRequestComponent,
    DebitComponent,
    ViewdebitComponent,
    ViewRequestComponent,
    ApInvoicesComponent,
    ApEditInvoiceComponent,
    SettingsComponent,
    ApViewInvoiceComponent,
    VerifyI9Component,
    W4ViewComponent,
    I9W4SignatureModelComponent,
    DigitalSignatureComponent,
    ViewI9Component,
    AddEmployeeTabsComponent,
    BulkuploadDesignationsComponent,
    BulkuploadDepartmentsComponent,
    BulkuploadCustomersComponent,
    FeatureRequestsComponent,
    ViewFeatureRequestComponent,
    EditFeatureRequestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedServiceModule,
    RadioButtonModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LeftbarComponent,
    SharedServiceModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
  ],
})
export class CoreModule {}
