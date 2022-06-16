import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Checklist } from "@app/shared/models/checklist.model";

@Injectable({
  providedIn: "root",
})
export class ChecklistService {
  constructor(private http: HttpClient) {}
  getAllChecklists(status: number) {
    return this.http.get<ApiResponse<Checklist>>(
      `api/checklist/all?status=${status}`
    );
  }
  getDepartment(departmentDetailsId: any) {
    return this.http.get<ApiResponse<Checklist>>(
      `api/checklist/${departmentDetailsId}`
    );
  }
  addDepartment(department: any) {
    return this.http.post<ApiResponse<Checklist>>(
      `api/checklist/save`,
      department
    );
  }
  updateDepartment(department: Checklist) {
    return this.http.post<ApiResponse<Checklist>>(
      "api/checklist/save",
      department
    );
  }
  activateDepartment(departmentDetailsId: number) {
    return this.http.put<ApiResponse<Checklist>>(
      `api/checklist/activate/${departmentDetailsId}`,
      {}
    );
  }
  deactivateDepartment(departmentDetailsId: number) {
    return this.http.put<ApiResponse<Checklist>>(
      `api/checklist/deactivate/${departmentDetailsId}`,
      {}
    );
  }
  deleteEntry(checklistEntryDetailsId: number) {
    return this.http.put<ApiResponse<Checklist>>(
      `api/checklist/entry/deactivate/${checklistEntryDetailsId}`,
      {}
    );
  }

  isDepartmentExists(department: string) {
    return this.http.get<ApiResponse<Checklist>>(
      `api/checklist/exists?checklistName=${department}`
    );
  }
}
