import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Department } from "@app/shared/models/department.model";
import { Company } from "@app/shared/models/company-module.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  constructor(private http: HttpClient) {}
  getAllCompanies(status: number) {
    return this.http.get<ApiResponse<Company>>(
      `api/company/all?status=${status}`
    );
  }
  getCompanieDetails(companyDetailsId) {
    return this.http.get<ApiResponse<Company>>(
      `api/company/${companyDetailsId}`
    );
  }
  getDepartment(departmentDetailsId: string) {
    return this.http.get<ApiResponse<Department>>(
      `api/department/${departmentDetailsId}`
    );
  }
  addCompany(company: any) {
    return this.http.post<ApiResponse<Company>>(`api/company/add`, company);
  }
  updateCompany(company: Company) {
    return this.http.post<ApiResponse<Company>>("api/company/update", company);
  }
  activateCompany(companyDetailsId: number) {
    return this.http.put<ApiResponse<Company>>(
      `api/company/activate/${companyDetailsId}`,
      {}
    );
  }
  deactivateCompany(companyDetailsId: number) {
    return this.http.put<ApiResponse<Company>>(
      `api/company/deactivate/${companyDetailsId}`,
      {}
    );
  }
  isCompanyExists(companyName: string) {
    return this.http.get<ApiResponse<Company>>(
      `api/company/exists?companyName=${companyName}`
    );
  }
  getAllApprovers(status, invoiceApprover) {
    return this.http.get<ApiResponse<any>>(
      `api/approver/all?status=${status}&&invoiceApprover=${invoiceApprover}`
    );
  }
  getcompanyInvoicesApprover(status, companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/approver/company?status=${status}&&companyDetailsId=${companyDetailsId}`
    );
  }
  assignCompanyInvoiceApprovers(formData) {
    return this.http.post<ApiResponse<any>>(
      "api/invoice/approver/company/assign",
      formData
    );
  }
  unasignCompanyInvoiceApprovers(companyInvoiceApproverDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/approver/company/unassign/${companyInvoiceApproverDetailsId}`,
      {}
    );
  }
  getCompanyInvoices(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/all?companyDetailsId=${companyDetailsId}`
    );
  }
  getCompanyDocuments(employeeDetailsId, companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/documents/get?employeeDetailsId=${employeeDetailsId}&&companyDetailsId=${companyDetailsId}`
    );
  }
  getCompanyAndTaggedDocuments(employeeDetailsId, companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/documents/all/get?employeeDetailsId=${employeeDetailsId}&&companyDetailsId=${companyDetailsId}`
    );
  }
  downloadCompanyDocument(
    companyDocumentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/company/document/download?companyDocumentDetailsId=${companyDocumentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  getPayments(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/payment/all?companyDetailsId=${companyDetailsId}`
    );
  }
  getEmployeesWorked(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/employees/worked/${companyDetailsId}`
    );
  }
  getSupplierContactDetails(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/contacts/${companyDetailsId}`
    );
  }
  downloadProjectDocument(
    projectDocumentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/project/document/download?projectDocumentDetailsId=${projectDocumentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  UploadCompanytDocument(formData: FormData) {
    return this.http.post<ApiResponse<any>>(
      `api/company/document/upload`,
      formData
    );
  }
  UpdateCompanytDocument(formData: FormData) {
    return this.http.post<ApiResponse<any>>(
      `api/company/document/upload/update`,
      formData
    );
  }
  addCompanyPayments(addPayments) {
    return this.http.post<ApiResponse<any>>(`api/payment/save`, addPayments);
  }
  deleteCompanyPaymentAttachment(paymentAttachmentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/payment/attachment/delete?paymentAttachmentDetailsId=${paymentAttachmentDetailsId}`
    );
  }
  getPaymentAttachment(paymentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payment/attachments/${paymentDetailsId}`
    );
  }
  deletePayments(paymentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/delete/${paymentDetailsId}`,
      {}
    );
  }
  uploadPaymentAttachment(params) {
    return this.http.post<ApiResponse<any>>(
      `api/payment/attachment/upload`,
      params
    );
  }
  getCompanyComments(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/comments/${companyDetailsId}`
    );
  }
  saveCompanyComment(comment) {
    return this.http.post<ApiResponse<any>>(
      `api/company/comment/save`,
      comment
    );
  }
  deleteCompanyComment(companyCommentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/company/comment/delete/${companyCommentDetailsId}`,
      {}
    );
  }
  saveCompanyContacts(contactDetails) {
    return this.http.post<ApiResponse<any>>(
      `api/company/contact/save`,
      contactDetails
    );
  }
  getProjectOfSupplier(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/projects/${companyDetailsId}`
    );
  }
  getEmployeesOfSupplier(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/employees/worked/${companyDetailsId}`
    );
  }
  getTaggedDocuments(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/tagged/documents/${companyDetailsId}`
    );
  }
  getTaggedWithSupplierDoc(companyDocumentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/document/tagged/with/details/${companyDocumentDetailsId}`
    );
  }
  getTaggedWithProjectDoc(projectDocumentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/document/tagged/with/details/${projectDocumentDetailsId}`
    );
  }

  getCompanyProjects(companyDetailsId: number) {
    return this.http.get<ApiResponse<any>>(
      `/api/company/projects/${companyDetailsId}`
    );
  }
  getEmployeesOfSupplierBySupplier(projectCodes) {
    return this.http.get<ApiResponse<any>>(
      `api/project/assigned/resources?projectCodes=${projectCodes}`
    );
  }
  deleteCompanyDocument(companyDocumentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/document/delete/${companyDocumentDetailsId}`
    );
  }
}
