import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@app/shared/models/api-response.model";

@Injectable({
  providedIn: "root",
})
export class BulkUploadServices {
  constructor(private http: HttpClient) {}
  downloadTemplate(template): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `api/bulkupload/template/download?template=${template}`,
      {
        observe: "response",
        responseType: "blob" as "json",
      }
    );
  }
  uploadbulkUploadFile(formData: FormData) {
    return this.http.post<ApiResponse<any>>(
      `api/bulkupload/file/upload`,
      formData
    );
  }
  validateBulkUploadDepartmentsData(organizationDetailsId: number) {
    return this.http.post<ApiResponse<any>>(
      `api/bulkupload/departments/data/validate?organizationDetailsId=${organizationDetailsId}`,
      {}
    );
  }
  saveBulkUploadDepartmentsData(organizationDetailsId: number) {
    return this.http.post<ApiResponse<any>>(
      `api/bulkupload/departments/data/save?organizationDetailsId=${organizationDetailsId}`,
      {}
    );
  }
  validateBulkUploadDesignationsData(organizationDetailsId: number) {
    return this.http.post<ApiResponse<any>>(
      `/api/bulkupload/designations/data/validate?organizationDetailsId=${organizationDetailsId}`,
      {}
    );
  }
  saveBulkUploadDesignationsData(organizationDetailsId: number) {
    return this.http.post<ApiResponse<any>>(
      `api/bulkupload/designations/data/save?organizationDetailsId=${organizationDetailsId}`,
      {}
    );
  }
  validateBulkUploadCustomersData(organizationDetailsId: number) {
    return this.http.post<ApiResponse<any>>(
      `/api/bulkupload/customers/data/validate?organizationDetailsId=${organizationDetailsId}`,
      {}
    );
  }
  saveBulkUploadCustomersData(organizationDetailsId: number) {
    return this.http.post<ApiResponse<any>>(
      `api/bulkupload/customers/data/save?organizationDetailsId=${organizationDetailsId}`,
      {}
    );
  }
}
