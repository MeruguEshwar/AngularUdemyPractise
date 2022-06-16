import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InvoicesService {
  constructor(private http: HttpClient) {}
  getOrganizationDetails() {
    return this.http.get<ApiResponse<any>>(`api/organization/details`);
  }
  getCompanyList(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/list?organizationDetailsId=${organizationDetailsId}`
    );
  }
  getProjectEmployeeList(companyDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/projects/employees/company/get/${companyDetailsId}`
    );
  }
  saveInvoice(invoicesDetails, saveDraft) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/save?saveDraft=${saveDraft}`,
      invoicesDetails
    );
  }
  saveAPInvoice(invoicesDetails, saveDraft) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/ap/save?saveDraft=${saveDraft}`,
      invoicesDetails
    );
  }
  getAllInvoices(params: any) {
    return this.http.get<ApiResponse<any>>(`api/invoice/all`, {
      params: params,
    });
  }
  getARInvoicesAprovalDetails() {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/ar/for/approval/get/all`
    );
  }
  getARInvoicesApprovedDeniedDetails() {
    return this.http.get<ApiResponse<any>>(`api/invoice/ar/approved/get/all`);
  }
  getDeletedARInvoicesDetails() {
    return this.http.get<ApiResponse<any>>(`api/invoice/ar/deleted/all`);
  }
  getDeletedAPInvoicesDetails() {
    return this.http.get<ApiResponse<any>>(`api/invoice/ap/deleted/all`);
  }
  getAllAPInvoices(params: any) {
    return this.http.get<ApiResponse<any>>(`api/invoice/ap/all`, {
      params: params,
    });
  }
  getInvoiceDetails(invoiceDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/details/get/${invoiceDetailsId}`
    );
  }
  deleteInvoiceEntry(invoiceEntryDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/entry/delete/${invoiceEntryDetailsId}`,
      {}
    );
  }
  addPayments(addPayments) {
    return this.http.post<ApiResponse<any>>(`api/payment/save`, addPayments);
  }
  addAPPayments(addPayments) {
    return this.http.post<ApiResponse<any>>(
      `api/payment/debit/save`,
      addPayments
    );
  }
  deleteInvoice(invoiceDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/delete/${invoiceDetailsId}`,
      {}
    );
  }
  undoInvoice(invoiceDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/undo/delete/${invoiceDetailsId}`,
      {}
    );
  }
  deletePermanantlyInvoice(invoiceDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/delete/permanently/${invoiceDetailsId}`,
      {}
    );
  }
  deleteInvoicePayments(paymentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/delete/${paymentDetailsId}`,
      {}
    );
  }
  getPayments(params: any) {
    return this.http.get<ApiResponse<any>>(`api/payment/all`, {
      params: params,
    });
  }
  getAPPayments(params: any) {
    return this.http.get<ApiResponse<any>>(`api/payment/debit/all`, {
      params: params,
    });
  }
  getInvoiceApproverList(companyDetailsId, status) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/approver/company?companyDetailsId=${companyDetailsId}&&status=${status}`
    );
  }
  generateInvoiceNumber() {
    return this.http.get<ApiResponse<any>>(`/api/invoice/number/get`);
  }
  invoiceNumberExist(params) {
    return this.http.get<ApiResponse<any>>(`api/invoice/number/exists`, {
      params: params,
    });
  }
  uploadInvoiceAttachment(params) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/attachment/upload`,
      params
    );
  }
  getInvoiceAttachment(invoiceDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/attachments/${invoiceDetailsId}`
    );
  }
  deleteInvoiceAttachment(invoiceAttachmentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/attachment/delete?invoiceAttachmentDetailsId=${invoiceAttachmentDetailsId}`
    );
  }
  downloadInvoiceAttachment(
    invoiceAttachmentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/invoice/attachment/download?invoiceAttachmentDetailsId=${invoiceAttachmentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  getInvoiceComments(invoiceDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/comments/${invoiceDetailsId}`
    );
  }
  saveInvoiceComment(comment) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/comment/save`,
      comment
    );
  }
  deleteInvoiceComment(invoiceCommentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/comment/delete/${invoiceCommentDetailsId}`,
      {}
    );
  }
  getPaymentAttachment(paymentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payment/attachments/${paymentDetailsId}`
    );
  }
  uploadPaymentAttachment(params) {
    return this.http.post<ApiResponse<any>>(
      `api/payment/attachment/upload`,
      params
    );
  }
  downloadInvoicePDF(invoiceDetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/invoice/as/pdf/download?invoiceDetailsId=${invoiceDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  invoiceStatusUpdate(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/update/status`,
      reqObject
    );
  }
  deleteMultipleInvoices(invoiceDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/delete/multiple?invoiceDetailsIds=${invoiceDetailsIds}`,
      {}
    );
  }
  deletePermanantlyMultipleInvoices(invoiceDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/delete/permanently/multiple?invoiceDetailsIds=${invoiceDetailsIds}`,
      {}
    );
  }
  undoInvoices(invoiceDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/undo/delete/multiple?invoiceDetailsIds=${invoiceDetailsIds}`,
      {}
    );
  }
  sendNotificationInvoices(invoiceDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/invoice/send/notification?invoiceDetailsIds=${invoiceDetailsIds}`,
      {}
    );
  }
}
