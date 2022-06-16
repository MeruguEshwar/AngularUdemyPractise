import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class InvoiceValidationServices {
  constructor(private http: HttpClient) {}
  validateInvoiceAccessToken(accessToken) {
    return this.http.get<ApiResponse<any>>(
      `api/invoice/accesstoken/validate?accessToken=${accessToken}`
    );
  }
  resendInvoiceAuthCode(approverEmail, organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/approver/acode/resend?approverEmail=${approverEmail}&&organizationDetailsId=${organizationDetailsId}`
    );
  }
  validateInvoiceAuthCode(reqObj) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/approver/acode/validate`,
      reqObj
    );
  }
  statusUpdate(reqObj) {
    return this.http.post<ApiResponse<any>>(
      `api/invoice/status/update`,
      reqObj
    );
  }
}
