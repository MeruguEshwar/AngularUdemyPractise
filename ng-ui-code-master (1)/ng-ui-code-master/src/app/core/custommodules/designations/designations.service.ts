import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { Designation } from "@app/shared/models/designation.model";

@Injectable({
  providedIn: "root",
})
export class DesignationService {
  constructor(private http: HttpClient) {}
  getAllDesignations(status: number) {
    return this.http.get<ApiResponse<Designation>>(
      `api/designation/all?status=${status}`
    );
  }
  getDesignation(designationDetailsId: string) {
    return this.http.get<ApiResponse<Designation>>(
      `api/designation/${designationDetailsId}`
    );
  }
  addDesignation(designation: any) {
    return this.http.post<ApiResponse<Designation>>(
      `api/designation/add`,
      designation
    );
  }
  updateDesignation(designation: any) {
    return this.http.put<ApiResponse<Designation>>(
      "api/designation/update",
      designation
    );
  }
  activateDesignation(designationDetailsId: number) {
    return this.http.put<ApiResponse<Designation>>(
      `api/designation/activate/${designationDetailsId}`,
      {}
    );
  }
  deactivateDesignation(designationDetailsId: number) {
    return this.http.put<ApiResponse<Designation>>(
      `api/designation/deactivate/${designationDetailsId}`,
      {}
    );
  }
  isDesignationExists(designation: string) {
    return this.http.get<ApiResponse<Designation>>(
      `api/designation/exists?designation=${designation}`
    );
  }
}
