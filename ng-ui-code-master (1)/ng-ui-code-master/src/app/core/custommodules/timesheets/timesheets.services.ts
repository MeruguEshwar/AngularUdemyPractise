import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class TimesheetsServices {
  constructor(private http: HttpClient) {}
  getTimesheetsHistory(
    employeeDetailsId: any,
    year: any,
    startDate?: any,
    endDate?: any
  ) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/history/get/${employeeDetailsId}?year=${year}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getAllTimesheetsHistory(year: any, startDate?: any, endDate?: any) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/history/get/all?year=${year}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getTimesheetsApproval(employeeDetailsId, year) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/for/approval/get/${employeeDetailsId}?year=${year}`
    );
  }
  getAllTimesheetsApproval(year) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/for/approval/get/all?year=${year}`
    );
  }
  getTimesheetsApprovedDenied(employeeDetailsId, year) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/approved/get/${employeeDetailsId}?year=${year}`
    );
  }
  getAllTimesheetsApprovedDenied(year) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/approved/get/all?year=${year}`
    );
  }
  getYears(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/years/get/${employeeDetailsId}`
    );
  }
  getTimesheetsDates(employeeDetailsId, timesheetDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/dates/get/${employeeDetailsId}?timesheetDetailsId=${timesheetDetailsId}`
    );
  }
  getTimesheetDetails(employeeDetailsId, timesheetPeriod) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/details/get/${employeeDetailsId}?timesheetPeriod=${timesheetPeriod}`
    );
  }
  getTimesheetDetailsById(timesheetDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/details/${timesheetDetailsId}`
    );
  }
  saveTimesheet(reqObject) {
    return this.http.post<ApiResponse<any>>(`api/timesheet/save`, reqObject);
  }
  updateTimesheet(reqObject) {
    return this.http.post<ApiResponse<any>>(`api/timesheet/update`, reqObject);
  }

  submitTimesheet(reqObject) {
    return this.http.post<ApiResponse<any>>(`api/timesheet/submit`, reqObject);
  }
  uploadTimesheet(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/timesheet/attachment/upload`,
      reqObject
    );
  }
  // uploadTimesheet(reqObject) {
  //   return this.http.post<ApiResponse<any>>(
  //     `api/timesheet/screenshot/upload`,
  //     reqObject
  //   );
  // }
  downloadTimesheet(timesheetDetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/timesheet/screenshot/download?timesheetDetailsId=${timesheetDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  downloadTimesheetById(
    timesheetAttachmentDetailsId
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/timesheet/attachment/download?timesheetAttachmentDetailsId=${timesheetAttachmentDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  deleteTimesheet(timesheetDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/screenshot/delete?timesheetDetailsId=${timesheetDetailsId}`
    );
  }
  deleteTimesheetById(timesheetAttachmentDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/attachment/delete?timesheetAttachmentDetailsId=${timesheetAttachmentDetailsId}`
    );
  }
  getApproverList(projectDetailsId, status) {
    return this.http.get<ApiResponse<any>>(
      `api/timesheet/approver/project?status=${status}&&projectDetailsId=${projectDetailsId}`
    );
  }
  getProjectAssignments(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/project/assignment/all/${employeeDetailsId}?status=1`
    );
  }
  getAllEmployees() {
    return this.http.get<ApiResponse<any>>(`api/employee/all?status=1`);
  }
  timesheetStatusUpdate(reqObject) {
    return this.http.post<ApiResponse<any>>(
      `api/timesheet/update/status`,
      reqObject
    );
  }
  downloadTimeSheetPDF(timeSheetDetailsId): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `/api/timesheet/download/as/pdf?timesheetDetailsId=${timeSheetDetailsId}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  getOnBoardedEmployees() {
    return this.http.get<ApiResponse<any>>(`api/employee/onboarded/all`);
  }
  downloadTimesheetAsExcel(timesheetDetailsIds) {
    return this.http.get<Blob>(
      `api/timesheet/download/as/excel?timesheetDetailsIds=${timesheetDetailsIds}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
}
