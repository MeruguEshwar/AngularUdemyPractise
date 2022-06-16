import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";

import { Project } from "@app/shared/models/project.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmpRequestService {
  constructor(private http: HttpClient) {}
  getAllEmployeeRequest() {
    return this.http.get<ApiResponse<any>>(
      `api/employee/request/get/all`
    );
  }
  getEmployeeRequest(employeeDetailsId,statusCode) {
    return this.http.get<ApiResponse<any>>(
      `api/employee/request/get/${employeeDetailsId}?status=${statusCode}`
    );
  }
  saveEmployeeRequest(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/employee/request/save`,
      reqObject
    );
  }
  getMessages(employeeRequestDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/employee/request/messages/get/${employeeRequestDetailsId}`
    );
  }
  sendMessage(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/employee/request/message/save`,
      reqObject
    );
  }
  deleteEmployeeRequest(employeeRequestDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/employee/request/delete/${employeeRequestDetailsId}`,{});
  }
  getEmpRequestDetailsById(employeeRequestDetailsId){
    return this.http.get<ApiResponse<any>>(
      `api/employee/request/details/get/${employeeRequestDetailsId}`
    );
  }
  deleteEmpReqMsg(employeeRequestMessageDetailsId){
    return this.http.get<ApiResponse<any>>(
      `api/employee/request/message/delete/${employeeRequestMessageDetailsId}`
    );
  }
  uploadEmpReqMsgFile(params){
    return this.http.post<ApiResponse<any>>(
      `api/employee/request/message/file/upload`,
      params
    );
  }
  empReqStatusUpdate(employeeRequestDetailsId, status,comments){
    return this.http.put<ApiResponse<any>>(
      `api/employee/request/status/update/${employeeRequestDetailsId}?status=${status}&comments=${comments}`,
      {}
    );
  }
  downloadEmpReqMsgFile(employeeRequestMessageDetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/employee/request/message/file/download/${employeeRequestMessageDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
}
