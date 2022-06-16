import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class ApproversService {
  constructor(private http: HttpClient) {}
  getAuthCode() {
    return this.http.get<ApiResponse<any>>(`api/approver/acode`);
  }

  getAllApprovers(param: any) {
    return this.http.get<ApiResponse<any>>(`api/approver/all`, {
      params: param,
    });
  }
  saveApprover(approverObj) {
    return this.http.post<ApiResponse<any>>(`api/approver/save`, approverObj);
  }
  updateApproverAuthorization(approverDetailsId, authorization) {
    return this.http.put<ApiResponse<any>>(
      `/api/approver/authorization/update/${approverDetailsId}?authorization=${authorization}`,
      {}
    );
  }
  updateApproverGroup(approverDetailsId, group) {
    return this.http.put<ApiResponse<any>>(
      `/api/approver/group/update/${approverDetailsId}?group=${group}`,
      {}
    );
  }

  activateApprover(approverDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/approver/activate/${approverDetailsId}`,
      {}
    );
  }
  deactivateApprover(approverDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/approver/deactivate/${approverDetailsId}`,
      {}
    );
  }
  verifyApproverAssignments(type, approverDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/approver/assignments/${approverDetailsId}?approverType=${type}`,
      {}
    );
  }
}
