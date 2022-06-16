import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  addPayments(addPayments) {
    return this.http.post<ApiResponse<any>>(`api/payment/save`, addPayments);
  }
  addDebits(addPayments) {
    return this.http.post<ApiResponse<any>>(
      `api/payment/debit/save`,
      addPayments
    );
  }
  getPayments(params: any) {
    return this.http.get<ApiResponse<any>>(`api/payment/all`, {
      params: params,
    });
  }
  getDeletedCreditPayments() {
    return this.http.get<ApiResponse<any>>(
      `api/payment/deleted/credit/all`,
      {}
    );
  }
  getDeletedDebitPayments() {
    return this.http.get<ApiResponse<any>>(`api/payment/deleted/debit/all`, {});
  }
  deleteInvoicePayment(paymentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/delete/${paymentDetailsId}`,
      {}
    );
  }
  deleteInvoicePaymentPermanently(paymentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/delete/permanently/${paymentDetailsId}`,
      {}
    );
  }
  deleteInvoicePayments(paymentDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/delete/multiple?paymentDetailsIds=${paymentDetailsIds}`,
      {}
    );
  }
  deleteInvoicePaymentsPermanently(paymentDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/delete/permanently/multiple?paymentDetailsIds=${paymentDetailsIds}`,
      {}
    );
  }
  undoPayments(paymentDetailsIds) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/undo/delete/multiple?paymentDetailsIds=${paymentDetailsIds}`,
      {}
    );
  }
  undoPayment(paymentDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/payment/undo/delete/${paymentDetailsId}`,
      {}
    );
  }
  getDebits(params: any) {
    return this.http.get<ApiResponse<any>>(`api/payment/debit/all`, {
      params: params,
    });
  }
  getPaymentDetail(paymentDetailsId: any) {
    return this.http.get<ApiResponse<any>>(
      `api/payment/details/${paymentDetailsId}`
    );
  }
  uploadPaymentAttachment(params) {
    return this.http.post<ApiResponse<any>>(
      `api/payment/attachment/upload`,
      params
    );
  }
  deletePaymentAttachment(paymentAttachmentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/payment/attachment/delete?paymentAttachmentDetailsId=${paymentAttachmentDetailsId}`
    );
  }
  getPaymentAttachment(paymentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/payment/attachments/${paymentDetailsId}`
    );
  }
  getCompanyList(organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/company/list?organizationDetailsId=${organizationDetailsId}`
    );
  }
  invoiceNumberExist(invoiceNumber) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/number/exists?invoiceNumber=${invoiceNumber}`
    );
  }
  generateInvoiceNumber() {
    return this.http.get<ApiResponse<any>>(`/api/invoice/number/get`);
  }
}
