import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class TimesheetValidationServices {
  constructor(private http: HttpClient) {}
  validateTimesheetAccessToken(accessToken) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/accesstoken/validate?accessToken=${accessToken}`
    );
  }
  resendTimesheetAuthCode(approverEmail, organizationDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/approver/acode/resend?approverEmail=${approverEmail}&&organizationDetailsId=${organizationDetailsId}`
    );
  }
  validateTimesheetAuthCode(reqObj) {
    return this.http.post<ApiResponse<any>>(
      `api/timesheet/approver/acode/validate`,
      reqObj
    );
  }
  statusUpdate(reqObj) {
    return this.http.post<ApiResponse<any>>(
      `api/timesheet/status/update`,
      reqObj
    );
  }
}
