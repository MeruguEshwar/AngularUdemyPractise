import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class NotesServices {
  constructor(private http: HttpClient) {}
  getAllNotes(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/notes/get/all/${employeeDetailsId}`
    );
  }
  getEmployeeNotes(employeeDetailsId) {
    return this.http.get<ApiResponse<any>>(
      `api/notes/get/${employeeDetailsId}`
    );
  }
  saveEmployeeNotes(reqObject) {
    return this.http.post<ApiResponse<any>>(`api/notes/save`, reqObject);
  }
  deleteEmployeeNote(employeeNotesDetailsId) {
    return this.http.put<ApiResponse<any>>(
      `api/notes/delete/${employeeNotesDetailsId}`,
      {}
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
}
