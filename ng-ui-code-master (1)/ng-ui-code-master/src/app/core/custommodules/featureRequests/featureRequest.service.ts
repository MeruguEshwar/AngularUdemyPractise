import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";

import { Project } from "@app/shared/models/project.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FeatureRequestService {
  constructor(private http: HttpClient) {}
  getAllFeatureRequest() {
    return this.http.get<ApiResponse<any>>(`api/feature/request/get/all`);
  }
  getFeatureRequest(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/feature/request/get/${employeeDetailsId}`
    );
  }
  saveEmployeeRequest(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/feature/request/save`,
      reqObject
    );
  }
  getMessages(featureRequestDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/feature/request/messages/get/${featureRequestDetailsId}`
    );
  }
  sendMessage(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/feature/request/message/save`,
      reqObject
    );
  }
  deleteEmployeeRequest(employeeRequestDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/employee/request/delete/${employeeRequestDetailsId}`,
      {}
    );
  }
  getFeatureRequestDetailsById(featureRequestDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `/api/feature/request/details/get/${featureRequestDetailsId}`
    );
  }
  deleteEmpReqMsg(employeeRequestMessageDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/employee/request/message/delete/${employeeRequestMessageDetailsId}`
    );
  }
  uploadEmpReqMsgFile(params) {
    return this.http.post<ApiResponse<any>>(
      `api/employee/request/message/file/upload`,
      params
    );
  }
  featureReqStatusUpdate(featureRequestDetailsId, status, comments) {
    return this.http.put<ApiResponse<any>>(
      `api/feature/request/status/update/${featureRequestDetailsId}?status=${status}&comments=${comments}`,
      {}
    );
  }
  downloadEmpReqMsgFile(
    employeeRequestMessageDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/employee/request/message/file/download/${employeeRequestMessageDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
}
